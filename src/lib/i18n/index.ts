import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import en from './en.json';
import ko from './ko.json';
import th from './th.json';

addMessages('en', en);
addMessages('ko', ko);
addMessages('th', th);

init({
	fallbackLocale: 'en',
	initialLocale: window.localStorage.getItem('language') || getLocaleFromNavigator(),
});
