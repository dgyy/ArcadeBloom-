$maxAllowedZipSizeInBytes = 13 * 1024
$zipGamePath = "dist/index.zip"
$zipGameSize = (Get-Item $zipGamePath).Length

if ($zipGameSize -le $maxAllowedZipSizeInBytes) {
    $toSpare = $maxAllowedZipSizeInBytes - $zipGameSize
    Write-Host "***************************************************" -ForegroundColor Green
    Write-Host "Good Job! You still have ${toSpare} bytes to spare." -ForegroundColor Green
    Write-Host "***************************************************" -ForegroundColor Green
} else {
    $overhead = $zipGameSize - $maxAllowedZipSizeInBytes
    Write-Host "*******************************************************" -ForegroundColor Red
    Write-Host "Oh No! You overshot the size limit by ${overhead} bytes." -ForegroundColor Red
    Write-Host "*******************************************************" -ForegroundColor Red
}