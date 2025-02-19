import type { NextConfig } from "next";
import {webpack} from "next/dist/compiled/webpack/webpack";

const nextConfig: NextConfig = {
  //reactStrictMode: false
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    }
};

export default nextConfig;
