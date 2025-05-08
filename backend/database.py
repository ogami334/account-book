import os
from sqlalchemy.engine import Engine
from google.cloud.sql.connector import Connector
from sqlalchemy.orm import sessionmaker
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base

from dotenv import load_dotenv
load_dotenv("./.env.example")

INSTANCE_CONNECTION_NAME = os.getenv("INSTANCE_CONNECTION_NAME")  # project:region:instance
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_NAME = os.getenv("DB_NAME")


def init_connection_engine(connector: Connector) -> Engine:
    def getconn():
        print(INSTANCE_CONNECTION_NAME, DB_USER, DB_PASS, DB_NAME)
        return connector.connect(
            INSTANCE_CONNECTION_NAME,
            "pg8000",
            user=DB_USER,
            password=DB_PASS,
            db=DB_NAME,
        )

    SQLALCHEMY_DATABASE_URL = "postgresql+pg8000://"

    engine = sqlalchemy.create_engine(SQLALCHEMY_DATABASE_URL, creator=getconn)
    return engine


connector = Connector()
engine = init_connection_engine(connector)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
