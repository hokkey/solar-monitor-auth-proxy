import express from 'express';
import DigestClient from 'digest-fetch';
import { config } from 'dotenv'

// Environment variables
config()
const PORT = Number(process.env.PORT)
const PROXY_BASE_URL = process.env.PROXY_BASE_URL
const DIGEST_AUTH_USER = process.env.PROXY_AUTH_USER
const DIGEST_AUTH_PW = process.env.PROXY_AUTH_PW

// Setup endpoint
const app = express()

app.get('*', async (req, res) => {
  try {
    /**
     * Fetch target url with digest auth
     */
    const client = new DigestClient(DIGEST_AUTH_USER, DIGEST_AUTH_PW)
    const targetUrl = `${PROXY_BASE_URL}${req.originalUrl}`
    const response = await client.fetch(targetUrl, {
      method: 'GET',
      headers: { ...req.headers, host: new URL(targetUrl).host },
    })

    /**
     * Set original headers excluding CSP
     * using writeHead to avoid the default charset adding
     */
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
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
