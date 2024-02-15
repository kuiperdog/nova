import { writable } from 'svelte/store';

export const lastScan = writable<number>(0);
