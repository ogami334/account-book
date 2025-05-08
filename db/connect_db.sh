psql "host=127.0.0.1 dbname=household_db user=appuser password=$APP_PASS" \
     -f schema.sql

psql -h 35.200.3.19 -p 5432 -U appuser -d household_db -W


gcloud sql connect account-book-dev-db-test --user=appuser --database=household_db