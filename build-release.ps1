# Windows Icon Converter - Release Build Script
# Builds the release version and renames it with architecture info

Write-Host "Building Windows Icon Converter (Release)..." -ForegroundColor Cyan

# Change to src-tauri directory
Set-Location -Path "$PSScriptRoot\src-tauri"

# Run cargo build
cargo build --release

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    # Clean up any extra exe files, keep only win-icon-converter.exe
    Get-ChildItem "target\release\*.exe" | Where-Object { $_.Name -ne "win-icon-converter.exe" } | Remove-Item -Force
    
    # Source path
    $sourcePath = "target\release\win-icon-converter.exe"
    
    # Display info
    if (Test-Path $sourcePath) {
        Write-Host "`nRelease file created:" -ForegroundColor Green
        
        $fileInfo = Get-Item $sourcePath
        $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
        
        Write-Host "  Name: win-icon-converter.exe" -ForegroundColor Yellow
        Write-Host "  Size: $sizeMB MB" -ForegroundColor Yellow
        
        # Create zip file
        Set-Location -Path $PSScriptRoot
        $zipPath = "win-icon-converter.zip"
        
        Write-Host "`nCreating zip file..." -ForegroundColor Cyan
        Compress-Archive -Path $sourcePath -DestinationPath $zipPath -Force
        
        if (Test-Path $zipPath) {
            $zipInfo = Get-Item $zipPath
            $zipSizeMB = [math]::Round($zipInfo.Length / 1MB, 2)
            
            Write-Host "`nZip file created:" -ForegroundColor Green
            Write-Host "  Name: win-icon-converter.zip" -ForegroundColor Yellow
            Write-Host "  Size: $zipSizeMB MB" -ForegroundColor Yellow
        }
        
        Write-Host "`nBuild complete!" -ForegroundColor Green
    } else {
        Write-Host "Error: Built executable not found at $sourcePath" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
