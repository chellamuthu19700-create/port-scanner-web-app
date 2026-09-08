from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime

from .database import Base


class Scan(Base):
    __tablename__ = "scans"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    target = Column(
        String,
        nullable=False
    )

    start_port = Column(
        Integer,
        nullable=False
    )

    end_port = Column(
        Integer,
        nullable=False
    )

    scan_type = Column(
        String,
        default="tcp",
        nullable=False
    )

    status = Column(
        String,
        default="completed"
    )

    duration = Column(
        Float,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    scan_id = Column(
        Integer,
        nullable=False
    )

    port = Column(
        Integer,
        nullable=False
    )

    state = Column(
        String,
        nullable=False
    )

    service = Column(
        String,
        nullable=True
    )

    version = Column(
        String,
        nullable=True
    )


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        unique=True,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )