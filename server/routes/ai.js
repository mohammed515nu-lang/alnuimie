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

router.post('/ask', authenticate, async (req, res) => {
  try {
    const question = String(req.body?.question ?? '').trim();
    if (!question) return res.status(400).json({ error: 'Question is required' });
    if (question.length > 2000) return res.status(400).json({ error: 'Question is too long' });

    const role = req.userRole === 'contractor' ? 'contractor' : 'client';
    const knowledge = role === 'contractor' ? contractorKnowledge : clientKnowledge;
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
