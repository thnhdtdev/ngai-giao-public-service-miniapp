import { ConfigEnv, defineConfig, loadEnv, ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

// Phải trùng với DEV_PROXY_PATH trong src/api/hccClient.ts
const HCC_API_PROXY_PATH = "/hcc-api";

/**
 * Khi dev, chuyển tiếp request qua dev server để không bị CORS chặn
 * (backend chỉ cho phép các origin trong CORS_ORIGIN). Bản build không dùng.
 */
const createHccApiProxy = (
    apiBaseUrl?: string,
): Record<string, ProxyOptions> | undefined => {
    if (!apiBaseUrl) {
        return undefined;
    }

    const { origin, pathname } = new URL(apiBaseUrl);
    const basePath = pathname.replace(/\/+$/, "");

    return {
        [HCC_API_PROXY_PATH]: {
            target: origin,
            changeOrigin: true,
            rewrite: requestPath =>
                requestPath.replace(HCC_API_PROXY_PATH, basePath),
        },
    };
};

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
    const envDir = path.resolve(__dirname);
    const env = loadEnv(mode, envDir);

    return defineConfig({
        root: "./src",
        // .env nằm ở thư mục gốc; mặc định Vite đọc env từ `root` (./src)
        envDir,
        base: "./",
        plugins: [react()],
        server: {
            proxy: createHccApiProxy(env.VITE_API_BASE_URL),
        },
        build: {
            target: "es2020",
        },
        resolve: {
            alias: {
                "@assets": path.resolve(__dirname, "src/assets"),
                "@components": path.resolve(__dirname, "src/components"),
                "@common": path.resolve(__dirname, "src/common"),
                "@api": path.resolve(__dirname, "src/api"),
                "@constants": path.resolve(__dirname, "src/constants"),
                "@content": path.resolve(__dirname, "src/content"),
                "@routes": path.resolve(__dirname, "src/routes"),
                "@shared": path.resolve(__dirname, "src/shared"),
                "@utils": path.resolve(__dirname, "src/utils"),
                "@pages": path.resolve(__dirname, "src/pages"),
                "@dts": path.resolve(__dirname, "src/types"),
                "@state": path.resolve(__dirname, "src/state"),
                "@service": path.resolve(__dirname, "src/service"),
                "@store": path.resolve(__dirname, "src/store"),
                "@mock": path.resolve(__dirname, "src/mock"),
            },
        },
    });
};
