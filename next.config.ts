import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan fitur yang bikin error critters tadi
  experimental: {
    optimizeCss: false 
  }
};

export default withNextIntl(nextConfig);