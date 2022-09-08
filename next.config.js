/**
* @type {import('next').NextConfig}
*/
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: 'https://api.ergopad.io',
    FORM_EMAIL: 'ergopad.marketing@gmail.com',
  },
  images: {
    domains: ['ergopad-public.s3.us-west-2.amazonaws.com'],
  },
}

module.exports = nextConfig
