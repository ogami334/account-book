PROJECT_ID=account-book-dev-457810
INSTANCE_ID=account-book-dev-db-test
REGION=asia-northeast1
DB_NAME=household_db
ROOT_PASSWORD=$(openssl rand -base64 20)

# set project
gcloud config set project $PROJECT_ID


# # create instance
gcloud sql instances create ${INSTANCE_ID} \
    --database-version=POSTGRES_15 \
    --cpu=1 --memory=4GB \
    --region=${REGION} \
    --storage-size=10GB \
    --storage-auto-increase \
    --root-password=${ROOT_PASSWORD}


gcloud sql databases create ${DB_NAME} \
    --instance=${INSTANCE_ID}

APP_USER=appuser
APP_PASS=$(openssl rand -base64 20)

gcloud sql users create ${APP_USER} \
    --instance=${INSTANCE_ID} \
    --password=${APP_PASS}
