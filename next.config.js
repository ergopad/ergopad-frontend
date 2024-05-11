/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: process.env.API_URL,
    FORM_EMAIL: process.env.FORM_EMAIL,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    IPGEOLOCATION_API_KEY: process.env.IPGEOLOCATION_API_KEY,
  },
  swcMinify: true,
  images: {
    domains: ['ergopad-public.s3.us-west-2.amazonaws.com'],
  },
}

module.exports = nextConfig
