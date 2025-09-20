export const title = {
  viewbox: "0 0 100 20",
  svg: `<text x="50" y="15" text-anchor="middle" font-size="15" stroke-width="0.25">
          ${"Kyabetsu".split("").map((c, i) => `<tspan>${c}<animate attributeName="stroke-width" values="1;0.25" dur="2.0s" begin="${500 + i * 50}ms" /></tspan>`).join("")}
        </text>`,
  style: `fill: var(--c2); stroke: var(--c1);`
};

export const end = {
  viewbox: "0 0 100 100",
  svg: `<text x="50" y="50" text-anchor="middle" font-size="15" stroke-width="0.25">
          ${"The End".split("").map((c, i) => `<tspan>${c}<animate attributeName="stroke-width" values="1;0.25" dur="2.0s" begin="${500 + i * 50}ms" /></tspan>`).join("")}
        </text>`,
  style: `fill: var(--c2); stroke: var(--c1);`
};

export const cs = {
  viewbox: "0 0 100 100",
  svg: `<text x="50" y="80" text-anchor="middle" font-size="5" stroke-width="0.2">
          ${matchMedia("(pointer:fine)").matches ? "Click" : "Tap"} to Start
        </text>`,
  style: `fill: var(--c0); stroke: var(--c0);`
};

export const story = {
  viewbox: "0 0 100 100",
  svg: `<text x="50" y="40" text-anchor="middle" font-size="5" stroke-width="0.2">
          Kyabetsu landed on a new island,
        </text>
        <text x="50" y="50" text-anchor="middle" font-size="5" stroke-width="0.2">
          he knows nothing about it,
        </text>
        <text x="50" y="60" text-anchor="middle" font-size="5" stroke-width="0.2">
           help him figure out where he is.
        </text>`,
  style: `fill: var(--c0); stroke: var(--c0);`
};

export const c = {
  viewbox: "0 0 32 42",
  svg: `<path d="m11.6 34.6 3.8 2.1-1.1 1.9-3.6-1.9.9-2.1 0 0z">
          <animate id="f1" attributeName="d" values="m11.6 34.6 3.8 2.1-1.1 1.9-3.6-1.9.9-2.1 0 0z;m11.4 34.8 2.9 3.3-1.7 1.4-2.7-3 1.6-1.7 0 0z;m11.8 33.4 4.3.7-.4 2.2-4-.6.1-2.3 0 0z;m11.6 34.6 3.8 2.1-1.1 1.9-3.6-1.9.9-2.1 0 0z" dur="0.5s" begin="indefinite" />
        </path>
        <path d="m16.9 34.1 3.8 2.1-.8 1.8-4-1.8z">
          <animate id="f2" attributeName="d" values="m16.9 34.1 3.8 2.1-.8 1.8-4-1.8z;m16.9 34.1 2.9 3.3-1.4 1.4-3.1-3.1z;m16.9 34.1 3.8 2.1-.8 1.8-4-1.8z" dur="0.5s" begin="indefinite" />
        </path>
        <path d="m9.5 17.6c-3.4 0-6.2-2.9-6.2-6.5 0-3.6 2.8-6.5 6.2-6.5 3.4 0 6.2 2.9 6.2 6.5 0 3.6-2.8 6.5-6.2 6.5z"/>
        <path d="m18.9 14.7c-3.5 0-6.4-2.8-6.4-6.2 0-3.4 2.8-6.2 6.4-6.2 3.5 0 6.4 2.8 6.4 6.2 0 3.4-2.8 6.2-6.4 6.2z"/>
        <path d="m10 34c-1.3.4-5.7-5.2-5.7-6.1 0-1 3.6 3.3 5.7 2.6 2.1-.6 1.7.8 1.7 1.7 0 1-.4 1.4-1.7 1.7z"/>
        <path d="m21.4 26.8 1.1 4.5-1.3.5-1.6-4.1 1.8-.9z">
          <animate id="a1" attributeName="d" values="m21.4 26.8 1.1 4.5-1.3.5-1.6-4.1 1.8-.9z;m21.8 26.4 3.7 2.7-.7 1.2-3.9-2.1.8-1.8z;m21.4 26.8 1.1 4.5-1.3.5-1.6-4.1 1.8-.9z" dur="0.5s" begin="indefinite" />
        </path>
        <path d="m11.2 24.1-.8 3.8.9 6.2 3.1 2 3.3.1 1.6-1.3 2.2-6.3 0-3.9-10.5-.6 0 0z"/>
        <path d="m16.2 26c-5.8 0-10.4-4.6-10.4-10.3 0-5.7 4.7-10.3 10.4-10.3 5.8 0 10.4 4.6 10.4 10.3 0 5.7-4.7 10.3-10.4 10.3z"/>
        <ellipse cx="14.8" cy="17.6" rx="1.4" ry="1.7">
          <animate id="eye1" attributeName="ry" values="1.7;0.2;1.7" dur="0.5s" begin="1s;eye1.end+3s" />
        </ellipse>
        <ellipse cx="22.1" cy="16.2" rx="1.4" ry="1.7">
          <animate id="eye2" attributeName="ry" values="1.7;0.2;1.7" dur="0.5s" begin="1s;eye2.end+3s" />
        </ellipse>
        <path d="m14.1 27.3 1.1 4.5-1.3.5-1.6-4.1 1.8-.9z"/>
        <path d="m21 21c-2 1-2 1-4.5.9C19 23 19 23 21 21" fill="var(--c0)" stroke-width="0.1" stroke-linecap="round" stroke-linejoin="round">
          <animate id="mouth" attributeName="d" values="m21 21c-2 1-2 1-4.5.9C19 23 19 23 21 21;m21 21c-.3 3.1-2.1 2.8-4.5.9C18 20 19 20 21 21;m21 21c-2 1-2 1-4.5.9C19 23 19 23 21 21" dur="0.8s" begin="indefinite" />
        </path>`,
  style: `pointer-events: none; z-index: 50; stroke: var(--c0); fill: var(--c6); ellipse { fill: var(--c1) }`
};

