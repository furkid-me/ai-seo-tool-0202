/** @type {import('next').NextConfig} */

// Check if building for GitHub Pages (static export)
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  reactStrictMode: true,
  // Only use static export for GitHub Pages
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/ai-seo-tool-0202',
    assetPrefix: '/ai-seo-tool-0202/',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
