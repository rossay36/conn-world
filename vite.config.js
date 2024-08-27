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
					// Example: Create a chunk for vendor libraries
					vendor: ["react", "react-dom"],
				},
			},
		},
		chunkSizeWarningLimit: 1000, // Increase the limit to suppress warnings for larger chunks
	},
	assetsInclude: ["**/*.woff", "**/*.woff2"], // Ensure font files are included in the build
});
