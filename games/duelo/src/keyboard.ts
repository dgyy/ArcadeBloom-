declare const touch: HTMLElement;

const enum KeyboardProperties {
    State,
    Sequence,
    LastUp,
}

type Keyboard<Key extends string> = {
    [KeyboardProperties.State]: { [K in Key]: boolean };
    [KeyboardProperties.Sequence]: { [K in Key]: number };
    [KeyboardProperties.LastUp]: { [K in Key]: number };
};

const cooldown = 200;
export const keyboardInitialize = <Key extends string>(keys: Key[]): Keyboard<Key> => {
    const keyboard = {
        [KeyboardProperties.State]: Object.fromEntries(keys.map(key => [key, false])) as { [K in Key]: boolean },
        [KeyboardProperties.Sequence]: Object.fromEntries(keys.map(key => [key, 0])) as { [K in Key]: number },
        [KeyboardProperties.LastUp]: Object.fromEntries(keys.map(key => [key, 0])) as { [K in Key]: number },
    };

    const keyDown = (e: Event, key: Key) => keyboardSetState(keyboard, key, true);
    const keyUp = (e: Event, key: Key) => keyboardSetState(keyboard, key, false);

    addEventListener('keydown', (e: KeyboardEvent) => keyDown(e, e.code as Key));
    addEventListener('keyup', (e: KeyboardEvent) => keyUp(e, e.code as Key));

    const enableTouch = () => {
        const touchKeyStart = event => keyDown(event, (event.target as HTMLElement).dataset.key as Key);
        const touchKeyEnd = event => keyUp(event, (event.target as HTMLElement).dataset.key as Key);
        document.querySelectorAll('[data-key]').forEach(key => {
            key.addEventListener('touchstart', touchKeyStart);
            key.addEventListener('touchend', touchKeyEnd);
        });

        document.ondblclick = e => e.preventDefault();
    };

    if (typeof ontouchstart !== 'undefined') {
        enableTouch();
    } else {
        touch.classList.add('no-touch');
    }

    return keyboard;
};

const keyboardSetState = <Key extends string>(keyboard: Keyboard<Key>, key: Key, value: boolean) => {
    if (keyboard[KeyboardProperties.State][key] === value) {
        return;
    }

    if (value) {
        keyboard[KeyboardProperties.Sequence][key]++;
    }
    if (!keyboardIsWarm(keyboard, key)) {
        keyboard[KeyboardProperties.Sequence][key] = 1;
    }
    keyboard[KeyboardProperties.State][key] = value;
    keyboard[KeyboardProperties.LastUp][key] = new Date().getTime();
};

const keyboardIsWarm = <Key extends string>(keyboard: Keyboard<Key>, key: Key) =>
    new Date().getTime() - keyboard[KeyboardProperties.LastUp][key] < cooldown;

export const keyboardGetState = <Key extends string>(keyboard: Keyboard<Key>, key: Key): number => {
    if (!keyboard[KeyboardProperties.State][key]) {
        return 0;
    }

    return keyboardIsWarm(keyboard, key) ? keyboard[KeyboardProperties.Sequence][key] : 1;
};
