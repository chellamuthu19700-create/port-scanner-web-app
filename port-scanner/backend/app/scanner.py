import subprocess
import xml.etree.ElementTree as ET
import time


def scan_ports(
    target: str,
    start_port: int,
    end_port: int,
    scan_type: str = "tcp"
):
    """
    Run an Nmap scan using the selected scan type.

    Supported scan types:
    - tcp
    - udp
    - full
    - aggressive
    """

    start_time = time.time()

    # Validate scan type
    allowed_scan_types = [
        "tcp",
        "udp",
        "full",
        "aggressive"
    ]

    if scan_type not in allowed_scan_types:
        raise Exception(
            "Invalid scan type. "
            "Use tcp, udp, full, or aggressive."
        )

    # ------------------------------------------
    # BUILD NMAP COMMAND
    # ------------------------------------------

    if scan_type == "tcp":

        command = [
            "nmap",
            "-sT",
            "-sV",
            "-Pn",
            "-p",
            f"{start_port}-{end_port}",
            "-oX",
            "-",
            target
        ]

    elif scan_type == "udp":

        command = [
            "nmap",
            "-sU",
            "-sV",
            "-Pn",
            "-p",
            f"{start_port}-{end_port}",
            "-oX",
            "-",
            target
        ]

    elif scan_type == "aggressive":

        command = [
            "nmap",
            "-A",
            "-Pn",
            "-p",
            f"{start_port}-{end_port}",
            "-oX",
            "-",
            target
        ]

    elif scan_type == "full":

        command = [
            "nmap",
            "-sT",
            "-sV",
            "-Pn",
            "-p-",
            "-oX",
            "-",
            target
        ]

    # ------------------------------------------
    # RUN NMAP
    # ------------------------------------------

    try:

        process = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=900
        )

    except subprocess.TimeoutExpired:

        raise Exception(
            "Scan timed out after 15 minutes."
        )

    except FileNotFoundError:

        raise Exception(
            "Nmap is not installed or not available in PATH."
        )

    duration = round(
        time.time() - start_time,
        2
    )

    # ------------------------------------------
    # CHECK NMAP RESULT
    # ------------------------------------------

    if process.returncode != 0:

        error_message = (
            process.stderr.strip()
            or "Nmap scan failed."
        )

        raise Exception(error_message)

    # ------------------------------------------
    # PARSE XML
    # ------------------------------------------

    try:

        root = ET.fromstring(
            process.stdout
        )

    except ET.ParseError:

        raise Exception(
            "Unable to parse Nmap scan results."
        )

    results = []

    # ------------------------------------------
    # READ HOSTS
    # ------------------------------------------

    for host in root.findall("host"):

        ports_element = host.find("ports")

        if ports_element is None:
            continue

        # --------------------------------------
        # READ PORTS
        # --------------------------------------

        for port in ports_element.findall("port"):

            state_element = port.find("state")

            if state_element is None:
                continue

            state = state_element.get(
                "state",
                "unknown"
            )

            # Save only open ports
            if state != "open":
                continue

            port_number = int(
                port.get("portid")
            )

            protocol = port.get(
                "protocol",
                "tcp"
            )

            # ----------------------------------
            # SERVICE INFORMATION
            # ----------------------------------

            service_element = port.find(
                "service"
            )

            service_name = None
            version = None

            if service_element is not None:

                service_name = (
                    service_element.get("name")
                )

                product = (
                    service_element.get("product")
                    or ""
                )

                service_version = (
                    service_element.get("version")
                    or ""
                )

                extra_info = (
                    service_element.get("extrainfo")
                    or ""
                )

                version_parts = []

                if product:
                    version_parts.append(product)

                if service_version:
                    version_parts.append(
                        service_version
                    )

                if extra_info:
                    version_parts.append(
                        extra_info
                    )

                if version_parts:

                    version = " ".join(
                        version_parts
                    )

            # ----------------------------------
            # SAVE RESULT
            # ----------------------------------

            results.append(
                {
                    "port": port_number,
                    "protocol": protocol,
                    "state": state,
                    "service": service_name,
                    "version": version
                }
            )

    return {
        "scan_type": scan_type,
        "results": results,
        "duration": duration
    }