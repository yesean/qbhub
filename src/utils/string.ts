export const removeExtraSpaces = (s: string) => {
  return s.replaceAll(/\s\s+/g, ' ').trim();
};

export const getRand = (n: number) => Math.floor(Math.random() * n);

export const shuffleString = (s: string) => {
  const chars = s.split('');
  const shuffled = [];
  while (shuffled.length < s.length) {
    const randomIndex = getRand(chars.length);
    const [removedChar] = chars.splice(randomIndex, 1);
    shuffled.push(removedChar);
  }
  return shuffled.join('');
};

export const cleanTossupText = (text: string) => {
  return removeExtraSpaces(
    text
      .replaceAll(/<\/strong>\s*\(\*\)/g, '(*) </strong>')
      .replaceAll(/\(\*\)/g, ' (*) '),
  );
};