export const tree = {
  viewbox: "0 0 18 24",
  svg: `<path d="M16 17H2L9 2 16 17ZM16 17 5 11M13 11.5 6.5 8M6 22H12M9 22V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
  style: `fill: var(--c6); stroke: color-mix(in srgb, var(--c6) 60%, black 40%)`
};

export const area = {
  style: `background-color: color-mix(in srgb, var(--c) 80%, white 20%); border-radius: 1cqi`
};

export const moon = {
  viewbox: "0 0 24 24",
  svg: `<path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>`,
  style: `fill: var(--c2); stroke: color-mix(in srgb, var(--c2) 80%, black 20%);`
};

export const hole = {
  viewbox: "0 0 24 12",
  svg: `<ellipse cx="12" cy="6" rx="10" ry="5" />`,
  style: `fill: color-mix(in srgb, var(--c, var(--c0)) 80%, white 20%); stroke: color-mix(in srgb, var(--c, var(--c0)) 80%, black 20%);`
};

export const torch = {
  viewbox: "0 0 48 48",
  svg: `<path d="M27 34H21V44H27V34Z" stroke-width="4" stroke-miterlimit="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M31 34H17L14 26H34L31 34Z" stroke-width="4" stroke-miterlimit="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path fill="var(--c2)" d="M21 14C23 9.39 27 4 27 4C27 4 33.36 15.49 33.36 19.23C33.36 22.97 30.74 26 27 26H19C16.36 26 14.64 23.86 14.64 21.22C14.64 18.58 19 10 19 10C19 10 19.96 12.01 21 14Z" stroke-width="4" stroke-miterlimit="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  style: `stroke: var(--c0);`
};

export const mount = {
  viewbox: "0 0 18 8",
  svg: `<path d="M1 8 5 1 12 8ZM10 6 12 3 17 8 12 8Z" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.2"/>`,
  style: `stroke: color-mix(in srgb, var(--c6) 80%, black 20%); fill: var(--c6)`
};

export const cave = {
  viewbox: "0 0 2 2",
  svg: `<path d="M.1 1.4C.1 0 1.8-.1 1.8 1.4Z" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.1"/>`,
  style: `stroke: color-mix(in srgb, var(--c6) 80%, black 20%); fill: var(--c0)`
};

