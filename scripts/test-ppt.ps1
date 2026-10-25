try {
    $ppt = New-Object -ComObject PowerPoint.Application
    Write-Host "PowerPoint COM available!"
    $ppt.Quit()
} catch {
    Write-Host "PowerPoint COM not available: $($_.Exception.Message)"
}
