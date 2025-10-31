# 🎨 Windows 아이콘 변환기

[![GitHub release](https://img.shields.io/github/v/release/siriz/win-icon-converter)](https://github.com/siriz/win-icon-converter/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

이미지 파일을 Windows 아이콘 파일(.ico)로 즉시 변환! 설치 불필요 - 포터블 실행 파일만 실행하세요.

**언어**: [English](README.md) | 한국어 | [日本語](README.ja.md)

**GitHub 저장소**: [https://github.com/siriz/win-icon-converter](https://github.com/siriz/win-icon-converter)

## 📸 스크린샷

<p align="center">
  <img src="screenshots/start_page.png" alt="시작 페이지" height="400">
  <img src="screenshots/coverted_page.png" alt="변환 완료 페이지" height="400">
</p>

## ✨ 특징

- 🚀 **초경량** - 약 5MB의 단일 실행 파일
- 🌐 **다국어 지원** - 영어, 한국어, 일본어
- 📴 **오프라인 동작** - 인터넷 연결 불필요
- 💼 **포터블** - 설치 불필요, 어디서든 실행 가능
- 📏 **다양한 크기** - 256x256, 128x128, 64x64, 48x48, 32x32, 16x16 생성
- 🖼️ **실시간 미리보기** - 생성된 모든 아이콘 크기를 즉시 확인
- 🎨 **다양한 형식** - PNG, JPG, JPEG, BMP, GIF 지원

## 📖 사용 방법

1. 애플리케이션 실행 (`win-icon-converter.exe`)
2. 우측 상단에서 원하는 언어 선택 (EN/JP/KR)
3. **"📁 이미지 파일 선택"** 클릭하여 이미지 선택
4. **"🔄 ICO로 변환"** 클릭하여 변환 시작
5. 생성된 모든 아이콘 크기 미리보기
6. **"💾 ICO 파일 다운로드"** 클릭하여 원하는 위치에 저장

## 📥 다운로드

### 방법 1: 직접 다운로드 (권장)
저장소에서 바로 사용 가능한 zip 파일 다운로드:
- **[win-icon-converter.zip](win-icon-converter.zip)** (~2.4 MB)

zip 파일 압축 해제 후 `win-icon-converter.exe` 실행.

### 방법 2: GitHub 릴리스
[**최신 릴리스 다운로드**](https://github.com/siriz/win-icon-converter/releases/latest)

## 🛠️ 소스에서 빌드하기

### 필수 조건
- Rust 1.70 이상
- Node.js (프론트엔드 개발용, 선택사항)

### 빌드 명령어

```powershell
# 자동 버전 명명이 포함된 빠른 릴리스 빌드
.\build-release.ps1

# 수동 빌드
cd src-tauri
cargo build --release
```

릴리스 빌드는 `src-tauri/target/release/`에 `win-icon-converter.exe` 파일을 생성합니다.

### 프로젝트 구조
```
win-icon-converter/
├── src-tauri/          # Rust 백엔드 (Tauri)
│   ├── src/
│   │   ├── main.rs           # 애플리케이션 진입점
│   │   └── icon_converter.rs # ICO 생성 로직
│   └── Cargo.toml
├── ui/                 # 프론트엔드 (HTML/CSS/JS)
│   ├── index.html
│   ├── styles.css
│   ├── main.js
│   └── i18n.js         # 다국어 지원
└── build-release.ps1   # 빌드 스크립트
```

## 🏗️ 기술 스택

- **백엔드**: [Rust](https://www.rust-lang.org/) - 안전하고 빠른 시스템 프로그래밍
- **프레임워크**: [Tauri 2.x](https://tauri.app/) - 경량 데스크톱 프레임워크
- **이미지 처리**: [image-rs](https://github.com/image-rs/image) - Rust 이미지 인코딩/디코딩
- **프론트엔드**: HTML/CSS/JavaScript (다국어 지원)
- **플러그인**: 
  - tauri-plugin-dialog - 네이티브 파일 대화상자
  - tauri-plugin-shell - 외부 링크 처리
- **빌드 최적화**: LTO, 크기 최적화 (`opt-level = "z"`)

## 📄 라이선스

이 프로젝트는 MIT 라이선스로 배포됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

**개인 및 상업 프로젝트에 무료로 사용 가능!**

## 👤 제작자

**SIRIZ**

- GitHub: [@siriz](https://github.com/siriz)
- 프로젝트 링크: [https://github.com/siriz/win-icon-converter](https://github.com/siriz/win-icon-converter)

## ⭐ 지원하기

이 프로젝트가 유용하다면 GitHub에서 ⭐를 눌러주세요!

---

Made with ❤️ by [SIRIZ](https://github.com/siriz)