export const mirror = {
  viewbox: "0 0 48 48",
  svg: `<circle cx="24" cy="17" r="13" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M42 17C42 26.9411 33.9411 35 24 35C14.0589 35 6 26.9411 6 17" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M42 17H38" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 17H6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M30 44H18" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M24 44V36" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  style: `stroke: var(--c0); fill: none; circle {fill: color-mix(in srgb, var(--c3) 50%, white 50%);}`
};

export const spider = {
  viewbox: "0 0 128 128",
  svg: `<path d="M55.2 63.5l20.4.2s1.9 2 3.7.1c1.8-1.9 11.9-12.1 13.3-13.4 1.3-1.3 3.3-3.5 5.1-3.5s9.2 5.9 12.7 8.6c2.4 1.9 8.6 7.3 10.3 7.7 1.6.5 5.7 1.2 5.7 3s-5.7 1.2-7.3 1-11.2-6.5-12.7-7.5c-1.5-.9-6.1-4.4-7-4.4s-13.7 12.6-13.7 12.6 8-2.8 10.3-3.7c2.2-.9 4.6-1.9 5.8-1.8 1.2.1 9.5 9.4 10.9 10.6 1.3 1.2 5.7 5.4 6.8 6.1 1.2.7 8.6 3.9 7.7 5.8s-10.1-1-11.6-1.7c-1.8-.9-6.5-4.2-9.4-7.3-.8-.9-4.8-5.1-6.1-5.4-1.3-.3-15.6 5.3-15.6 5.3s10.1-.7 11.8.2c1.6.9 6.4 11.3 7.3 13.5 1.2 2.8 4.9 11.8 6.1 13.3 1.2 1.5 5.7 5.4 4.3 7.2-1.3 1.8-7.1-2.6-8.1-4.1-1-1.5-4.6-5.7-9.6-15.1-1.6-3-3.6-7.2-4.5-7.7-.9-.6-9.7.9-9.7.9s-.9 7-.6 9.2c.3 2.2 4.3 20.6 5.1 24.3.7 3.7.7 5.5-.6 6-1.3.5-3-1-4.8-5.2-.9-2.1-6.2-17.1-6.9-19.1-1.3-3.7-1-10.1-1-10.1l-29.6-4.9s-3.8.1-4.4 1.2c-.6 1-3.4 13.6-4.1 16.1-.7 2.5-6.2 12.5-6.8 13.3-.6.7-2 2.9-3.7 1-1.2-1.3 1.2-4.8 1.9-7.6 0 0 1.9-4.5 2.2-7.3.3-2.8 2.3-19.4 3.1-20.6 1.2-1.6 5.4-3.3 5.4-3.3s-3-1.2-4.9-1.9c-1.3-.5-3.9-1.3-4.2-1.3-.8.2-5.5 7.9-7.5 10.6s-8.8 10.3-9.7 10.9c-.9.6-3.1 1.6-4-.1-.9-1.8 1.5-3.1 2.8-4.9 1.3-1.8 6.5-9.7 8.2-12.5s6.3-12.1 7.7-12.7c1.5-.6 11 3.9 11 3.9s-5.4-4.4-7.6-6.2c-2.2-1.8-4-4.5-5.2-4.1s-6.6 5.7-9 7.7-8.2 5.7-10 6.5c-2.2.9-4 .3-4.3-.9s3.9-4 7-6.7 7.1-7.5 9.2-9.6c2.7-2.6 5.2-5.3 6.5-6.3 2.6-1.9 17.6 12.9 17.6 12.9s-7.9-11-9.5-13.3c-1.6-2.2-3-4.9-3.4-6-.5-1-.9-3.1.7-4.3 1.6-1.2 3.9-1.2 6.3 2.1 1.9 2.6 16.7 22.6 16.7 22.6l3.3.2z"/>
  <path d="M77 65.2s15-12.4 14.8-28.5-12.2-23.4-21.2-23.9c-10.3-.6-25.6 6.8-26.3 23.9-.7 17.2 6.8 26.3 6.8 26.3s-8.1 1.7-9.8 11.7c-1 6 1.8 18 15.7 20.1 17.7 2.8 24.8-10.4 24.2-19.6-.4-6.3-4.1-10.1-4.1-10.1z"/>
  <path d="M61.8 57.5c3.7.1 6.6.6 8.9 1.7 5.5 2.6 7.2 7 6.7 6.8-1.2-.5-6-5.3-16.7-5.4-5.8-.1-9.5 2.7-10.3 2.6-.6-.1 4.8-5.8 11.4-5.7z" />
  <path d="M66.1 49.1c-.1 0-.1 0-.2-0-.8-.1-1.3-.8-1.2-1.5l.5-4c.1-.8.8-1.3 1.5-1.2.8.1 1.3.8 1.2 1.5l-.5 4c-.1.7-.7 1.2-1.4 1.2z"/>
  <path d="M76.5 52a1.5 1.5 0 01-.5-.1 1.4 1.4 0 01-.6-1.8l2-4.1c.3-.7 1.2-1 1.8-.6.7.3 1 1.1.6 1.8l-2 4.1c-.3.5-.8.8-1.3.8z"/>
  <path d="M55.4 49.3c-.7 0-1.2-.5-1.4-1.1l-.7-4.1a1.4 1.4 0 011.1-1.6c.8-.1 1.5.4 1.6 1.1l.7 4.1a1.4 1.4 0 01-1.4 1.6z"/>
  <path d="M61.3 35c-.7 0-1.4-.6-1.4-1.3l-.1-3.9c-0-.8.6-1.4 1.3-1.4.8 0 1.4.6 1.4 1.3l.1 3.9c0 .8-.6 1.4-1.3 1.4h-0z"/>
  <path d="M74.5 36.6a1.4 1.4 0 01-1.3-1.7l1.1-4.3c.2-.7.9-1.2 1.7-1 .7.2 1.2.9 1 1.7l-1.1 4.3c-.2.6-.7 1-1.3 1z"/>
  <ellipse transform="rotate(-83.898 53.503 75.622)" cx="53" cy="75" rx="4" ry="4">
    <animate id="a" attributeName="rx" begin="1s;a.end+3s" dur="0.5s" values="4;0.2;4"/>
  </ellipse>
  <ellipse cx="66" cy="77" rx="4" ry="4">
    <animate id="b" attributeName="ry" begin="a.begin+0.1s" dur="0.5s" values="4;0.2;4"/>
  </ellipse>
  <ellipse transform="rotate(-5.8 73.6 75.2)" cx="73" cy="75" rx="2" ry="3">
    <animate id="c" attributeName="ry" begin="a.begin+0.3s" dur="0.5s" values="3;0.2;3"/>
  </ellipse>
  <ellipse transform="rotate(-78.5 46 72)" cx="46" cy="72" rx="3" ry="2">
    <animate id="d" attributeName="rx" begin="a.begin+0.2s" dur="0.5s" values="3;0.2;3"/>
  </ellipse>`,
  style: `stroke: var(--c0); fill: gray; ellipse{fill: var(--c5)}`
};

export const apple = {
  viewbox: "0 0 24 24",
  svg: `<path d="M12 7 12 6.5C12 5 11 3.8 9.6 3.5L7 3 7 3.5C7 5 8 6.2 9.4 6.5L12 7M12.1 8 15.1 4.3"/>
        <path fill="var(--c5)" d="M15.8 6.7C16.9 6.7 17.9 7.1 18.6 7.8 19.3 8.6 19.7 9.5 19.7 10.5L19.7 10.7 19.7 11.3C19.6 12.7 19.4 14 19 15.3L18.9 15.8 18.5 16.9C18.1 18.3 16.9 19.4 15.5 19.8 14.9 20 14.1 20 13.1 19.7L12.8 19.7C12.3 19.5 11.7 19.5 11.2 19.7 10.1 20 9.1 20 8.5 19.8 7.1 19.4 5.9 18.3 5.5 16.9L5.1 15.8C4.6 14.4 4.4 12.8 4.3 11.3L4.3 10.7C4.3 9.6 4.6 8.6 5.4 7.8 6.1 7.1 7.1 6.7 8.2 6.7L8.8 6.8C9.7 6.9 10.7 7.5 12 8.7 13.2 7.6 14.2 6.9 15 6.8L15.2 6.8 15.8 6.7Z"/>`,
  style: `stroke: var(--c0); fill: var(--c6);`
};

export const flower = {
  viewbox: "0 0 488 488",
  svg: `<path d="M470.8 211.2c0-55.4-44.8-100.2-100.2-100.2-10.6 0-20.6 2.1-30.2 5C340.2 61 295.6 16.4 240.4 16.4c-55.2 0-99.9 44.6-100.1 99.7-9.5-3-19.5-5-30.2-5C54.8 111.1 10 155.9 10 211.2c0 44.3 29 81.5 68.9 94.6-12 16.6-19.2 36.6-19.2 58.5 0 55.4 44.8 100.2 100.2 100.2 33.2 0 62.3-16.2 80.5-41 18.3 24.8 47.3 41 80.5 41 55.4 0 100.2-44.8 100.2-100.2 0-21.9-7.2-41.9-19.1-58.5C441.8 292.6 470.8 255.5 470.8 211.2zM240.4 313.7c-28.8 0-52.1-23.3-52.1-52.1 0-28.8 23.4-52.1 52.1-52.1 28.8 0 52.1 23.3 52.1 52.1C292.5 290.4 269.2 313.7 240.4 313.7z"/>`,
  style: `stroke: var(--c0); fill: var(--c)`
};

export const coso = {
  viewbox: "0 0 32 42",
  svg: `<path d="m13.343 36.793 3.8 2.1-1.1 1.9-3.6-1.9zM19.246 36l3.8 2.1-.8 1.8-4-1.8zM7.455 24.291c-3.4 0-6.2-2.9-6.2-6.5s2.8-6.5 6.2-6.5 6.2 2.9 6.2 6.5-2.8 6.5-6.2 6.5zM24.321 20.01c-3.5 0-6.4-2.8-6.4-6.2s2.8-6.2 6.4-6.2c3.5 0 6.4 2.8 6.4 6.2s-2.8 6.2-6.4 6.2zM10.44 35.908c-1.3.4-8.954-10.121-8.954-11.021 0-1 6.854 8.22 8.954 7.52 2.1-.6 1.7.8 1.7 1.7 0 1-.4 1.4-1.7 1.7zM21.84 28.708l3.888.578-.638 1.773-5.05-1.451z"/>
        <path d="m11.64 26.008-.8 3.8.9 6.2 3.1 2 3.3.1 1.6-1.3c.247-1.835 5.275-4.668 1.1-6.814l1.1-3.386-10.5-.6z"/>
        <path d="M16.64 27.908c-5.8 0-10.4-4.6-10.4-10.3S11.027 1.813 16.727 1.813c5.8 0 10.313 10.095 10.313 15.795s-4.7 10.3-10.4 10.3z"/>
        <ellipse cx="15" cy="15" rx="1.4" ry="4">
          <animate id="a" attributeName="ry" begin="1s;a.end+3s" dur="0.6s" values="4;0.2;4"/>
        </ellipse>
        <ellipse cx="22" cy="14" rx="1.4" ry="4">
          <animate id="b" attributeName="ry" begin="1s;b.end+3s" dur="0.6s" values="4;0.2;4"/>
        </ellipse>
        <path d="m14.54 29.208 3.014 5.32-1.806.24-3.008-4.66z"/>
        <path fill="var(--c0)" stroke-linecap="round" stroke-linejoin="round" stroke-width=".1" d="M25.1 22c-2 1-9 1.4-11.5 1.3 2.5 1.1 9.6.8 11.6-1.2">
          <animate id="mouth" attributeName="d" begin="indefinite" dur="0.8s" values="M25.1 22c-2 1-9 1.4-11.5 1.3 2.5 1.1 9.6.8 11.6-1.2;M25.1 22c-3.1-2-9.1-1-11.5 1.3 2.5 1.1 9.6.8 11.6-1.2;M25.1 22c-2 1-9 1.4-11.5 1.3 2.5 1.1 9.6.8 11.6-1.2"/>
        </path>`,
  style: `stroke: var(--c0); fill: var(--c2); ellipse { fill: var(--c1) }`
};

export const ladder = {
  viewbox: "0 0 500 500",
  svg: `<path d="M317.3 47.5l-15.9.4c-1.6 0-2.9 1.4-2.8 3l2.2 49.1H199.1l2.2-49.1c.1-1.6-1.2-3-2.8-3l-15.9-.4c-1.6-0-2.9 1.2-3 2.8l-18.2 398.6c-.1 1.7 1.7 3.2 4 3.3l13.4.3c2.3.1 4.2-1.3 4.3-3l2.3-51.3h128.9l2.3 51.3c.1 1.7 2 3.1 4.3 3l13.4-.3c2.3-.1 4.1-1.5 4-3.3L320.3 50.3C320.2 48.7 318.9 47.5 317.3 47.5zM306 211.7H194l1.7-36.6h108.6L306 211.7zM306.8 230.4l1.7 36.6H191.5l1.7-36.6L306.8 230.4 306.8 230.4zM309.3 285.8l1.7 37.4h-122.1l1.7-37.4H309.3zM301.7 118.9l1.7 37.4H196.6l1.7-37.4H301.7zM186.4 379.4l1.7-37.4h123.8l1.7 37.4H186.4z"/>`,
  style: "fill: var(--c7)"
};

export const house = {
  viewbox: "0 0 50 50",
  svg: `<path d="M9 22h34v24H9z"/><path fill="var(--c3)" d="M30 30h8v7h-8z"/><path fill="color-mix(in srgb, var(--c7) 60%, var(--c0) 40%)" d="M43 22H9v-1l16-16 18 16z"/><path d="m19 11-5 5v-9h5z"/><g fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5"><path d="M15 30h9v16h-9zM30 30h8v7h-8zM43 22H9v-1l16-16 18 16z"/><path d="M9 22h34v24H9zM19 11l-5 5v-9h5z"/></g>`,
  style: `fill: var(--c7); stroke: var(--c0); pointer-events: none`
};

