import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@styles": path.resolve(__dirname, "./src/styles"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@context": path.resolve(__dirname, "./src/context"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@api": path.resolve(__dirname, "./src/api"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@router": path.resolve(__dirname, "./src/router"),
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
