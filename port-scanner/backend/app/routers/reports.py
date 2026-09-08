from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from ..database import get_db
from ..crud import (
    get_all_scans,
    get_scan,
    get_scan_results,
)
from ..services.security import analyze_ports
from ..services.report_generator import generate_pdf_report

import os


router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"]
)


REPORTS_FOLDER = "reports"


# GET ALL REPORTS / SCAN HISTORY
@router.get("/")
def get_reports(
    db: Session = Depends(get_db)
):
    scans = get_all_scans(db)

    return [
        {
            "id": scan.id,
            "target": scan.target,
            "start_port": scan.start_port,
            "end_port": scan.end_port,
            "status": scan.status,
            "duration": scan.duration,
            "created_at": scan.created_at
        }
        for scan in scans
    ]


# GET SAVED PDF REPORTS
@router.get("/repository")
def get_report_repository():

    os.makedirs(
        REPORTS_FOLDER,
        exist_ok=True
    )

    reports = []

    for filename in os.listdir(REPORTS_FOLDER):

        if not filename.lower().endswith(".pdf"):
            continue

        file_path = os.path.join(
            REPORTS_FOLDER,
            filename
        )

        reports.append({
            "filename": filename,
            "size": os.path.getsize(file_path),
            "download_url": f"/api/reports/file/{filename}"
        })

    return {
        "total_reports": len(reports),
        "reports": reports
    }


# DOWNLOAD SAVED PDF FROM REPOSITORY
@router.get("/file/{filename}")
def download_saved_report(
    filename: str
):

    file_path = os.path.join(
        REPORTS_FOLDER,
        filename
    )

    if not os.path.isfile(file_path):
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename
    )


# DELETE SAVED PDF REPORT
@router.delete("/file/{filename}")
def delete_saved_report(
    filename: str
):

    file_path = os.path.join(
        REPORTS_FOLDER,
        filename
    )

    # Check if file exists
    if not os.path.isfile(file_path):
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    # Delete the PDF
    try:
        os.remove(file_path)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete report: {str(e)}"
        )

    return {
        "message": "Report deleted successfully",
        "filename": filename
    }


# GENERATE AND DOWNLOAD PDF REPORT
@router.get("/{scan_id}/pdf")
def download_pdf_report(
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

    results_db = get_scan_results(
        db,
        scan_id
    )

    results = [
        {
            "port": result.port,
            "state": result.state,
            "service": result.service,
            "version": result.version
        }
        for result in results_db
    ]

    recommendations = analyze_ports(
        results
    )

    os.makedirs(
        REPORTS_FOLDER,
        exist_ok=True
    )

    file_path = os.path.join(
        REPORTS_FOLDER,
        f"scan_report_{scan.id}.pdf"
    )

    generate_pdf_report(
        file_path,
        scan,
        results,
        recommendations
    )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=f"scan_report_{scan.id}.pdf"
    )