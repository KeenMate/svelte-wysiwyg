import { mount } from 'svelte';
import '../examples-shared.css';
import ToolbarDemo from './ToolbarDemo.svelte';

const app = mount(ToolbarDemo, {
	target: document.getElementById('app')
});

export default app;
