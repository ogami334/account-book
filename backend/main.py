from __future__ import annotations

"""main.py – FastAPI app that satisfies the transaction API schema examples provided by the user.

This file intentionally keeps persistence in‑memory so it runs stand‑alone without a real database.
Replace the `fake_db` section with your preferred ORM / SQL layer when you are ready to connect
it to PostgreSQL or any other database.
"""

from typing import List

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from sqlalchemy.orm import Session
from models import Transaction
from schemas import TransactionCreate, TransactionOut, TransactionUpdate


app = FastAPI(title="Household Transaction API", version="0.1.0")
origins = ["http://localhost:8080"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic models (request / response bodies)
# ---------------------------------------------------------------------------


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.post("/transactions", response_model=TransactionOut, summary="Create a transaction")
async def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    """Create a new transaction.

    *No database yet:* Data are kept in a module‑level dict until you plug in your ORM.
    """
    new_transaction = Transaction(**payload.dict())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)  # ここでidがセットされる
    return new_transaction


@app.get("/transactions", response_model=List[TransactionOut], summary="List transactions for a user")
async def list_transactions(user_id: int, db: Session = Depends(get_db)):
    """Return all transactions that belong to *user_id*.

    The parameter is supplied as a query string: `/transactions?user_id=10`.
    """
    return db.query(Transaction).filter(Transaction.user_id == user_id).all()


@app.put("/transactions/{tx_id}", response_model=TransactionOut, summary="Update a transaction")
async def update_transaction(tx_id: int, payload: TransactionUpdate, db: Session = Depends(get_db)):
    """Update an existing transaction.

    Only the fields present in the request body are updated.
    """
    transaction = db.query(Transaction).filter(Transaction.id == tx_id).first()
    transaction_data = payload.dict(exclude_unset=True)
    for key, value in transaction_data.items():
        setattr(transaction, key, value)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction
