export const getTopAnswers = (tus: any[]) => {
  const answers = tus.map((tu) => tu.normalized_answer);
  const answersCount = answers.reduce<Record<string, number>>((acc, a) => {
    if (a in acc) {
      return { ...acc, [a]: acc[a] + 1 };
    }
    return { ...acc, [a]: 1 };
  }, {});

  return Object.entries(answersCount).sort((a, b) => b[1] - a[1]);
};
