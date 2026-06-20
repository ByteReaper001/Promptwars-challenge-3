param(
    [string]$ProjectId = "project-bf9858cc-c3d3-4d29-9a1",
    [string]$Region = "us-central1",
    [string]$ServiceName = "challenge-3-web",
    [switch]$AllowUnauthenticated = $true
)

$ErrorActionPreference = "Stop"

Write-Host "Setting active project to $ProjectId..."
gcloud config set project $ProjectId

$deployArgs = @(
    "run", "deploy", $ServiceName,
    "--source", ".",
    "--region", $Region,
    "--platform", "managed",
    "--project", $ProjectId
)

if ($AllowUnauthenticated) {
    $deployArgs += "--allow-unauthenticated"
} else {
    $deployArgs += "--no-allow-unauthenticated"
}

Write-Host "Deploying service $ServiceName to Cloud Run ($Region)..."
& gcloud @deployArgs

Write-Host "Fetching service URL..."
$url = gcloud run services describe $ServiceName --region $Region --project $ProjectId --format "value(status.url)"

Write-Host "Cloud Run URL: $url"
