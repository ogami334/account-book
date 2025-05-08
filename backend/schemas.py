from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from enums import TxKind


class TransactionBase(BaseModel):
    tx_date: date
    kind: TxKind
    amount: int
    name: str
    category_id: int


class TransactionCreate(TransactionBase):
    user_id: int


class TransactionOut(TransactionBase):
    user_id: int
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionUpdate(BaseModel):
    """Fields that can be patched on an existing transaction."""

    tx_date: Optional[date] = None
    kind: Optional[TxKind] = None
    amount: Optional[int] = None
    name: Optional[str] = None
    category_id: Optional[int] = None

    class Config:
        from_attributes = True