export const graffiti = {
  viewbox: "0 0 441 441",
  svg: `<path d="M1 1M308.8 138l-20.3-1.1-57.6-16.1c-1.3-.3-2.6-.3-3.8.1l-56.8 18.9-14-25.8c-1.7-3.2-5.7-4.3-8.8-2.6-3.2 1.7-4.3 5.7-2.6 8.8l16.3 30.1 8.7 24-7.8 42.6c-.7 3.5 1.7 6.9 5.2 7.6.4.1.8.1 1.2.1 3.1 0 5.8-2.2 6.4-5.3l7-38.2 8.4 1.2c.3 0 .6.1.9.1 3.2 0 6-2.3 6.4-5.6.5-3.6-2-6.8-5.5-7.3l-10.7-1.5-5.8-16.1 53.7-17.9 53.2 14.9 9 25.1-3 2.3-15.9-11.2c-2.4-1.7-5.5-1.6-7.8.2l-15.3 12.2-34.3-4.8c-3.6-.5-6.8 2-7.3 5.5-.5 3.6 2 6.8 5.5 7.3L247 190.1l17.1 35.4c1.1 2.3 3.4 3.7 5.9 3.7 1 0 1.9-.2 2.8-.7 3.2-1.6 4.6-5.5 3-8.7l-16.4-33.8 9.6-7.7 15.8 11.2c2.3 1.7 5.5 1.6 7.7-.2l10.5-8.2c2.2-1.7 3.1-4.7 2.1-7.3l-8.4-23.4 11.2.6c.1 0 .2 0 .4 0 3.4 0 6.3-2.7 6.5-6.1C315.2 141.3 312.4 138.2 308.8 138z"/>
    <path d="M159.2 321v-32.7c0-3.6-2.9-6.5-6.5-6.5s-6.5 2.9-6.5 6.5v29.1l-1 .7-11.6-27.3c-1.4-3.3-5.2-4.8-8.5-3.4-3.3 1.4-4.8 5.2-3.4 8.5l12.5 29.4-.1.1-23-22.2c-2.6-2.5-6.7-2.4-9.2.2s-2.4 6.7.2 9.2l20.9 20.1-.1 0-17.4-5.5c-3.4-1.1-7.1.8-8.2 4.2-1.1 3.4.8 7.1 4.2 8.2l20.3 6.4c.6.2 1.3.3 2 .3 1.3 0 2.5-.4 3.6-1.1l28.9-18.9C158.1 325.3 159.2 323.2 159.2 321z"/>
    <path d="M179 312.5l-13.2 12.2c-.7.7-1.3 1.5-1.7 2.5l-10.3 27.2c-1.3 3.4.4 7.1 3.8 8.4.8.3 1.5.4 2.3.4 2.6 0 5.1-1.6 6.1-4.2l9.8-25.8 12.1-11.2c2.6-2.4 2.8-6.5.4-9.2S181.7 310.1 179 312.5z"/>
    <path d="M142 339.1l-9.5 7.5c-2.8 2.2-3.3 6.3-1.1 9.1 1.3 1.6 3.2 2.5 5.1 2.5 1.4 0 2.8-.5 4-1.4l9.5-7.5c2.8-2.2 3.3-6.3 1.1-9.1C148.9 337.4 144.8 336.9 142 339.1z"/>
    <path d="M304.9 301.8c-1.1-3.4-4.7-5.3-8.2-4.2l-17.4 5.5-.1-0 20.9-20.1c2.6-2.5 2.7-6.6.2-9.2-2.5-2.6-6.6-2.7-9.2-.2l-23 22.2-.1-.1 12.5-29.4c1.4-3.3-.1-7.1-3.4-8.5-3.3-1.4-7.1.1-8.5 3.4l-11.6 27.3-1-.7v-29.1c0-3.6-2.9-6.5-6.5-6.5s-6.5 2.9-6.5 6.5v32.7c0 2.2 1.1 4.2 2.9 5.4l28.9 18.9c1.1.7 2.3 1.1 3.6 1.1.7 0 1.3-.1 2-.3l20.3-6.4C304.1 308.9 306 305.3 304.9 301.8z"/>
    <path d="M238.1 297.4c-.4-.9-.9-1.8-1.7-2.5l-13.2-12.2c-2.6-2.4-6.8-2.3-9.2.4-2.4 2.6-2.3 6.8.4 9.2l12.1 11.2 9.8 25.8c1 2.6 3.5 4.2 6.1 4.2.8 0 1.5-.1 2.3-.4 3.4-1.3 5-5 3.8-8.4L238.1 297.4z"/>
    <path d="M269.778 316.895l-9.5-7.5c-2.818-2.225-6.905-1.743-9.129 1.074-2.225 2.818-1.744 6.905 1.074 9.129l9.5 7.5c1.193.942 2.613 1.399 4.023 1.399 1.921 0 3.823-.848 5.106-2.473C273.077 323.207 272.596 319.119 269.778 316.895z"/>`,
  style: "stroke: var(--c2); fill: var(--c2)"
};

