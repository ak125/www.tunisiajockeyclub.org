import { resolve } from 'path';
import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { flatRoutes } from 'remix-flat-routes';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const MODE = process.env.NODE_ENV;
installGlobals();

export default defineConfig({
	resolve: {
		preserveSymlinks: true,
	},
	build: {
		cssMinify: MODE === 'production',
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					charts: ['recharts', 'framer-motion'],
					ui: ['lucide-react', 'class-variance-authority']
				}
			}
		},
		commonjsOptions: {
			include: [/frontend/, /backend/, /node_modules/],
		},
	},
	optimizeDeps: {
		include: ['react', 'react-dom', 'zustand', '@tanstack/react-query']
	},
	plugins: [
		tsconfigPaths({}),
		remix({
			ignoredRouteFiles: ['**/*'],
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
			serverModuleFormat: 'esm',
			routes: async (defineRoutes) => {
				return flatRoutes("routes", defineRoutes, {
					ignoredRouteFiles: [
						".*",
						"**/*.css",
						"**/*.test.{js,jsx,ts,tsx}",
						"**/__*.*",
					],
					appDir: resolve(__dirname, "app"),
				});
			},
		}),
	],
	server: {
		port: 3000,
		host: true,
		hmr: {
			port: 3001
		}
	}
});
