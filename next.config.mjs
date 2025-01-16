// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // 
//   }
  
//   export default nextConfig
 /** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Ensures compatibility with Vercel's deployment system
  experimental: {
    appDir: true,  // Ensures Next.js App Router compatibility (if you're using it)
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
}

export default nextConfig


