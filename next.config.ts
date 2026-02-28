import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
  remotePatterns: [
    
   
    {
      protocol: "https",
      hostname: "utfs.io",
    },
    {
      protocol: "https",
      hostname: "*.ufs.sh",
    }
     
  ],
},

};

export default nextConfig;