export const ao = {
  viewbox: "0 0 32 42",
  svg: `<path d="m13.3 36.8 3.8 2.1-1.1 1.9-3.6-1.9zM19.2 36l3.8 2.1-.8 1.8-4-1.8zM5 23c-3 1-6.2-2.9-3-4s2.8-6.5 5-3 1.3.2.7 3.1zM23 18c-2-5-4.3-3-6-6s2.8-6.2 8 2c8 0 1 10-1 3zM12 33c-1.3.4-12-13-9-7-5-3 6.9 8.2 9 7.5zM22 30l2.2 2.3-1.2.7-1.2-1.3z"/>
        <path d="m11.6 26-.8 3.8.9 6.2 3.1 2 3.3.1 1.6-1.3c.2-1.8.3-.8 1.1-6.8l1.1-3.4-10.5-.6z"/>
        <path d="M16.6 27.9c-5.8 0-10.4-4.6-10.4-10.3S11 1.8 17 6c5.8 0 10.3 10.1 9 15s-4.7 10.3-10.3 6.2z"/>
        <ellipse cx="15" cy="15" rx="2" ry="2">
          <animate id="a" attributeName="ry" begin="1s;a.end+3s" dur="0.6s" values="2;0.2;2"/>
        </ellipse>
        <ellipse cx="22" cy="14" rx="2" ry="2">
          <animate id="b" attributeName="ry" begin="1s;b.end+3s" dur="0.6s" values="2;0.2;2"/>
        </ellipse>
        <path d="m14.54 29.208 3.014 5.32-1.806.24-3.008-4.66z"/>
        <path fill="var(--c0)" stroke-linecap="round" stroke-linejoin="round" stroke-width=".1" d="M24 23c-2 1-7 1-9 2 2.5 1.1 8-1 9-2">
          <animate id="mouth" attributeName="d" begin="indefinite" dur="0.8s" values="M24 23c-2 1-7 1-9 2 2.5 1.1 8-1 9-2;M24 23c-2 1-8-1-9 2 3 2 10 2 9-2;M24 23c-2 1-7 1-9 2 2.5 1.1 8-1 9-2"/>
        </path>`,
  style: `stroke: var(--c0); fill: var(--c3); ellipse { fill: var(--c1) }`
};

