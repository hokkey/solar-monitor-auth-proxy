# Solar Monitor Auth Proxy

- [日本語](README-ja.md)

An authentication proxy for the 'solar monitor', a Web front-end app of Panasonic VBPM277. It enhances access flexibility beyond LAN restrictions by proxying the default digest authentication.

## Intended Use

When you already have authentication like Cloudflare Access or upstream reverse proxy, you can remove the default digest auth with this auth proxy.

## Cautions

Access via the authentication proxy bypasses the standard digest authentication. Ensure to apply any authentication upstream of this authentication proxy.

As a prerequisite, the power detection unit must be part of the LAN with a fixed IP address.
The proxy must be installed on a network that allows direct connection to the solar monitor's IP address.

## Environment Variables

- SOLAR_MONITOR_BASE_URL - The URL for the solar monitor to connect to, such as a local IP address http://192.168.1.1. Does not support URLs like http://solar-monitor.local.
- SOLAR_MONITOR_AUTH_USER - The login username for the solar monitor.
- SOLAR_MONITOR_AUTH_PW - The login password for the solar monitor.
- SOLAR_MONITOR_FRAME_ANCESTORS - The value for CSP: frame-ancestors. The default value is `'none'`.
