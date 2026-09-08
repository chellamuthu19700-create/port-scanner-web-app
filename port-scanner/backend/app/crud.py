from sqlalchemy.orm import Session

from .models import Scan, ScanResult


def create_scan(
    db: Session,
    target: str,
    start_port: int,
    end_port: int,
    scan_type: str = "tcp"
):
    scan = Scan(
        target=target,
        start_port=start_port,
        end_port=end_port,
        scan_type=scan_type,
        status="running"
    )

    db.add(scan)
    db.commit()
    db.refresh(scan)

    return scan


def save_scan_results(
    db: Session,
    scan_id: int,
    results: list
):
    for result in results:
        scan_result = ScanResult(
            scan_id=scan_id,
            port=result["port"],
            state=result["state"],
            service=result.get("service"),
            version=result.get("version")
        )

        db.add(scan_result)

    db.commit()


def complete_scan(
    db: Session,
    scan_id: int,
    duration: float
):
    scan = (
        db.query(Scan)
        .filter(Scan.id == scan_id)
        .first()
    )

    if scan:
        scan.status = "completed"
        scan.duration = duration

        db.commit()
        db.refresh(scan)

    return scan


def get_scan(
    db: Session,
    scan_id: int
):
    return (
        db.query(Scan)
        .filter(Scan.id == scan_id)
        .first()
    )


def get_all_scans(
    db: Session
):
    return (
        db.query(Scan)
        .order_by(Scan.created_at.desc())
        .all()
    )


def get_scan_results(
    db: Session,
    scan_id: int
):
    return (
        db.query(ScanResult)
        .filter(ScanResult.scan_id == scan_id)
        .all()
    )