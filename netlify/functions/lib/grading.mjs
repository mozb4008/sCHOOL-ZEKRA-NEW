import { preTestQuestions, postTestQuestions } from '../../../src/data/prePostTestData.js';
import { errorChallengeBank } from '../../../src/data/errorChallengeData.js';

export function publicQuestions() {
  const strip = rows => rows.map(({ id, skill, question, options, textbookRef }) => ({ id, skill, question, options, textbookRef }));
  return { pre: strip(preTestQuestions), post: strip(postTestQuestions) };
}

export function gradeAssessment(type, answers, seconds) {
  if (!['pre', 'post'].includes(type)) throw new Error('نوع الاختبار غير صحيح.');
  const questions = type === 'pre' ? preTestQuestions : postTestQuestions;
  if (!answers || typeof answers !== 'object' || Array.isArray(answers) ||
      questions.some((q, i) => !Number.isInteger(answers[i]) || answers[i] < 0 || answers[i] >= q.options.length) ||
      Object.keys(answers).length !== questions.length) throw new Error('أجيبي عن جميع الأسئلة قبل التسليم.');
  if (!Number.isInteger(seconds) || seconds < 0 || seconds > 86400) throw new Error('زمن الاختبار غير صحيح.');
  const details = questions.map((q, i) => ({ questionId: q.id, skill: q.skill,
    isCorrect: answers[i] === q.correctAnswer, userChoice: answers[i], correctAnswer: q.correctAnswer, explanation: q.explanation, textbookRef: q.textbookRef }));
  const correctCount = details.filter(d => d.isCorrect).length;
  return { score: correctCount / questions.length * 100, correctCount, totalQuestions: questions.length,
    mistakesCount: questions.length - correctCount, timeSpentSeconds: seconds,
    timeSpentFormatted: `${Math.floor(seconds / 60)} دقيقة و ${seconds % 60} ثانية`, details };
}

export function gradeChallenge(id, choice) {
  const question = errorChallengeBank.find(q => q.id === id);
  if (!question || !Number.isInteger(choice) || !question.options?.[choice]) throw new Error('إجابة التحدي غير صحيحة.');
  return question.options[choice].isCorrect;
}

export function assessmentHistory(rows) {
  const history = { pre: null, post: null };
  for (const row of [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    if (row.type === 'pre' && history.pre) continue;
    history[row.type] = { ...row.result, completedAt: new Date(row.created_at).toLocaleDateString('ar-SA'), createdAt: row.created_at };
  }
  return history;
}
