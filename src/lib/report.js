export function historyFor(attempts) {
  const result = { pre: null, post: null };
  for (const row of [...attempts].sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    if (row.type === 'pre' && result.pre) continue;
    result[row.type] = row.result;
  }
  return result;
}
const mean = numbers => numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : null;
export function buildReport(data) {
  const students = data.students.map(student => ({ ...student,
    history: historyFor(data.attempts.filter(a => a.student_id === student.id)),
    completedChallenges: new Set(data.challenges.filter(c => c.student_id === student.id && c.correct).map(c => c.challenge_id)).size
  }));
  const pre = students.filter(s => s.history.pre);
  const post = students.filter(s => s.history.post);
  const paired = students.filter(s => s.history.pre && s.history.post);
  const pairedPre = mean(paired.map(s => s.history.pre.score));
  const pairedPost = mean(paired.map(s => s.history.post.score));
  const skills = new Map();
  for (const s of post) for (const detail of s.history.post.details) {
    const current = skills.get(detail.skill) || { skill: detail.skill, correct: 0, total: 0 };
    current.correct += Number(detail.isCorrect); current.total++;
    skills.set(detail.skill, current);
  }
  return { students, preCount: pre.length, postCount: post.length, pairedCount: paired.length,
    preAverage: mean(pre.map(s => s.history.pre.score)), postAverage: mean(post.map(s => s.history.post.score)),
    pairedPre, pairedPost, improvement: paired.length ? pairedPost - pairedPre : null,
    masteryCount: post.filter(s => s.history.post.score >= 85).length,
    masteryRate: post.length ? post.filter(s => s.history.post.score >= 85).length / post.length * 100 : null,
    skills: [...skills.values()] };
}
export const formatPercent = value => value == null ? '—' : `${Number(value.toFixed(1))}%`;
export function studentStatus(history) {
  if (!history.pre) return 'لم تبدأ';
  if (!history.post) return 'قيد التدريب';
  if (history.post.score >= 95) return 'متقنة بتفوق';
  return history.post.score >= 85 ? 'متقنة' : 'تحتاج إلى تعزيز';
}
export function studentsCsv(students, anonymous = false) {
  const cell = value => {
    let text = String(value ?? '');
    if (/^[\s]*[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return '\ufeff' + [['الرمز', 'الاسم', 'القبلي %', 'البعدي %', 'التغير بالنقاط', 'التحديات المكتملة', 'الحالة'],
    ...students.map(s => [s.code, anonymous ? `طالبة ${s.code}` : s.name, s.history.pre?.score, s.history.post?.score,
      s.history.pre && s.history.post ? s.history.post.score - s.history.pre.score : '', s.completedChallenges, studentStatus(s.history)])]
    .map(row => row.map(cell).join(',')).join('\r\n');
}
