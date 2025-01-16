// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // 
//   }
  
//   export default nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Ensures Vercel runs Next.js correctly
  experimental: {
    appDir: true, // Enables App Router (if using it)
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
  distDir: ".next", // Ensures the build goes into the correct folder
}

export default nextConfig



