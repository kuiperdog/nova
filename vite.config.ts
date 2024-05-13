import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import pkg from './package.json' assert { type: 'json' };
import path from 'path';

export default defineConfig({
    plugins: [
        sveltekit(),
        nodePolyfills()
    ],
    define: {
        __VERSION__: `"${pkg.version}"`,
        __SUBSQUID_API__: '"https://nova.squids.live/cosmo/graphql"',
        __COSMO_API__: '"https://api.cosmo.fans"',
        __COSMO_PROXY__: '"https://cache.nova.gd"',
        __POLYGON_RPC__: '"https://rpc.ankr.com/polygon"'
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