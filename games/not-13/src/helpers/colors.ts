import { updateFireflyColor } from "../components/fireflies/fireflies";

type RGB = { r: number; g: number; b: number };

// export const colors = ["#D1D5D8", "#41A85F", "#2C82C9", "#9365B8", "#FAC51C", "#E25041", "#D1D5D8"];
export const colors = ["#2C82C9", "#9365B8", "#FAC51C", "#E25041", "#D1D5D8"];

// const colorsPerIndex = 20;
// let colorIndex = 0;
// setInterval(() => {
// 	colorIndex++;

// 	const realColorIndex = Math.min(colors.length - 1, Math.floor(colorIndex / colorsPerIndex));
// 	const color = getColorFromRange(
// 		hexToRgb(colors[realColorIndex]),
// 		hexToRgb(colors[Math.min(colors.length - 1, realColorIndex + 1)]),
// 		(colorIndex % colorsPerIndex) / colorsPerIndex,
// 	);

// 	setGameColor(rgbToHex(color.r, color.g, color.b));

// 	if (realColorIndex === colors.length - 1) {
// 		colorIndex = 0;
// 	}
// }, 100);

export function setGameColor(newHexColor: string, modifiers = [0.25, 1.5, 1.2]) {
	const rgbColor = hexToRgb(newHexColor);

	const bg =
		"rgb(" +
		Math.max(0, rgbColor.r * modifiers[0]) +
		"," +
		Math.max(0, rgbColor.g * modifiers[0]) +
		"," +
		Math.max(0, rgbColor.b * modifiers[0]) +
		")";
	const color =
		"rgb(" +
		Math.min(255, rgbColor.r * modifiers[1]) +
		"," +
		Math.min(255, rgbColor.g * modifiers[1]) +
		"," +
		Math.min(255, rgbColor.b * modifiers[1]) +
		")";
	const shadow =
		"rgb(" +
		Math.min(255, rgbColor.r * modifiers[2]) +
		"," +
		Math.min(255, rgbColor.g * modifiers[2]) +
		"," +
		Math.min(255, rgbColor.b * modifiers[2]) +
		")";

	document.documentElement.style.setProperty("--bg", bg);
	document.documentElement.style.setProperty("--color", color);
	document.documentElement.style.setProperty("--shadow", shadow);

	updateFireflyColor(newHexColor);
}

globalThis.setGameColor = setGameColor;

export function hexToRgb(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return {
		r: parseInt(result![1], 16),
		g: parseInt(result![2], 16),
		b: parseInt(result![3], 16),
	};
}

function componentToHex(c) {
	var hex = Math.floor(c).toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function getColorFromRange(first: RGB, second: RGB, percentage: number) {
	let result: RGB = { r: 0, g: 0, b: 0 };
	Object.keys(first).forEach((key) => {
		let start = first[key];
		let end = second[key];
		let offset = (start - end) * percentage;
		if (offset >= 0) {
			Math.abs(offset);
		}
		result[key] = start - offset;
	});
	return result;
}

export function getAverageRGB(imgEl: HTMLImageElement) {
	var blockSize = 5, // only visit every 5 pixels
		defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
		canvas = document.createElement("canvas"),
		context = canvas.getContext && canvas.getContext("2d"),
		data,
		width,
		height,
		i = -4,
		length,
		rgb = { r: 0, g: 0, b: 0 },
		count = 0;

	if (!context) {
		return defaultRGB;
	}

	height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
	width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
	context.drawImage(imgEl, 0, 0);

	try {
		data = context.getImageData(0, 0, width, height);
	} catch (e) {
		/* security error, img on diff domain */
		return defaultRGB;
	}

	length = data.data.length;

	while ((i += blockSize * 4) < length) {
		++count;
		rgb.r += data.data[i];
		rgb.g += data.data[i + 1];
		rgb.b += data.data[i + 2];
	}

	// ~~ used to floor values
	rgb.r = ~~(rgb.r / count);
	rgb.g = ~~(rgb.g / count);
	rgb.b = ~~(rgb.b / count);

	return rgb;
}
