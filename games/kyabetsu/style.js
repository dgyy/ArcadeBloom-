const style = document.createElement("style");
document.head.append(style);
style.innerHTML = `
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
  font-weight: bold;
}

:root {
  --c0: hsl(20, 6%, 9%);
  --c1: hsl(0, 0%, 91%);
  --c2: hsl(42, 79%, 54%);
  --c3: hsl(198, 58%, 43%);
  --c4: hsl(246, 46%, 37%);
  --c5: hsl(4, 88%, 58%);
  --c6: hsl(159, 30%, 48%);
  --c7: hsl(48, 64%, 29%);

  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  user-select: none;
}

body {
  display: block;
  position: absolute;
  inset: 0;
  height: 100dvh;
  width: 100dvw;
  background-color: var(--c0);
  overflow: hidden;
}

main {
  display: block;
  position: absolute;
  inset: 0;
  max-height: 100dvh;
  max-width: 100dvw;
  margin: auto;
  aspect-ratio: 1 / 1;
  background-color: color-mix(in srgb, var(--c0) 95%, gray 5%);
  container-type: size;

  &[data-lock="true"] {
    pointer-events: none;
  }

  [data-entity] {
    position: absolute;
    top: 0;
    left: 0;
    display: var(--display, "block");
    transition: translate 0.5s ease-in-out, scale 0.2s ease-in-out, rotate 0.2s ease-in-out;
    width: calc(var(--w, 1) * 1cqi);
    height: calc(var(--h, 1) * 1cqb);
    translate: calc(var(--x, 0) * 1cqi - 50%) calc(var(--y, 0) * 1cqb - 50%);
    transform: skewX(var(--skewx, 0deg)) skewY(var(--skewy, 0deg));
    scale: var(--scale, 1);
    rotate: var(--rotate, 0deg);
    clip-path: var(--clip);
    overflow: hidden;

    svg {
      display: block;
    }

    &[data-hidden="true"] {
      --scale: 0;
      pointer-events: none;
    }

    &[data-actions="true"] {
      cursor: pointer;
    }

    &[data-onpress="true"] {
      cursor: crosshair;
    }
  }

  .hud {
    position: absolute;
    opacity: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: all 0.5s ease;
    translate: 0 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2cqi;
    font-size: 1.8cqi;
    padding: 1cqi;
    z-index: 100;
    border: 1cqi solid var(--c4);
    background: var(--c0);

    main:not([data-lock="true"]) &[data-visible="true"] {
      opacity: 1;
      translate: 0;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1cqi;
      flex-basis: 50%;

      button {
        min-width: 10cqi;
      }

      [data-action="use"][data-object] {
        &::after {
          content: " " attr(data-object) " with";
        }
      }
    }

    .objects {
      display: flex;
      flex-basis: 50%;
      gap: 1cqi;

      button {
        padding: 0.2cqb 1cqi;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      svg {
        display: block;
        width: 4cqi;
        height: 4cqi;
      }
    }
  }
}

button {
  background-color: color-mix(in srgb, var(--c0) 30%, var(--c1) 70%);
  color: var(--c0);
  padding: 1cqi;
  cursor: pointer;
  border: 0.5cqi solid var(--c4);
  font-size: inherit;
  white-space: nowrap;
  text-transform: capitalize;

  &.selected {
    background-color: var(--c6);
    border-color: var(--c2);
  }
}
`;
