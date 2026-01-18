import { mount } from 'svelte';
import '../examples-shared.css';
import PropsDemo from './PropsDemo.svelte';

const app = mount(PropsDemo, {
	target: document.getElementById('app')
});

export default app;
