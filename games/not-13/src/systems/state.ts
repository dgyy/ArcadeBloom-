import { rng } from "../helpers/numbers";
import { Signal, createSignal } from "./signals";

const STATE_KEY = "not-13";

export type Path = "sound" | "screen";
export type TopSpeed = { time: number; level: number };

export type State = {
	seed: Signal<number>;
	lastProcessedAt: Signal<number>;
	sound: Signal<boolean | null>;
	topSpeeds: Signal<TopSpeed[]>;
};

export const emptyState: State = {
	seed: createSignal(12),
	// seed: createSignal(Date.now()),
	lastProcessedAt: createSignal(Date.now()),
	sound: createSignal(null),
	topSpeeds: createSignal([]),
};

export let state: State;

let stateLoaded = false;
let autoSaveInterval: number;

export function initState() {
	loadState();

	autoSaveInterval = setInterval(saveState, 15000);
	globalThis.onbeforeunload = () => {
		saveState();
	};
}

export function resetState() {
	clearInterval(autoSaveInterval);
	globalThis.onbeforeunload = null;
	localStorage.removeItem(STATE_KEY);

	setTimeout(() => {
		globalThis.location.reload();
	}, 500);
}

function loadState() {
	const encodedState = localStorage.getItem(STATE_KEY);
	const decodedState = encodedState ? atob(encodedState) : "{}";
	const jsonState = JSON.parse(decodedState) as State | undefined;

	state = Object.entries(emptyState).reduce((acc, [key, signal]) => {
		acc[key] = jsonState?.[key] !== undefined ? createSignal(jsonState[key]) : signal;
		return acc;
	}, {} as State);

	rng.setSeed(state.seed.value);

	stateLoaded = true;
}

export function saveState() {
	if (!stateLoaded) {
		return;
	}

	state.seed.value = rng.getSeed();

	const jsonState = Object.entries(state).reduce(
		(acc, [key, signal]) => {
			acc[key] = signal.value;
			return acc;
		},
		{} as Record<string, any>,
	);

	const encodedState = btoa(JSON.stringify(jsonState));
	localStorage.setItem(STATE_KEY, encodedState);
}