export const scroll = {
  viewbox: "0 0 512 512",
  svg: `<path d="M478.8 72H331.7l-69.4-69.4c-3.5-3.5-9.1-3.5-12.6 0l-69.4 69.4H33.2c-4.9 0-8.9 4-8.9 8.9v422.2c0 4.9 4 8.9 8.9 8.9h445.7c4.9 0 8.9-4 8.9-8.9V80.9C487.7 76 483.7 72 478.8 72zM256 21.5l50.5 50.5H205.5L256 21.5zM457.3 89.8l-22.8 22.8H77.4L54.7 89.8H457.3zM429.3 130.4 429.3 130.4v323.2H82.7v-323.2H429.3zM42.1 102.4l22.8 22.8v333.6l-22.8 22.8V102.4zM54.7 494.2l22.8-22.8h357.1l22.8 22.8H54.7zM469.9 481.6l-22.8-22.8V125.2l22.8-22.8V481.6z"/>
  <path d="M131.5 425.4h249c4.9 0 8.9-4 8.9-8.9V167.5c0-4.9-4-8.9-8.9-8.9H131.5c-4.9 0-8.9 4-8.9 8.9V416.5C122.6 421.4 126.6 425.4 131.5 425.4zM140.4 176.4h231.2v231.2H140.4V176.4z"/>
  <text font-size="125" dy="300" dx="150">XIII</text>
  <text font-size="125" dy="320" dx="150">__</text>
  <text font-size="125" dy="350" dx="150">___</text>`,
};

