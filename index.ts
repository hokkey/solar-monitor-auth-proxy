import express from 'express';
import DigestClient from 'digest-fetch';
import { config } from 'dotenv'

// Environment variables
config()
const PORT = Number(process.env.PORT)
const SOLAR_MONITOR_BASE_URL = process.env.SOLAR_MONITOR_BASE_URL
const DIGEST_AUTH_USER = process.env.SOLAR_MONITOR_AUTH_USER
const DIGEST_AUTH_PW = process.env.SOLAR_MONITOR_AUTH_PW
const FRAME_ANCESTORS = process.env.SOLAR_MONITOR_FRAME_ANCESTORS ?? "'none'"

// Setup endpoint
const app = express()
app.disable('x-powered-by')


// Almost the same CSP config of the original, but the ancestor is customizable
const CSP_VALUES = `script-src 'unsafe-eval' 'unsafe-inline' 'self'; style-src 'unsafe-inline' 'self'; img-src 'self' data: 127.0.0.1; object-src 'none'; frame-ancestors ${FRAME_ANCESTORS}`

app.get('*', async (req, res) => {
  try {
    /**
     * Fetch target url with digest auth
     */
    const client = new DigestClient(DIGEST_AUTH_USER, DIGEST_AUTH_PW)
    const targetUrl = `${SOLAR_MONITOR_BASE_URL}${req.originalUrl}`
    const response = await client.fetch(targetUrl, {
      method: 'GET',
      headers: { ...req.headers, host: new URL(targetUrl).host },
    })

    /**
     * Set original headers excluding CSP and X-Frame-Options
     * using writeHead to avoid the default charset adding
     */
    const headers: Record<string, string> = {}
    const CSP = 'content-security-policy'
    response.headers.forEach((value, key) => {
      if (key !== 'x-frame-options') {
        headers[key] = value
      }
    })
    headers[CSP] = CSP_VALUES
    res.writeHead(response.status, headers)

    /**
     * Finalize response
     */
    const bodyBuffer = await response.arrayBuffer()
    res.end(Buffer.from(bodyBuffer))

  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})

app.listen(PORT, () => console.log(`The app is listening on port ${PORT}.`))
