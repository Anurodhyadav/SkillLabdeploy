import { diffWords } from 'diff';

function getDiffByCharacter(diff) {
  const different = diff.reduce(
    (accumulator, words) => {
      const wordNum = words.value.length;
      if (!(words.added || words.removed)) {
        if (words.value.trim()) {
          return {
            ...accumulator,
            charMatched: accumulator.charMatched + wordNum,
          };
        }
        return accumulator;
      }
      return accumulator;
    },
    { charMatched: 0 },
  );
  return different;
}

export default function (transcriberText, originalText) {
  const filteredOriginalText = originalText.replace(/\[(.*?)\]/g, '');
  const diff = diffWords(transcriberText, filteredOriginalText);
  const { charMatched } = getDiffByCharacter(diff);
  const accuracy = (charMatched / filteredOriginalText.length) * 100;
  return [+(100 - accuracy).toFixed(2), +accuracy.toFixed(2)];
}
