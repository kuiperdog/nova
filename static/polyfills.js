// Subsquid Node.js polyfills
const process = {
    version: 'v0.0.0',
    env: {
        SQD_DEBUG: '',
    },
    stderr: {
        write: (buffer) => {
            const level = JSON.parse(buffer).level;
            if (level >= 4)
                console.error(buffer);
            else if (level === 3)
                console.warn(buffer);
            else
                console.log(buffer);
        }
    },
    uptime: () => 0,
    cpuUsage: () => {
        return { user: 0, system: 0 };
    },
    hrtime: (time) => {
        const now = performance.now();
        const s = Math.floor(now / 1000);
        const ns = Math.floor((now % 1000) * 1000000);
        if (time) {
            s -= time[0];
            ns -= time[1];
            if (ns < 0) {
                s--;
                ns += 1000000000;
            }
        }
        return [s, ns];
    }
};
process.hrtime.bigint = () => BigInt(process.hrtime().reduce((acc, val) => acc * 1000000000 + val, 0));
