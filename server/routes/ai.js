const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { contractorKnowledge, clientKnowledge } = require('../data/bunyanKnowledgeBase');

function normalizeArabic(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bestMatch(question, knowledge) {
  const q = normalizeArabic(question);
  let best = null;
  let bestScore = -1;

  for (const item of knowledge) {
    const candidate = normalizeArabic(item.question);
    const tokens = candidate.split(' ').filter(Boolean);
    const score = tokens.reduce((acc, t) => (q.includes(t) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best;
}

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
    const knowledge = role === 'contractor' ? contractorKnowledge : clientKnowledge;

    if (process.env.NVIDIA_API_KEY?.trim() && process.env.NVIDIA_CHAT_MODEL?.trim()) {
      try {
        const llm = await answerWithNvidia(question, role);
        if (llm) return res.json(llm);
      } catch (e) {
        console.error('[ai] NVIDIA failed, falling back to knowledge base:', e.message);
      }
    }

    const matched = bestMatch(question, knowledge);

    if (!matched) {
      return res.json({
        answer:
          'شكرا لسؤالك. حاليا قاعدة المعرفة لا تحتوي إجابة مباشرة لهذا السؤال. حاول إعادة صياغته بصيغة أوضح عن العقود، الدفعات، التنفيذ أو إدارة الموقع.',
        role,
        category: 'fallback',
      });
    }

    return res.json({
      answer: matched.answer,
      matchedQuestion: matched.question,
      category: matched.category,
      role,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to answer question', message: error.message });
  }
});

module.exports = router;
