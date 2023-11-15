export function transliterateArabic(text) {
  var arabicToTranslitMap = {
    ا: "a",
    أ: "a",
    إ: "i",
    آ: "aa",
    ب: "b",
    ت: "t",
    ث: "th",
    ج: "j",
    ح: "h",
    خ: "kh",
    د: "d",
    ذ: "th",
    ر: "r",
    ز: "z",
    س: "s",
    ش: "sh",
    ص: "s",
    ض: "d",
    ط: "t",
    ظ: "z",
    ع: "3",
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
    ئ: "a",
    ء: "a",
    ؤ: "w",
    آ: "aa",
    ة: "",
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
