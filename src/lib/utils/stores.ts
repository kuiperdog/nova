import { writable } from 'svelte/store';
import { Collection } from '../../model';

export const likedObjekts = writable<Collection[]>(JSON.parse(window.localStorage.getItem('bookmarks') || '[]'));
likedObjekts.subscribe((value) => localStorage.setItem('bookmarks', JSON.stringify(value)));
