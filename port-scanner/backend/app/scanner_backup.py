import socket


COMMON_SERVICES = {
    20: "FTP-Data",
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    445: "SMB",
    3306: "MySQL",
    3389: "RDP",
    5432: "PostgreSQL",
    6379: "Redis",
    8080: "HTTP-Proxy",
}


def scan_port(target: str, port: int, timeout: float = 0.5) -> bool:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(timeout)
            result = sock.connect_ex((target, port))
            return result == 0
    except (socket.timeout, socket.error):
        return False


def scan_ports(target: str, start_port: int, end_port: int):
    results = []

    for port in range(start_port, end_port + 1):
        is_open = scan_port(target, port)

        if is_open:
            service = COMMON_SERVICES.get(port, "Unknown")

            results.append({
                "port": port,
                "state": "open",
                "service": service
            })

    return results