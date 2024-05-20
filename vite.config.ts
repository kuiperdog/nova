import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { vitePluginTypescriptTransform } from 'vite-plugin-typescript-transform';
import pkg from './package.json' assert { type: 'json' };
import path from 'path';

export default defineConfig({
    plugins: [
        sveltekit(),
        nodePolyfills({
            globals: {
                process: false
            }
        }),
        vitePluginTypescriptTransform({
            enforce: 'pre',
            filter: {
                files: {
                    include: /\.model.ts$/
                }
            }
        })
    ],
    define: {
        __VERSION__: `"${pkg.version}"`
    },
    resolve: {
        alias: {
            'perf_hooks': path.join(__dirname, 'src/polyfills/perf_hooks.ts'),
            '@subsquid/http-client': path.join(__dirname, 'src/polyfills/http-client.ts'),
            '@subsquid/util-internal-prometheus-server': path.join(__dirname, 'src/polyfills/prometheus-server.ts')
        }
    },
    optimizeDeps: {
        exclude: [
            'perf_hooks'
        ]
    }
});