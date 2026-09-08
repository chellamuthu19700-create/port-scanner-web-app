from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER


def generate_pdf_report(
    file_path,
    scan,
    results,
    recommendations
):
    styles = getSampleStyleSheet()

    title_style = styles["Title"]
    title_style.alignment = TA_CENTER

    document = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    content = []

    # Title
    content.append(
        Paragraph(
            "Port Scanner Security Report",
            title_style
        )
    )

    content.append(Spacer(1, 20))

    # Scan information
    content.append(
        Paragraph("<b>Scan Information</b>", styles["Heading2"])
    )

    scan_info = [
        ["Scan ID", str(scan.id)],
        ["Target", scan.target],
        [
            "Port Range",
            f"{scan.start_port} - {scan.end_port}"
        ],
        ["Status", scan.status],
        [
            "Duration",
            f"{scan.duration or 0} seconds"
        ],
        [
            "Created",
            str(scan.created_at)
        ],
    ]

    info_table = Table(
        scan_info,
        colWidths=[130, 350]
    )

    info_table.setStyle(
        TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("PADDING", (0, 0), (-1, -1), 8),
        ])
    )

    content.append(info_table)
    content.append(Spacer(1, 20))

    # Open ports
    content.append(
        Paragraph(
            "Open Port Results",
            styles["Heading2"]
        )
    )

    if results:
        port_data = [
            ["Port", "State", "Service", "Version"]
        ]

        for result in results:
            port_data.append([
                str(result["port"]),
                result["state"],
                result.get("service") or "Unknown",
                result.get("version") or "Not detected",
            ])

        port_table = Table(
            port_data,
            colWidths=[60, 70, 120, 230],
            repeatRows=1
        )

        port_table.setStyle(
            TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("PADDING", (0, 0), (-1, -1), 7),
            ])
        )

        content.append(port_table)

    else:
        content.append(
            Paragraph(
                "No open ports were detected.",
                styles["Normal"]
            )
        )

    content.append(Spacer(1, 20))

    # Security recommendations
    content.append(
        Paragraph(
            "Security Recommendations",
            styles["Heading2"]
        )
    )

    for number, recommendation in enumerate(
        recommendations,
        start=1
    ):
        content.append(
            Paragraph(
                f"{number}. {recommendation}",
                styles["Normal"]
            )
        )
        content.append(Spacer(1, 6))

    document.build(content)