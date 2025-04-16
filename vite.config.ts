import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	plugins: [],
	build: {
		sourcemap: false,
		lib: {
			entry: resolve(__dirname, "src/s1seven-verification/s1seven-verification.component.ts"),
			name: "S1SevenVerify",
			fileName: () => `s1seven-verification.component.js`,
			formats: ["es"],
		},
		rollupOptions: {},
	},
});
