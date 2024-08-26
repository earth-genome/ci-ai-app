import { writable } from 'svelte/store';

export const selectedOption = writable(0);
export const Coords = writable({  lon: 0, lat: 0});
export const pointInfo = writable();