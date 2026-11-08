# PowerShell script to deploy Supabase Edge Functions for Kerala PYQ Hub
Param(
  [string]$GeminiApiKey = ""
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Kerala PYQ Hub - Supabase Edge Setup   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$PROJECT_REF = "rlrfojikvrcsgvgtcbqg"

# Step 1: Check CLI
Write-Host "`n[1/4] Verifying Supabase CLI..." -ForegroundColor Yellow
npx supabase --version

# Step 2: Link project
Write-Host "`n[2/4] Linking Supabase Project ($PROJECT_REF)..." -ForegroundColor Yellow
npx supabase link --project-ref $PROJECT_REF

# Step 3: Set secrets if provided
if ($GeminiApiKey -ne "") {
  Write-Host "`n[3/4] Setting GEMINI_API_KEY secret..." -ForegroundColor Yellow
  npx supabase secrets set "GEMINI_API_KEY=$GeminiApiKey"
} else {
  Write-Host "`n[3/4] Skipping secrets (pass -GeminiApiKey YOUR_KEY or set via Dashboard)" -ForegroundColor DarkGray
}

# Step 4: Deploy all edge functions
Write-Host "`n[4/4] Deploying Edge Functions..." -ForegroundColor Yellow

Write-Host "Deploying process-pdf..." -ForegroundColor Cyan
npx supabase functions deploy process-pdf --no-verify-jwt

Write-Host "Deploying generate-ai-answer..." -ForegroundColor Cyan
npx supabase functions deploy generate-ai-answer --no-verify-jwt

Write-Host "Deploying verify-question..." -ForegroundColor Cyan
npx supabase functions deploy verify-question --no-verify-jwt

Write-Host "`nDeployment Complete!" -ForegroundColor Green
Write-Host "Functions available at: https://$PROJECT_REF.supabase.co/functions/v1/<function-name>" -ForegroundColor Green
