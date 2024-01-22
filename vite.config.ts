import { sveltekit } from '@sveltejs/kit/vite';
import { sveltekit_python_vercel } from "sveltekit-python-vercel/vite";
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit_python_vercel(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
