from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ScanResult
from ..schemas import ScanRequest
from ..crud import (
    create_scan,
    save_scan_results,
    complete_scan,
    get_scan,
    get_scan_results,
    get_all_scans as get_all_scans_from_db,
)
from ..scanner import scan_ports
from ..services.security import analyze_ports


router = APIRouter(
    prefix="/api/scans",
    tags=["Scans"]
)


# ==========================================
# START NEW SCAN
# ==========================================

@router.post("/")
def start_scan(
    request: ScanRequest,
    db: Session = Depends(get_db)
):

    # Validate port range
    if request.start_port > request.end_port:
        raise HTTPException(
            status_code=400,
            detail="Start port must be less than or equal to end port"
        )

    # Create scan record
    scan = create_scan(
        db,
        request.target,
        request.start_port,
        request.end_port,
        request.scan_type
    )

    try:

        # Run selected Nmap scan
        scan_data = scan_ports(
            request.target,
            request.start_port,
            request.end_port,
            request.scan_type
        )

        results = scan_data["results"]
        duration = scan_data["duration"]

        # Analyze security
        recommendations = analyze_ports(
            results
        )

        # Save results
        save_scan_results(
            db,
            scan.id,
            results
        )

        # Complete scan
        scan = complete_scan(
            db,
            scan.id,
            duration
        )

        return {
            "id": scan.id,
            "target": scan.target,
            "scan_type": scan.scan_type,
            "start_port": scan.start_port,
            "end_port": scan.end_port,
            "status": scan.status,
            "duration": scan.duration,
            "created_at": scan.created_at,
            "results": results,
            "recommendations": recommendations
        }

    except Exception as e:

        scan.status = "failed"
        db.commit()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================================
# GET ALL SCANS
# ==========================================

@router.get("/")
def get_all_scans(
    db: Session = Depends(get_db)
):

    scans = get_all_scans_from_db(db)

    return [
        {
            "id": scan.id,
            "target": scan.target,
            "scan_type": scan.scan_type,
            "start_port": scan.start_port,
            "end_port": scan.end_port,
            "status": scan.status,
            "duration": scan.duration,
            "created_at": scan.created_at
        }
        for scan in scans
    ]


# ==========================================
# GET SINGLE SCAN
# ==========================================

@router.get("/{scan_id}")
def get_scan_details(
    scan_id: int,
    db: Session = Depends(get_db)
):

    scan = get_scan(
        db,
        scan_id
    )

    if not scan:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )

    results = get_scan_results(
        db,
        scan_id
    )

    result_data = [
        {
            "port": result.port,
            "state": result.state,
            "service": result.service,
            "version": result.version
        }
        for result in results
    ]

    recommendations = analyze_ports(
        result_data
    )

    return {
        "id": scan.id,
        "target": scan.target,
        "scan_type": scan.scan_type,
        "start_port": scan.start_port,
        "end_port": scan.end_port,
        "status": scan.status,
        "duration": scan.duration,
        "created_at": scan.created_at,
        "results": result_data,
        "recommendations": recommendations
    }


# ==========================================
# DELETE SCAN
# ==========================================

@router.delete("/{scan_id}")
def delete_scan(
    scan_id: int,
    db: Session = Depends(get_db)
):

    scan = get_scan(
        db,
        scan_id
    )

    if not scan:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )

    # Delete results first
    db.query(ScanResult).filter(
        ScanResult.scan_id == scan_id
    ).delete(
        synchronize_session=False
    )

    # Delete scan
    db.delete(scan)
    db.commit()

    return {
        "message": "Scan deleted successfully",
        "scan_id": scan_id
    }