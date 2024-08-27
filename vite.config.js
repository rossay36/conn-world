import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "dist",
		sourcemap: false,
		rollupOptions: {
			input: {
				main: "./index.html",
			},
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
	assetsInclude: ["**/*.woff", "**/*.woff2"],
	base: "/", // Ensure this is correct for your deployment
});
