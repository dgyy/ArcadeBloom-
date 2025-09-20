import { el } from "./dom";

const tiers = ["", "K", "M", "B", "T", "Q"];

export function abbreviateNumber(
	value: number,
	minExp = 3,
	removeZeros = false,
	roundValue: false | 0 | 1 | -1 = 0,
): string {
	if (value < 0) {
		return "-" + abbreviateNumber(-value, minExp);
	}

	if (roundValue === 0) {
		value = Math.round(value);
	} else if (roundValue === 1) {
		value = Math.ceil(value);
	} else if (roundValue === -1) {
		value = Math.floor(value);
	}

	const exp = Math.floor(Math.log10(value));

	if (exp < minExp) {
		return value.toLocaleString();
	}

	const divider = Math.pow(10, exp);
	let expValue = value / divider;
	let formattedExpValue = expValue.toFixed(2);

	const tier = Math.floor(exp / 3);

	const suffix = tiers[tier];

	if (suffix) {
		expValue *= Math.pow(10, exp % 3);
		formattedExpValue = expValue.toFixed(2 - (exp % 3));
	}

	if (removeZeros) {
		formattedExpValue = removeTrailingZeros(formattedExpValue);
	}

	if (!suffix) {
		return formattedExpValue + "e" + exp;
	}

	return formattedExpValue + suffix;
}

export function removeTrailingZeros(value: string): string {
	return value.replace(/0+$/, "").replace(/\.$/, "");
}

// #region -- Pseudo Random Number Generator

// A deterministic random number generator (Mulberry32)
export type RNG = {
	seed: number;
	setSeed: (seed: number) => void;
	getSeed: () => number;
	random: () => number;
};

export const rng: RNG = {
	seed: 0,

	// Set the random seed
	setSeed: (seed) => {
		rng.seed = seed;
	},

	// Get the random seed
	getSeed: () => {
		return rng.seed;
	},

	// Get a new random number (0-1)
	random: () => {
		rng.seed += 0x6d2b79f5;
		let t = rng.seed;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	},
};

// #endregion

export function randomInteger(min: number, max: number): number {
	return Math.floor(rng.random() * (max - min + 1) + min);
}

export function mathRandomInteger(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// https://www.calculators.org/math/html-math.php
const mathSymbols = [
	"?",
	"+",
	"-",
	"×",
	"÷",
	"=",
	"≠",
	"±",
	"<",
	">",
	"ƒ",
	"%",
	"∃",
	"∅",
	"∏",
	"∑",
	"√",
	"∛",
	"∜",
	"∞",
	"⊾",
	"⊿",
	"⋈",
	"Δ",
	"Θ",
	"Λ",
	"Φ",
	"Ψ",
	"Ω",
	"α",
	"β",
	"γ",
	"δ",
	"λ",
];

export function getMathSymbolElements() {
	return mathSymbols.map((symbol) => el("span.math-symbol", symbol));
}

export function toTime(duration: number) {
	const seconds = Math.floor(duration / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours > 0) {
		return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
	} else if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`;
	} else {
		return `${seconds}.${(duration % 1000).toString().padStart(3, "0")}s`;
	}
}
