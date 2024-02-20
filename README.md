# Solar Monitor Auth Proxy

An authentication proxy for the 'solar monitor', a Web front-end app of Panasonic VBPM277. It enhances access flexibility beyond LAN restrictions by proxying the default digest authentication.

## Intended Use

The solar monitor employs a digest authentication for login, and it does not allow access via a reverse proxy. By mediating through this authentication proxy, it proxies the digest authentication, enabling access to the solar monitor even through a reverse proxy.

For instance, this allows for connection to the solar monitor from an internet-accessible reverse proxy, facilitating its operation as a home server.

## Cautions

Access via the authentication proxy bypasses the standard digest authentication. Especially when enabling internet access, ensure to apply authentication upstream of the authentication proxy.

As a prerequisite, the power detection unit must be part of the LAN with a fixed IP address.
The proxy must be installed on a network that allows direct connection to the solar monitor's IP address.

## Environment Variables

- SOLAR_MONITOR_BASE_URL - The URL for the solar monitor to connect to, such as a local IP address http://192.168.1.1. Does not support URLs like http://solar-monitor.local.
- SOLAR_MONITOR_AUTH_USER - The login username for the solar monitor.
- SOLAR_MONITOR_AUTH_PW - The login password for the solar monitor.
