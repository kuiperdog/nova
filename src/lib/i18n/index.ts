import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import en from './en.json';
import ko from './ko.json';

addMessages('en', en);
addMessages('ko', ko)

init({
	fallbackLocale: 'en',
	initialLocale: window.localStorage.getItem('language') || getLocaleFromNavigator(),
});
