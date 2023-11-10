import surahs from "./surahs.json";
import {
  addToIndexedDB,
  updateDailyVerseCount,
  isDailyVerseLimitReached,
} from "$lib/db";

// Function to remove tashkeel from a word
export function removeTashkeel(word) {
  const regex = /[ء-ي]/g;
  const tokens = word.match(regex);
  const wordNoTashkeel = tokens ? tokens.join("") : "";
  return wordNoTashkeel;
}

export function calculateHasanat(cleanText) {
  const rewardPerLetter = 10;
  const arabicLetters = cleanText.match(/[ء-ي]/g);
  const hasanat = arabicLetters ? arabicLetters.length * rewardPerLetter : 0;
  return hasanat;
}

// Function to get the next verse
export function getNextVerse(currentVerse) {
  const [surah, verse] = currentVerse.split(":").map(Number);
  const chapter = surahs.find((c) => c.surah === surah);

  if (!chapter) {
    throw new Error(`Invalid surah number: ${surah}`);
  }

  const nextVerse = verse + 1;
  if (nextVerse > chapter.verses) {
    const nextChapter = surahs.find((c) => c.surah === surah + 1);
    if (!nextChapter) {
      throw new Error(`End of Quran reached`);
    }
    return `${nextChapter.surah}:1`;
  }
  return `${surah}:${nextVerse}`;
}

// Function to fetch Quran verse text from Quran.com API
export async function fetchTranslation(verseKey, translationID) {
  try {
    const response = await fetch(
      `https://api.quran.com/api/v4/quran/translations/${translationID}?verse_key=${verseKey}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch translation text");
    }
    const data = await response.json();
    console.log(data);
    const translationText = data.translations[0].text;
    return translationText;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function fetchVerseText(verseKey, translationID = 131) {
  try {
    const [surah, verse] = verseKey.split(":");
    const translationText = await fetchTranslation(verseKey, translationID);

    const response = await fetch(
      `https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${verseKey}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Quran verse text");
    }
    const data = await response.json();

    if (data && data.verses && data.verses.length > 0) {
      const verseText = data.verses[0].text_uthmani || "";
      return {
        text_uthmani: verseText,
        translation: translationText,
      };
    } else {
      throw new Error("No verse text found in the response");
    }
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function startReading(
  userId,
  chapter,
  verse,
  dailyVerseLimit = localStorage.getItem("dailyVerseLimit") || 10
) {
  try {
    if (isDailyVerseLimitReached()) {
      console.log("Max amount read");
      return {
        message: "Max amount read",
        versesReadToday: dailyVerseLimit,
      };
    }

    let currentVerse = localStorage.getItem("currentVerse") || "1:1";

    const selectedTranslationID =
      localStorage.getItem("selectedTranslation") || 131;

    let verseTextData = await fetchVerseText(
      currentVerse,
      selectedTranslationID
    );
    const hasanat = calculateHasanat(verseTextData.text_uthmani);

    const today = new Date();
    const day = today.toISOString().split("T")[0];
    let versesReadToday = 1;

    if (localStorage.getItem(day) !== null) {
      versesReadToday = parseInt(localStorage.getItem(day));
    }

    if (versesReadToday <= dailyVerseLimit) {
      console.log("Go");
      return {
        message: "Go",
        currentVerse,
        verseText: verseTextData.text_uthmani,
        translationText: verseTextData.translation,
        hasanat,
        dailyVerseLimit,
        versesReadToday,
      };
    } else {
      console.log("Max amount read");
      return {
        message: "Max amount read",
        versesReadToday: dailyVerseLimit,
      };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function readNextVerse(
  userId,
  currentVerse,
  dailyVerseLimit = localStorage.getItem("dailyVerseLimit") || 10
) {
  try {
    const today = new Date();
    const day = today.toISOString().split("T")[0];
    let versesReadToday = 1;

    if (localStorage.getItem(day) !== null) {
      versesReadToday = parseInt(localStorage.getItem(day));
    }

    if (versesReadToday >= dailyVerseLimit) {
      console.log("You have read enough for today.");
      return {
        message: "Max amount read",
        versesReadToday: dailyVerseLimit,
      };
    }

    const selectedTranslationID =
      localStorage.getItem("selectedTranslation") || 131;

    console.log("Verses read today", versesReadToday);

    const nextVerse = getNextVerse(currentVerse);
    let verseTextData = await fetchVerseText(nextVerse, selectedTranslationID);

    addToIndexedDB(
      "Statistics",
      {
        name: nextVerse,
        currentVerse: nextVerse,
        verseText: verseTextData.text_uthmani,
        translationText: verseTextData.translation,
        hasanat: calculateHasanat(verseTextData.text_uthmani),
        dailyVerseLimit,
        versesReadToday,
        date: Date(),
      },
      "Ayahs"
    )
      .then((successMessage) => console.log(successMessage))
      .catch((errorMessage) => console.error(errorMessage));

    localStorage.setItem("currentVerse", nextVerse);
    updateDailyVerseCount();

    return {
      currentVerse: nextVerse,
      verseText: verseTextData.text_uthmani,
      translationText: verseTextData.translation,
      hasanat: calculateHasanat(verseTextData.text_uthmani),
      dailyVerseLimit,
      message: "Continue read",
      versesReadToday,
      date: Date(),
    };
  } catch (error) {
    console.error(error);
  }
}

export async function startCustomReading(userId, startVerse) {
  try {
    let currentVerse =
      startVerse || localStorage.getItem("currentVerse") || "1:1";

    const selectedTranslationID =
      localStorage.getItem("selectedTranslation") || 131;

    let verseTextData = await fetchVerseText(
      currentVerse,
      selectedTranslationID
    );
    const hasanat = calculateHasanat(verseTextData.text_uthmani);

    return {
      message: "Go",
      currentVerse,
      verseText: verseTextData.text_uthmani,
      translationText: verseTextData.translation,
      hasanat,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function readNextCustomVerse(userId, currentVerse) {
  try {
    const selectedTranslationID =
      localStorage.getItem("selectedTranslation") || 131;

    const nextVerse = getNextVerse(currentVerse);
    let verseTextData = await fetchVerseText(nextVerse, selectedTranslationID);

    addToIndexedDB(
      "Statistics",
      {
        name: nextVerse,
        currentVerse: nextVerse,
        verseText: verseTextData.text_uthmani,
        translationText: verseTextData.translation,
        hasanat: calculateHasanat(verseTextData.text_uthmani),
        date: Date(),
      },
      "Ayahs"
    )
      .then((successMessage) => console.log(successMessage))
      .catch((errorMessage) => console.error(errorMessage));

    localStorage.setItem("currentVerse", nextVerse);

    return {
      currentVerse: nextVerse,
      verseText: verseTextData.text_uthmani,
      translationText: verseTextData.translation,
      hasanat: calculateHasanat(verseTextData.text_uthmani),
      message: "Continue read",
      date: Date(),
    };
  } catch (error) {
    console.error(error);
  }
}