export const duck = {
  viewbox: "0 0 49 49",
  svg: `<path fill="var(--c, var(--c2))" d="M37.2 26.4c-1-2-2.5-3.8-4.7-5.1-.2-.1-.3-.4-.1-.6 1.1-1.3 4.7-5.9 4.7-9.6 0-6.1-4.9-11-11-11s-11 4.9-11 11c0 6 5 9 5.9 9.9.1.1.1.2.1.3-0 1-.3 5.8-5.5 4-1.4-.5-2.6-1.3-3.7-2.4L5.9 16.8c-.5-.5-1.2-.4-1.6.1C2.9 18.8.4 23 1 29c0 0 .4 16.2 11.6 19.5C13.9 48.9 15.1 49 16.4 49h6.9c2.9 0 5.6-.8 8-2.4.1-.1.2-.1.3-.2C38.1 42 40.8 33.4 37.2 26.4z"/>
  <path fill="color-mix(in srgb, var(--c2) 80%, black 20%)" d="M47.5 10h-8.2-2.3c0 .3.1.7.1 1 0 2.4-1.4 5-2.7 7V18h5.9c.9 0 1.9-.2 2.6-.7 2.6-1.7 4.4-5.1 5.2-6.6C48.2 10.4 47.9 10 47.5 10z"/>
  <circle fill="var(--c0)" cx="28" cy="9" r="4"/>
  <circle fill="var(--c1)" cx="30" cy="10" r="2"/>
  <path fill="color-mix(in srgb, var(--c, var(--c2)) 80%, black 20%)" d="M20.5 29.9c6.7-3.4 7.5 4.1 7.5 4.1 0 8.8-7 8-7 8-5.9 0-8.9-6.3-9.8-8.3-.1-.3.1-.7.4-.8l.4-.1C15 32.1 17.9 31.2 20.5 29.9z"/>`
};

