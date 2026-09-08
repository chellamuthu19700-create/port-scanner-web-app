from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


class ScanRequest(BaseModel):
    target: str

    start_port: int = Field(
        default=1,
        ge=1,
        le=65535
    )

    end_port: int = Field(
        default=100,
        ge=1,
        le=65535
    )

    scan_type: Literal[
        "tcp",
        "udp",
        "full",
        "aggressive"
    ] = "tcp"


class PortResult(BaseModel):
    port: int
    state: str
    service: Optional[str] = None
    version: Optional[str] = None


class ScanResponse(BaseModel):
    id: int
    target: str
    start_port: int
    end_port: int
    status: str
    duration: Optional[float] = None
    created_at: datetime
    results: List[PortResult] = []