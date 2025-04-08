import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { comlink } from 'vite-plugin-comlink'


export default defineConfig({
	// base path for the application
	base: '/',
	plugins: [react(), viteTsconfigPaths({

	}), comlink()],
	server: {
		// this ensures that the browser opens upon server start
		open: true,
		// this sets a default port to 3000  
		port: 3000,
	},
	worker: {
		plugins: () => ([
			react(), viteTsconfigPaths({

			}), comlink()
		])
	}
})