param($Source,$Target)

$levels = @(0, 1, 3, 5, 7, 9)
$methods = @("Deflate", "Deflate64", "BZip2", "LZMA", "PPMd")

$maxAllowedZipSizeInBytes = 13 * 1024

$bestArchive = $null
$bestSize = [long]::MaxValue

# Loop through the compression levels
foreach ($level in $levels) {
    foreach ($method in $methods) {
        # Define the archive filename based on the compression level
        $archiveName = "src.$method.$level.zip"
        $archivePath = Join-Path -Path $Target -ChildPath $archiveName

        # Create the archive with the specified compression level
        7z a -tzip -mx="$level" -mm="$method" "$archivePath" "$Source"

        # Get the size of the created archive
        $archiveSize = (Get-Item $archivePath).Length

        # Check if this archive is the smallest so far
        if ($archiveSize -lt $bestSize) {
            if (($bestArchive -ne $null) -and (Test-Path $bestArchive))
            {
                Remove-Item $bestArchive -Force
            }

            $bestSize = $archiveSize
            $bestArchive = $archivePath
        } else {
            Remove-Item $archivePath -Force
        }
    }
}

# Display the path of the best archive
Write-Host "---------------------------------------"
Write-Host "BEST ARCHIVE: ${bestArchive}"
Write-Host "BEST SIZE: ${bestSize} bytes."

if ($bestSize -le $maxAllowedZipSizeInBytes) {
    $toSpare = $maxAllowedZipSizeInBytes - $bestSize
    Write-Host "Good Job! You still have ${toSpare} bytes to spare." -ForegroundColor Green
} else {
    $overhead = $bestSize - $maxAllowedZipSizeInBytes
    Write-Host "Oh No! You overshot the size limit by ${overhead} bytes." -ForegroundColor Red
}

Write-Host "---------------------------------------"