import { writable } from 'svelte/store';
import { Subsquid } from './apis';

export const likes = writable<Subsquid.Collection[]>(JSON.parse(window.localStorage.getItem('bookmarks') || '[]'));
likes.subscribe((value) => localStorage.setItem('bookmarks', JSON.stringify(value)));
