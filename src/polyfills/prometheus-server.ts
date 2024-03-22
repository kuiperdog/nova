import { type ListeningServer } from '@subsquid/util-internal-http-server';
import { Registry } from 'prom-client';

export { type ListeningServer };

export function createPrometheusServer(registry: Registry, port?: number | string): Promise<ListeningServer> {
    return new Promise<ListeningServer>((resolve, reject) => {
        resolve({
            port: 0,
            close: async () => {}
        });
    });
}