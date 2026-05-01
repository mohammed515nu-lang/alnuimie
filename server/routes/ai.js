const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
// قاعدة المعرفة المحلية معطّلة — الإجابات فقط عبر NVIDIA (NVIDIA_API_KEY / NVIDIA_CHAT_MODEL على الخادم).

function systemPromptForRole(role) {
  const who = role === 'contractor' ? 'مقاولاً' : 'صاحب مشروع (عميلاً)';
  return [
    'أنت "مساعد بنيان" لتطبيق إدارة المقاولات والمشاريع في سوريا.',
    `المستخدم ${who}.`,
    'أجب بالعربية باختصار ووضوح، ركّز على: العقود، الدفعات، المحاسبة، التواصل، المشاريع، والسلامة المهنية.',
    'إذا لم تكن متأكداً من رقم أو قانون محدد، نصح بعدم الاعتماد على أرقام دقيقة دون مراجعة جهة مختصة.',
  ].join(' ');
}

/**
 * NVIDIA NIM / Build — واجهة متوافقة مع OpenAI Chat Completions.
 * المتغيرات (على الخادم فقط، مثلاً Render → Environment):
 *   NVIDIA_API_KEY
 *   NVIDIA_CHAT_MODEL  (مثال شكل المعرف: meta/llama-3.1-8b-instruct — انسخ المعرف من كتالوج نماذج NVIDIA)
 *   NVIDIA_API_BASE_URL (اختياري، الافتراضي https://integrate.api.nvidia.com/v1)
 */
async function answerWithNvidia(question, role) {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  const model = process.env.NVIDIA_CHAT_MODEL?.trim();
  if (!apiKey || !model) return null;

  const base = (process.env.NVIDIA_API_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/$/, '');
  const url = `${base}/chat/completions`;

  const controller = new AbortController();
  const timeoutMs = Number(process.env.NVIDIA_CHAT_TIMEOUT_MS || 55000);
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPromptForRole(role) },
          { role: 'user', content: question },
        ],
        max_tokens: Math.min(Number(process.env.NVIDIA_MAX_TOKENS || 900), 4096),
        temperature: Math.min(Math.max(Number(process.env.NVIDIA_TEMPERATURE || 0.35), 0), 2),
      }),
    });

    const rawText = await res.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`NVIDIA: non-JSON response (${res.status})`);
    }

    if (!res.ok) {
      const msg = data?.error?.message || data?.message || rawText.slice(0, 300);
      throw new Error(`NVIDIA ${res.status}: ${msg}`);
    }

    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error('NVIDIA: empty choices[0].message.content');

    return {
      answer,
      role,
      category: 'nvidia-llm',
      source: 'nvidia',
    };
  } finally {
    clearTimeout(timer);
  }
}

router.post('/ask', authenticate, async (req, res) => {
  try {
    const question = String(req.body?.question ?? '').trim();
    if (!question) return res.status(400).json({ error: 'Question is required' });
    if (question.length > 2000) return res.status(400).json({ error: 'Question is too long' });

    const role = req.userRole === 'contractor' ? 'contractor' : 'client';

    if (!process.env.NVIDIA_API_KEY?.trim() || !process.env.NVIDIA_CHAT_MODEL?.trim()) {
      return res.status(503).json({
        error: 'AI unavailable',
        message:
          'مساعد بنيان غير مهيأ على الخادم. أضف NVIDIA_API_KEY و NVIDIA_CHAT_MODEL في متغيرات البيئة (Render) ثم أعد النشر.',
        source: 'unconfigured',
      });
    }

    try {
      const llm = await answerWithNvidia(question, role);
      if (llm) return res.json(llm);
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      console.error('[ai] NVIDIA failed (no knowledge fallback):', detail);
      return res.status(502).json({
        error: 'AI provider error',
        message: 'تعذر الحصول على إجابة من NVIDIA. تحقق من المفتاح والنموذج في الخادم، أو حاول لاحقاً.',
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
