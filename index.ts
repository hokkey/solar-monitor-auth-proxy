import express from 'express';
import DigestClient from 'digest-fetch';
import { config } from 'dotenv'

// Environment variables
config()
const PORT = Number(process.env.PORT)
const PROXY_URL = process.env.PROXY_URL
const DIGEST_USER = process.env.DIGEST_USER
const DIGEST_PW = process.env.DIGEST_PW

// Setup endpoint
const app = express()

app.get('*', async (req, res) => {
  try {
    /**
     * Fetch target url with digest auth
     */
    const client = new DigestClient(DIGEST_USER, DIGEST_PW)
    const targetUrl = `${PROXY_URL}${req.originalUrl}`
    const response = await client.fetch(targetUrl, {
      method: 'GET',
      headers: { ...req.headers, host: new URL(targetUrl).host },
    })

    /**
     * Set original headers excluding CSP
     * using writeHead to avoid the default charset adding
     */
    const headers = {}
    response.headers.forEach((value, key) => {
      if (value === 'content-security-policy') {
        // @ts-ignore
        headers[key] = value
      }
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
