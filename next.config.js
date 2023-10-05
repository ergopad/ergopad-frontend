/**
* @type {import('next').NextConfig}
*/
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    FORM_EMAIL: process.env.FORM_EMAIL,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    SUMSUB_TOKEN: process.env.SUMSUB_TOKEN,
    SUMSUB_SECRET_KEY: process.env.SUMSUB_SECRET_KEY
  },
  // swcMinify: true,
  images: {
    domains: ['ergopad-public.s3.us-west-2.amazonaws.com'],
  },
}

module.exports = nextConfig
