// Internationalization (i18n) for Windows Icon Generator
// Default language: English

const translations = {
  en: {
    title: "Windows Icon Converter",
    description1: "Convert image files to Windows icon files (.ico).",
    description2: "Includes 256x256, 128x128, 64x64, 48x48, 32x32, 16x16 sizes.",
    selectFile: "📁 Select Image File",
    selectHint: "PNG, JPG, JPEG, BMP, GIF",
    selectedFile: "Selected File:",
    fileSize: "File Size:",
    convertBtn: "🔄 Convert to ICO",
    downloadBtn: "💾 Download ICO File",
    previewTitle: "Preview (Generated Icon Sizes)",
    conversionComplete: "✅ Conversion Complete!",
    generatedSizes: "Generated sizes:",
    errorTitle: "Error",
    errorFileLoad: "Failed to load file. Please select an image file.",
    errorConversion: "Conversion failed:",
    errorDownload: "Download failed:",
    successDownload: "File saved successfully!",
    version: "Version"
  },
  
  ja: {
    title: "Windows アイコン変換",
    description1: "画像ファイルをWindowsアイコンファイル(.ico)に変換します。",
    description2: "256x256, 128x128, 64x64, 48x48, 32x32, 16x16のサイズが含まれます。",
    selectFile: "📁 画像ファイルを選択",
    selectHint: "PNG, JPG, JPEG, BMP, GIF",
    selectedFile: "選択されたファイル:",
    fileSize: "ファイルサイズ:",
    convertBtn: "🔄 ICOに変換",
    downloadBtn: "💾 ICOファイルをダウンロード",
    previewTitle: "プレビュー（生成されたアイコンサイズ）",
    conversionComplete: "✅ 変換完了！",
    generatedSizes: "生成されたサイズ:",
    errorTitle: "エラー",
    errorFileLoad: "ファイルの読み込みに失敗しました。画像ファイルを選択してください。",
    errorConversion: "変換に失敗しました:",
    errorDownload: "ダウンロードに失敗しました:",
    successDownload: "ファイルが正常に保存されました！",
    version: "バージョン"
  },
  
  ko: {
    title: "Windows 아이콘 변환기",
    description1: "이미지 파일을 Windows 아이콘 파일(.ico)로 변환합니다.",
    description2: "256x256, 128x128, 64x64, 48x48, 32x32, 16x16 크기가 포함됩니다.",
    selectFile: "📁 이미지 파일 선택",
    selectHint: "PNG, JPG, JPEG, BMP, GIF",
    selectedFile: "선택된 파일:",
    fileSize: "파일 크기:",
    convertBtn: "🔄 ICO로 변환",
    downloadBtn: "💾 ICO 파일 다운로드",
    previewTitle: "미리보기 (생성된 아이콘 크기)",
    conversionComplete: "✅ 변환 완료!",
    generatedSizes: "생성된 크기:",
    errorTitle: "오류",
    errorFileLoad: "파일을 불러오는데 실패했습니다. 이미지 파일을 선택해주세요.",
    errorConversion: "변환 실패:",
    errorDownload: "다운로드 실패:",
    successDownload: "파일이 성공적으로 저장되었습니다!",
    version: "버전"
  }
};

// Get current language from localStorage (default: 'en')
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'en';
}

// Set current language to localStorage
function setCurrentLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('language', lang);
    return true;
  }
  return false;
}

// Get translation for a key
function t(key) {
  const lang = getCurrentLanguage();
  return translations[lang]?.[key] || translations.en[key] || key;
}

// Update all UI text elements with current language
function updateUILanguage() {
  const lang = getCurrentLanguage();
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = translations[lang]?.[key] || translations.en[key];
    
    if (translation) {
      // Handle different element types
      if (element.tagName === 'INPUT') {
        element.value = translation;
      } else {
        // For buttons, spans, paragraphs, etc., use textContent
        element.textContent = translation;
      }
    }
  });
  
  // Update language selector active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { t, getCurrentLanguage, setCurrentLanguage, updateUILanguage };
}
