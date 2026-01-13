from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    BigInteger,
    JSON,
    DateTime,
    UniqueConstraint,
)
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import os

from etl.config import DATABASE_URL  # <-- NEW

Base = declarative_base()
SessionLocal = None


class OnchainEvent(Base):
    __tablename__ = "onchain_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    contract_name = Column(String(128), nullable=False)
    contract_address = Column(String(66), nullable=False)
    event_name = Column(String(128), nullable=False)
    tx_hash = Column(String(66), nullable=False)
    block_number = Column(BigInteger, nullable=False)
    log_index = Column(Integer, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "tx_hash", "log_index", name="uq_onchain_events_tx_logindex"
        ),
    )


def init_engine_and_session():
    global SessionLocal

    db_url = os.getenv("DATABASE_URL", DATABASE_URL)

    engine = create_engine(db_url, echo=False, future=True)
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    return engine


def get_session():
    if SessionLocal is None:
        raise RuntimeError("DB not initialized. Call init_engine_and_session() first.")
    return SessionLocal()