export const cloud = {
  viewbox: "0 0 24 24",
  svg: `<path d="M3 13.6C3 16.6 5.4 19 8.4 19L16.5 19C19 19 21 17 21 14.5 21 12.7 19.9 10.9 18.3 10.3 18.1 7.3 15.7 5 12.7 5 10.4 5 8.3 6.5 7.5 8.5 4.8 8.9 3 11.2 3 13.6Z"/>`,
  style: `stroke: color-mix(in srgb, var(--c, var(--c1)) 80%, black 20%); fill: var(--c, var(--c1)); pointer-events: none`
};

export const shovel = {
  viewbox: "0 0 17 17",
  svg: `<path d="M16.2 3 14 .8C13.6.3 12.8.4 12.4.8 12.3.9 12.3.9 12.3 1 11.7 3.2 11.8 4 11.8 4.3L5.6 10.6 3.7 8.6 1.4 10.9C.6 11.7 0 14.4 1.3 15.7 2.6 17 5.3 16.4 6.1 15.6L8.4 13.3 6.5 11.5 12.8 5.2C13.1 5.3 13.9 5.2 16 4.7 16.1 4.7 16.2 4.7 16.2 4.6 16.6 4.2 16.7 3.4 16.2 3L16.2 3ZM15.7 4C14.5 4.3 13.3 4.5 13 4.5L12.5 4.1C12.5 3.8 12.8 2.5 13.1 1.4 13.3 1.3 13.5 1.2 13.6 1.4L15.6 3.4C15.8 3.5 15.8 3.8 15.7 4L15.7 4Z"/>`,
  style: `fill: color-mix(in srgb, var(--c, var(--c1)) 80%, black 20%); stroke: var(--c, var(--c0))`
};

export const rock = {
  viewbox: "0 0 441 441",
  svg: `<polygon stroke-width="10" points="35.5,412.2 44.5,235.2 68.5,225.2 96.5,61.25 200.5,47.2 210.5,23.2 284.5,22.2 303.5,67.2 350.5,72.2 365.5,252.2 397.5,262.2 405.5,412.2"/>
  <polygon stroke-width="10" points="200.5,47.2 177.503,103.5 182.3,49.6"/>
  <polygon stroke-width="10" points="68.5,225.2 98.2,212.9 71.5,207.6"/>
  <polygon stroke-width="10" points="365.5,252.2 368.5,326.52 380.4,256.9"/>`,
  style: `fill: color-mix(in srgb, var(--c, var(--c1)) 70%, black 30%); stroke: var(--c0)`
};

export const direction = {
  viewbox: "0 0 20 20",
  svg: `<path d="M9 21h8M15 6V4a1 1 0 00-1-1H12a1 1 0 00-1 1V6Zm-4 6v9h4V12ZM7.3 6a1 1 0 00-.8.5l-1.3 2a1 1 0 000 1.1l1.3 2a1 1 0 00.8.5H18a1 1 0 001-1V7a1 1 0 00-1-1Z" stroke-linecap="round" stroke-linejoin="round"/>
        <path fill="color-mix(in srgb, var(--c7) 70%, black 30%)" d="M7.3 6a1 1 0 00-.8.5l-1.3 2a1 1 0 000 1.1l1.3 2a1 1 0 00.8.5H18a1 1 0 001-1V7a1 1 0 00-1-1Z"/>`,
  style: `fill: var(--c7); stroke: var(--c7)`
};

export const msg = {
  style: `
    --display: none;
    font-size: 2cqi;
    text-align: center;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    z-index: var(--zindex);
    text-transform: var(--t);

    &::before {
      content: attr(data-text);
      background-color: var(--c1);
      color: var(--c0);
      padding: 0.5cqi;
      border: 0.5cqi solid var(--c, var(--c4));
      border-radius: 1cqi;
    }

    &[data-d="true"]::before {
      border: 0.3cqi dashed var(--c3);
    }
  `
};
