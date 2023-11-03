export const surahs = require("./surahs.json");

function getNextVerse(currentVerse) {
  // Split the current verse number into surah and verse parts
  const [surah, verse] = currentVerse.split(":").map(Number);

  // Find the chapter object based on the surah number
  const chapter = surahs.find((c) => c.surah === surah);
  if (!chapter) {
    throw new Error(`Invalid surah number: ${surah}`);
  }

  // Increment the verse number
  const nextVerse = verse + 1;

  // Check if we have reached the end of the current chapter
  if (nextVerse > chapter.verses) {
    // Move to the first verse of the next chapter
    const nextChapter = surahs.find((c) => c.surah === surah + 1);
    if (!nextChapter) {
      throw new Error(`End of Quran reached`);
    }
    return `${nextChapter.surah}:1`;
  }

  // Combine the surah and verse numbers and return the result
  return `${surah}:${nextVerse}`;
}

console.log(getNextVerse("91:7"));
