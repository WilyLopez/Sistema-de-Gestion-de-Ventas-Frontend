import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            "@": "/src",
            "@components": "/src/components",
            "@pages": "/src/pages",
            "@styles": "/src/styles",
            "@hooks": "/src/hooks",
            "@context": "/src/context",
            "@services": "/src/services",
            "@utils": "/src/utils",
            "@api": "/src/api",
            "@assets": "/src/assets",
            "@router": "/src/router",
        },
    },

    server: {
        host: true,
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },

    build: {
        outDir: "dist",
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    "react-vendor": ["react", "react-dom", "react-router-dom"],
                    "chart-vendor": ["recharts"],
                    "form-vendor": ["react-hook-form", "zod"],
                },
            },
        },
    },
});