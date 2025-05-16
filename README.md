# アプリをローカルで起動
```bash
docker compose up --build
```

# デプロイ準備
```bash
gcloud components update && gcloud auth login

gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
gcloud config set project account-book-dev-457810
gcloud config set run/region asia-northeast1
```

# デプロイ
## backend
```bash
cd backend

gcloud builds submit \
  --tag asia-northeast1-docker.pkg.dev/account-book-dev-457810/app/backend:1.0 .

gcloud run deploy backend \
  --image asia-northeast1-docker.pkg.dev/account-book-dev-457810/app/backend:1.0 \
  --allow-unauthenticated   # API を公開しない場合は外す
```

## frontend
```bash
API_BASE_SERVER="https://backend-75oql5vo4a-an.a.run.app"

gcloud builds submit \
  --tag asia-northeast1-docker.pkg.dev/account-book-dev-457810/app/frontend:1.0 .

gcloud run deploy frontend \
  --image asia-northeast1-docker.pkg.dev/account-book-dev-457810/app/frontend:1.0 \
  --allow-unauthenticated
```

# DBの停止/開始
```bash
gcloud sql instances patch account-book-dev-db-test \
  --activation-policy=NEVER

gcloud sql instances patch account-book-dev-db-test \
  --activation-policy=ALWAYS
```