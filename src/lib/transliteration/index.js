export function transliterateArabic(text) {
  var arabicToTranslitMap = {
    ء: "ʔ",
    ا: "a",
    أ: "ā",
    آ: "ā",
    ب: "b",
    ت: "t",
    ث: "th",
    ج: "j",
    ح: "ḥ",
    خ: "kh",
    د: "d",
    ذ: "dh",
    ر: "r",
    ز: "z",
    س: "s",
    ش: "sh",
    ص: "ṣ",
    ض: "ḍ",
    ط: "ṭ",
    ظ: "ẓ",
    ع: "ʿ",
    غ: "gh",
    ف: "f",
    ق: "q",
    ك: "k",
    ل: "l",
    م: "m",
    ن: "n",
    ه: "h",
    و: "w",
    ي: "y",
    ى: "a",
    ئ: "ʾ",
    آ: "ā",
    ة: "h",
  };

  var transliteratedText = "";
  for (var i = 0; i < text.length; i++) {
    var char = text[i];
    transliteratedText += arabicToTranslitMap[char] || char;
  }

  return transliteratedText;
}

export function removeTashkeel(word) {
  const regex = /[ء-ي\s]/g; // Include \s to match spaces
  const tokens = word.match(regex);
  const wordNoTashkeel = tokens ? tokens.join("") : "";
  return wordNoTashkeel;
}
