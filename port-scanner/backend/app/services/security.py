def analyze_ports(results: list):
    recommendations = []

    for result in results:
        port = result["port"]
        service = (result.get("service") or "").lower()

        if port == 21:
            recommendations.append(
                "FTP (port 21) is open. Consider using SFTP or FTPS instead of unencrypted FTP."
            )

        elif port == 23:
            recommendations.append(
                "Telnet (port 23) is open. Telnet is insecure; use SSH instead."
            )

        elif port == 80:
            recommendations.append(
                "HTTP (port 80) is open. Consider using HTTPS to protect web traffic."
            )

        elif port == 445:
            recommendations.append(
                "SMB (port 445) is open. Restrict access to trusted networks and keep SMB updated."
            )

        elif port == 3389:
            recommendations.append(
                "RDP (port 3389) is open. Restrict RDP access and use VPN or network-level controls."
            )

        elif port == 22:
            recommendations.append(
                "SSH (port 22) is open. Use strong authentication and restrict access to trusted sources."
            )

        else:
            recommendations.append(
                f"Port {port} ({service or 'unknown service'}) is open. "
                "Verify that this service is required and restrict access if possible."
            )

    if not results:
        recommendations.append(
            "No open ports were detected. Continue monitoring the host "
            "and review firewall rules regularly."
        )

    return recommendations