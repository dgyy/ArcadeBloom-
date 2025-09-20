import { type Ingredient } from "./data";

export function wrapper(
  content: string,
  width: number,
  height: number,
  opt?: {
    id?: string;
    style?: string;
    viewBoxWidth?: number;
    viewBoxHeight?: number;
  },
) {
  return `<svg${
    opt?.id !== undefined ? " id=" + opt.id : ""
  } width="${width}" height="${height}" viewBox="0 0 ${
    opt?.viewBoxWidth ?? width
  } ${opt?.viewBoxHeight ?? height}" style="${
    opt?.style ?? ""
  }">${content}</svg>`;
}

export function absDiv(
  content: string,
  id: string,
  width: number,
  height: number,
  layer: string,
) {
  return `<div id="${id}" style="position: absolute; top: 0; left: 0; width: ${width}px; height: ${height}px; pointer-events: none; z-index: ${layer}">${content}</div>`;
}

export function id(idName: string, content: string) {
  return `<g id="${idName}">${content}</g>`;
}

export function className(content: string, className: string) {
  return `<g class="${className}">${content}</g>`;
}

export function rect(
  width: number,
  height: number,
  bg: string,
  rx: number = 0,
  stroke: string = "#fff",
  strokeWidth: number = 0,
) {
  return `<rect width="${width}" height="${height}" style="fill:${bg};" rx="${rx}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}

export function ellipsis(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  fill: string,
  stroke: string = "#fff",
  strokeWidth: number = 0,
) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}

export function move(content: string, x: number, y: number) {
  return `
    <g transform="translate(${x},${y})">${content}</g>
  `;
}

export function resize(content: string, x: number, y: number) {
  return `
    <g transform="scale(${x} ${y})">${content}</g>
  `;
}

export function hmirror(content: string) {
  return `
    <g style="transform: scale(-1, 1); transform-origin: center">${content}</g>;
  `;
}

export function vmirror(content: string) {
  return `
    <g style="transform: scale(1, -1); transform-origin: center">${content}</g>;
  `;
}

export function rotate(content: string, angle: number) {
  return `
    <g style="transform: rotate(${angle}deg); transform-origin: center">${content}</g>;
  `;
}

export function skewY(content: string, angle: number) {
  return `
    <g style="transform: skewY(${angle}deg)">${content}</g>;
  `;
}

export function blur(content: string, value: number) {
  return `<g style="filter: blur(${value}px)">${content}</g>`;
}

export function shuffle<T>(list: T[]) {
  return list.sort(() => Math.random() - 0.5);
}

export function getElement<T = HTMLElement>(id: string): T {
  const element = document.getElementById(id) as T;
  if (!element) {
    throw new Error(`Missing #${id}`);
  }
  return element;
}

export function cycle<T>(items: T[]) {
  const current = items.shift();
  if (!current) {
    throw new Error(); // Array should not be empty!
  }
  items.push(current);
  return current;
}

export function coloredIngredientNames(ingredients: Ingredient[]) {
  return ingredients
    .map(
      (ingredient) =>
        `<span style="text-decoration-line: underline; text-decoration-color: ${ingredient.color}; text-decoration-style: wavy">${ingredient.name}</span>`,
    )
    .join(" + ");
}

export function capFirst(value: string) {
  return value[0].toUpperCase() + value.substring(1);
}
