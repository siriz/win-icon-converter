// Tauri IPC 직접 사용
const invoke = window.__TAURI_INTERNALS__.invoke;

let selectedFile = null;
let convertedIconPath = null;
let currentFileSize = 0;

// 버전 정보 로드
async function loadVersion() {
    try {
        const version = await invoke('get_version');
        if (version && version !== 'unknown') {
            document.getElementById('version').textContent = `v${version}`;
        } else {
            document.getElementById('version').textContent = 'v1.0.0';
        }
        console.log('버전 로드 성공:', version);
    } catch (error) {
        console.error('버전 로드 실패:', error);
        document.getElementById('version').textContent = 'v1.0.0';
    }
}

// 언어 전환
function switchLanguage(lang) {
    if (setCurrentLanguage(lang)) {
        updateUILanguage();
        
        // 동적 콘텐츠 업데이트 (파일명, 상태 메시지 제외)
        if (selectedFile) {
            const fileName = selectedFile.split('\\').pop().split('/').pop();
            showStatus(t('selectedFile') + ' ' + fileName, 'success');
        }
        
        if (currentFileSize > 0) {
            document.getElementById('fileSize').textContent = formatFileSize(currentFileSize);
        }
        
        console.log('언어 변경:', lang);
    }
}

// 파일 크기 포맷
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 파일 선택 버튼
document.getElementById('selectBtn').addEventListener('click', async () => {
    console.log('파일 선택 버튼 클릭됨');
    
    try {
        console.log('plugin:dialog|open 호출 중...');
        const selected = await invoke('plugin:dialog|open', {
            options: {
                multiple: false,
                filters: [{
                    name: 'Image',
                    extensions: ['png', 'jpg', 'jpeg', 'bmp', 'gif']
                }]
            }
        });

        console.log('선택된 파일:', selected);
        if (selected) {
            handleFileSelect(selected);
        }
    } catch (error) {
        showStatus('파일 선택 실패: ' + error, 'error');
        console.error('파일 선택 에러:', error);
    }
});

// 파일 처리
async function handleFileSelect(filePath) {
    console.log('파일 처리 시작:', filePath);
    
    selectedFile = filePath;
    const fileName = filePath.split('\\').pop().split('/').pop();
    
    document.getElementById('fileName').textContent = fileName;
    
    // 파일 크기 가져오기 (간단한 방법으로 추정)
    try {
        // Tauri의 파일 시스템 API를 사용할 수 있다면 사용, 없으면 생략
        currentFileSize = 0; // 실제 크기는 추후 구현 가능
        document.getElementById('fileSize').textContent = '-';
    } catch (error) {
        console.log('파일 크기 조회 실패:', error);
    }
    
    document.getElementById('fileInfo').style.display = 'block';
    document.getElementById('convertBtn').disabled = false;
    document.getElementById('previewContainer').style.display = 'none';
    convertedIconPath = null;
    
    // 이미지 미리보기
    try {
        const preview = document.getElementById('preview');
        // convertFileSrc 직접 구현
        const assetUrl = `http://asset.localhost/${filePath.replace(/\\/g, '/')}`;
        preview.innerHTML = `<img src="${assetUrl}" alt="Preview" onerror="console.error('${t('errorFileLoad')}'); this.style.display='none'">`;
        console.log('미리보기 URL:', assetUrl);
    } catch (error) {
        console.error('미리보기 생성 실패:', error);
    }
    
    showStatus(t('selectedFile') + ' ' + fileName, 'success');
}

// 아이콘 변환
document.getElementById('convertBtn').addEventListener('click', async () => {
    if (!selectedFile) return;
    
    showStatus(t('convertBtn') + '...', 'success');
    document.getElementById('convertBtn').disabled = true;
    
    try {
        console.log('변환 시작:', selectedFile);
        const result = await invoke('convert_image', { inputPath: selectedFile });
        console.log('변환 결과:', result);
        
        if (result.success) {
            convertedIconPath = result.output_path;
            showStatus(t('conversionComplete'), 'success');
            document.getElementById('downloadBtn').style.display = 'block';
            document.getElementById('downloadBtn').disabled = false;
            
            // 아이콘 크기 표시
            showIconPreviews();
        } else {
            showStatus(t('errorConversion') + ' ' + result.message, 'error');
            document.getElementById('convertBtn').disabled = false;
        }
    } catch (error) {
        showStatus(t('errorConversion') + ' ' + error, 'error');
        console.error('변환 에러:', error);
        document.getElementById('convertBtn').disabled = false;
    }
});

// 다운로드
document.getElementById('downloadBtn').addEventListener('click', async () => {
    if (!convertedIconPath) return;
    
    try {
        const savePath = await invoke('plugin:dialog|save', {
            options: {
                defaultPath: 'icon.ico',
                filters: [{
                    name: 'Icon',
                    extensions: ['ico']
                }]
            }
        });
        
        console.log('저장 경로:', savePath);
        
        if (savePath) {
            // 파일 복사
            const result = await invoke('copy_file', {
                source: convertedIconPath,
                destination: savePath
            });
            
            if (result.success) {
                showStatus(t('successDownload'), 'success');
            } else {
                showStatus(t('errorDownload') + ' ' + result.message, 'error');
            }
        }
    } catch (error) {
        showStatus(t('errorDownload') + ' ' + error, 'error');
        console.error('저장 에러:', error);
    }
});

// 상태 메시지 표시
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status';
    
    if (type) {
        status.classList.add(type);
    }
}

// 아이콘 미리보기 표시
function showIconPreviews() {
    const sizes = [256, 128, 64, 48, 32, 16];
    const container = document.getElementById('previewContainer');
    const previews = document.getElementById('iconPreviews');
    
    previews.innerHTML = '';
    const assetUrl = `http://asset.localhost/${convertedIconPath.replace(/\\/g, '/')}`;
    sizes.forEach(size => {
        const div = document.createElement('div');
        div.className = 'icon-preview';
        div.innerHTML = `
            <img src="${assetUrl}" width="${size}" height="${size}" alt="${size}x${size}" style="image-rendering: pixelated;">
            <p>${size}x${size}</p>
        `;
        previews.appendChild(div);
    });
    
    container.style.display = 'block';
}

// 언어 버튼 이벤트
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        switchLanguage(lang);
    });
});

// 외부 링크 처리
document.querySelectorAll('.external-link').forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = link.dataset.url;
        try {
            await invoke('plugin:shell|open', { path: url });
        } catch (error) {
            console.error('링크 열기 실패:', error);
        }
    });
});

// 초기화
console.log('스크립트 로드됨');
console.log('Tauri Internals:', window.__TAURI_INTERNALS__);

if (window.__TAURI_INTERNALS__) {
    console.log('Tauri API 준비 완료');
    
    // 언어 초기화
    updateUILanguage();
    
    loadVersion();
} else {
    console.error('Tauri API를 사용할 수 없습니다');
    showStatus('Tauri API를 초기화할 수 없습니다', 'error');
}
