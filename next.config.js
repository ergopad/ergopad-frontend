/**
* @type {import('next').NextConfig}
*/
const nextConfig = {
reactStrictMode: true,
  env: {
    API_URL: 'https://api.ergopad.io/',
    FORM_EMAIL: 'ergopad.marketing@gmail.com',
  },
}

module.exports = nextConfig
