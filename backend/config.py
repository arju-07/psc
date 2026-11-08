import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
PAPERS_DIR = UPLOAD_DIR / "papers"
KEYS_DIR = UPLOAD_DIR / "keys"
DATA_DIR = BASE_DIR / "data"

for directory in [UPLOAD_DIR, PAPERS_DIR, KEYS_DIR, DATA_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "kerala-pyq-hub-secret-key-2026-prod")
    PORT = int(os.environ.get("PORT", 5000))
    DEBUG = os.environ.get("FLASK_ENV") != "production"

    # Firebase Config
    FIREBASE_CREDENTIALS = os.environ.get("FIREBASE_CREDENTIALS") # path to serviceAccountKey.json or JSON content
    FIREBASE_STORAGE_BUCKET = os.environ.get("FIREBASE_STORAGE_BUCKET", "kerala-pyq-hub.appspot.com")
    FIREBASE_PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "kerala-pyq-hub")

    # AI Gemini Config
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

    # Storage paths
    UPLOAD_FOLDER = str(UPLOAD_DIR)
    PAPERS_FOLDER = str(PAPERS_DIR)
    KEYS_FOLDER = str(KEYS_DIR)
    DATA_FOLDER = str(DATA_DIR)

    # Scraper config
    DEFAULT_USER_AGENT = "KeralaPYQHubBot/1.0 (+https://keralapyqhub.org/crawler-info; educational)"
    REQUEST_TIMEOUT = 15
