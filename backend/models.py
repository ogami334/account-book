from database import Base
from sqlalchemy import Column, Integer, String, Date, DateTime, func, BigInteger
from sqlalchemy.dialects.postgresql import ENUM as PgEnum
from enums import TxKind


tx_kind_enum = PgEnum(
    TxKind,                # ← Python Enum をそのまま渡す
    name="tx_kind",        # ← **DB 側に既にある型名と一致させる**
    create_type=False      # ← 既存 ENUM を再生成しないように
)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(Integer)
    tx_date = Column(Date)
    kind = Column(tx_kind_enum, nullable=False)
    amount = Column(Integer)
    name = Column(String)
    category_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
