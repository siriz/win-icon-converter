fn main() {
    // Git 태그에서 버전 정보 가져오기
    if let Ok(output) = std::process::Command::new("git")
        .args(&["describe", "--tags", "--always", "--dirty"])
        .output()
    {
        if output.status.success() {
            let version = String::from_utf8_lossy(&output.stdout);
            let version = version.trim();
            println!("cargo:rustc-env=GIT_VERSION={}", version);
        } else {
            println!("cargo:rustc-env=GIT_VERSION=unknown");
        }
    } else {
        println!("cargo:rustc-env=GIT_VERSION=unknown");
    }
    
    // 빌드 날짜
    let now = chrono::Utc::now();
    println!("cargo:rustc-env=BUILD_DATE={}", now.format("%Y-%m-%d"));
    
    // Tauri 빌드 설정 (마지막에)
    tauri_build::build();
}
