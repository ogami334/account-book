from enum import Enum


class TxKind(str, Enum):          # str を継承しておくと JSON で "expense" などが出力される
    expense = "expense"
    income = "income"
