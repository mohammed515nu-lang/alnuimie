const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
// قاعدة المعرفة المحلية معطّلة — الإجابات فقط عبر NVIDIA (NVIDIA_API_KEY + نموذج/نماذج على الخادم).

function systemPromptForRole(role) {
  const who = role === 'contractor' ? 'مقاولاً' : 'صاحب مشروع (عميلاً)';
  return [
    'أنت "مساعد بنيان" لتطبيق إدارة المقاولات والمشاريع في سوريا.',
    `المستخدم ${who}.`,
    'أجب بالعربية باختصار ووضوح، ركّز على: العقود، الدفعات، المحاسبة، التواصل، المشاريع، والسلامة المهنية.',
    'كن مختصراً: فقرة أو فقرتان كحد أقصى ما لم يُطلب منك التفصيل صراحةً.',
    'إذا لم تكن متأكداً من رقم أو قانون محدد، نصح بعدم الاعتماد على أرقام دقيقة دون مراجعة جهة مختصة.',
  ].join(' ');
}

/**
 * NVIDIA NIM / Build — واجهة متوافقة مع OpenAI Chat Completions.
 *
 * النماذج (Render → Environment):
 *   NVIDIA_API_KEY
 *   NVIDIA_CHAT_MODEL_FAST — اختياري؛ إن وُجد يُستخدم كأول نموذج (عادةً أخف وأسرع).
 *   NVIDIA_CHAT_MODEL — إلزامي إذا لم يُضبط FAST؛ وإن وُجد FAST مع MODEL مختلف، يُستخدم MODEL كنموذج ثانٍ احتياطي.
 *   NVIDIA_CHAT_MODEL_FALLBACK — اختياري؛ نموذج ثانٍ إذا عُيّن ويختلف عن الأول (يتقدّم على استخدام MODEL كاحتياطي عند تعيينه).
 *   NVIDIA_API_BASE_URL — اختياري؛ يُقبل فقط مضيف integrate.api.nvidia.com (Build Chat Completions).
 *     أي عنوان NVCF أو «دالة» آخر يُتجاهل ويُستخدم الافتراضي لتجنّب 404 برسالة Function id.
 *   NVIDIA_CHAT_TIMEOUT_MS (افتراضي 120000، حتى 480000)
 */
const DEFAULT_NVIDIA_CHAT_BASE = 'https://integrate.api.nvidia.com/v1';

/** يقتصر على واجهة NVIDIA Build (OpenAI-style). عناوين NVCF تسبب 404 «Function id … not found». */
function resolveNvidiaChatBaseUrl() {
  const raw = (process.env.NVIDIA_API_BASE_URL || '').trim();
  if (!raw) return DEFAULT_NVIDIA_CHAT_BASE;
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (u.hostname.toLowerCase() !== 'integrate.api.nvidia.com') {
      console.warn(
        `[ai] NVIDIA_API_BASE_URL ignored (host "${u.hostname}"); use Build integrate only or unset. Using ${DEFAULT_NVIDIA_CHAT_BASE}.`
      );
      return DEFAULT_NVIDIA_CHAT_BASE;
    }
    return DEFAULT_NVIDIA_CHAT_BASE;
  } catch {
    console.warn('[ai] Invalid NVIDIA_API_BASE_URL; using default integrate chat URL.');
    return DEFAULT_NVIDIA_CHAT_BASE;
  }
}

function nvidiaHttpErrorBody(data, rawText, status) {
  if (!data || typeof data !== 'object') return rawText.slice(0, 400);
  const d = data;
  const nested = typeof d.error === 'object' && d.error !== null ? d.error.message : null;
  const flat =
    nested ||
    (typeof d.error === 'string' ? d.error : null) ||
    d.message ||
    (typeof d.detail === 'string' ? d.detail : d.detail != null ? JSON.stringify(d.detail) : null) ||
    (typeof d.title === 'string' && d.detail ? `${d.title}: ${typeof d.detail === 'string' ? d.detail : JSON.stringify(d.detail)}` : null);
  if (flat) return `NVIDIA ${status}: ${flat}`;
  return rawText.slice(0, 400);
}

function isAbortError(e) {
  return (
    (e && typeof e === 'object' && 'name' in e && e.name === 'AbortError') ||
    /aborted/i.test(e instanceof Error ? e.message : String(e))
  );
}

/** يحدد ترتيب النماذج: رئيسي ثم واحد احتياطي كحد أقصى. */
function resolveModelChain() {
  const fast = process.env.NVIDIA_CHAT_MODEL_FAST?.trim();
  const main = process.env.NVIDIA_CHAT_MODEL?.trim();
  const explicitFb = process.env.NVIDIA_CHAT_MODEL_FALLBACK?.trim();

  const primary = fast || main || '';
  if (!primary) return [];

  const chain = [{ model: primary, source: 'nvidia' }];

  let secondary = null;
  if (explicitFb && explicitFb !== primary) {
    secondary = explicitFb;
  } else if (fast && main && main !== fast) {
    secondary = main;
  }

  if (secondary) {
    chain.push({ model: secondary, source: 'nvidia-fallback' });
  }

  return chain;
}

function buildRequestBody(model, role, question) {
  return JSON.stringify({
    model,
    messages: [
      { role: 'system', content: systemPromptForRole(role) },
      { role: 'user', content: question },
    ],
    max_tokens: Math.min(Math.max(Number(process.env.NVIDIA_MAX_TOKENS || 480), 64), 2048),
    temperature: Math.min(Math.max(Number(process.env.NVIDIA_TEMPERATURE || 0.35), 0), 2),
  });
}

/**
 * طلب واحد لنموذج معين، مع إعادة محاولة عند الإلغاء فقط (timeout).
 */
async function fetchNvidiaForModel(apiKey, url, body, timeoutMs) {
  const maxAttempts = 2;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body,
      });

      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`NVIDIA: non-JSON response (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(nvidiaHttpErrorBody(data, rawText, res.status));
      }

      const answer = data?.choices?.[0]?.message?.content?.trim();
      if (!answer) throw new Error('NVIDIA: empty choices[0].message.content');

      return { answer };
    } catch (e) {
      if (isAbortError(e)) {
        if (attempt < maxAttempts - 1) {
          console.warn('[ai] NVIDIA timeout/aborted; retrying once after short delay…');
          await new Promise((r) => setTimeout(r, 2500));
          continue;
        }
        throw new Error(
          `NVIDIA: timeout after ${timeoutMs}ms per attempt (${maxAttempts} attempts). سبات Render أو بطء/طابور NVIDIA. جرّب لاحقاً أو عيّن NVIDIA_CHAT_TIMEOUT_MS حتى 480000 على Render.`
        );
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }
}

async function answerWithNvidia(question, role) {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  if (!apiKey) return null;

  const chain = resolveModelChain();
  if (chain.length === 0) return null;

  const base = resolveNvidiaChatBaseUrl();
  const url = `${base}/chat/completions`;

  const rawTimeout = Number(process.env.NVIDIA_CHAT_TIMEOUT_MS || 120000);
  const timeoutMs = Math.min(Math.max(Number.isFinite(rawTimeout) ? rawTimeout : 120000, 20000), 480000);

  let lastErr = null;
  for (let i = 0; i < chain.length; i++) {
    const { model, source } = chain[i];
    const body = buildRequestBody(model, role, question);
    try {
      const { answer } = await fetchNvidiaForModel(apiKey, url, body, timeoutMs);
      return {
        answer,
        role,
        category: 'nvidia-llm',
        source,
      };
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      if (i < chain.length - 1) {
        console.warn(`[ai] model "${model}" failed (${msg}); trying fallback model…`);
      } else {
        throw lastErr;
      }
    }
  }

  return null;
}

router.post('/ask', authenticate, async (req, res) => {
  try {
    const question = String(req.body?.question ?? '').trim();
    if (!question) return res.status(400).json({ error: 'Question is required' });
    if (question.length > 2000) return res.status(400).json({ error: 'Question is too long' });

    const role = req.userRole === 'contractor' ? 'contractor' : 'client';

    const fast = process.env.NVIDIA_CHAT_MODEL_FAST?.trim();
    const main = process.env.NVIDIA_CHAT_MODEL?.trim();
    if (!process.env.NVIDIA_API_KEY?.trim() || !(fast || main)) {
      return res.status(503).json({
        error: 'AI unavailable',
        message:
          'مساعد بنيان غير مهيأ على الخادم. أضف NVIDIA_API_KEY و (NVIDIA_CHAT_MODEL_FAST أو NVIDIA_CHAT_MODEL) في متغيرات البيئة (Render) ثم أعد النشر.',
        source: 'unconfigured',
      });
    }

    try {
      const llm = await answerWithNvidia(question, role);
      if (llm) return res.json(llm);
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      console.error('[ai] NVIDIA failed (no knowledge fallback):', detail);
      const timeoutHint =
        /timeout after \d+ms/i.test(detail) || /NVIDIA: timeout/i.test(detail)
          ? ' انتهت مهلة الطلب (محاولتان لكل نموذج). جرّب بعد قليل، أو راجع NVIDIA_CHAT_TIMEOUT_MS.'
          : '';
      const rateHint = /429|too many requests/i.test(detail)
        ? ' تجاوزت حد الطلبات لدى NVIDIA (429)؛ انتظر دقيقتين أو راجع خطة الاستخدام.'
        : '';
      const functionIdHint = /Function id|function in account/i.test(detail)
        ? ' احذف NVIDIA_API_BASE_URL من Render أو اتركه لـ https://integrate.api.nvidia.com/v1 فقط (روابط NVCF تسبب هذا الخطأ).'
        : '';
      return res.status(502).json({
        error: 'AI provider error',
        message: `تعذر الحصول على إجابة من NVIDIA.${timeoutHint}${rateHint}${functionIdHint} تحقق من المفتاح وNVIDIA_CHAT_MODEL من صفحة النموذج على build.nvidia.com، أو راجع سجلات الخادم.`,
        source: 'nvidia-error',
      });
    }

    return res.status(503).json({
      error: 'AI unavailable',
      message: 'لم يُرجع نموذج NVIDIA إجابة. تحقق من إعدادات الخادم.',
      source: 'nvidia-empty',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to answer question', message: error.message });
  }
});

module.exports = router;
