import { mount } from 'svelte';
import '../examples-shared.css';
import './main.scss';
import App from './App.svelte';

const app = mount(App, {
	target: document.getElementById('app')
});

export default app;
