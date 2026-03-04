/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 THE FIX: Tell Turbopack to NOT bundle the PDF library
  serverExternalPackages: ['pdf-parse'],
  
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
    // Keep this if you added it earlier!
    middlewareClientMaxBodySize: '20mb', 
  },
};

export default nextConfig;