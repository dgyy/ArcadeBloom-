import { mouseWasPressed, mousePosScreen, drawTextScreen, hsl, vec2, mainCanvas } from './libs/littlejs.esm.min.js';
import { player, stopSpawningZombies, startSpawningZombies } from './main.js';
import { getCurrency, setCurrency } from './bullet.js';

let inShop = false;
let selectedItem = 0;

export function isInShop() {
    return inShop;
}

// Updated items list with the Pistol with 10, 35, 60, 100 beep thresholds
export const items = [
    { name: 'Pistol', cost: 10, purchased: false },
    { name: 'SMG', cost: 35, purchased: false }, // renamed Machine Gun to SMG
    { name: 'Shotgun', cost: 60, purchased: false },
    { name: 'Fire Ability', cost: 100, purchased: false },
];


export function setInShop(status) {
    inShop = status;
    if (status) {
        stopSpawningZombies();
    } else {
        startSpawningZombies();
    }
}

export function getSelectedItem() {
    return selectedItem;
}

export function setSelectedItem(index) {
    selectedItem = index;
}

export function handleShopMouseClick() {
    if (!mouseWasPressed(0)) {
        return;
    }

    const screenMousePos = mousePosScreen;

    const textPos = vec2(50, 50);
    const textSize = vec2(200, 50);
    items.forEach((item, index) => {
        const itemPos = vec2(mainCanvas.width / 2, mainCanvas.height / 2 - 100 + index * 50);
        const itemSize = vec2(300, 50); // Width and height of clickable item area

        if (screenMousePos.x >= itemPos.x - itemSize.x / 2 && screenMousePos.x <= itemPos.x + itemSize.x / 2 &&
            screenMousePos.y >= itemPos.y - itemSize.y / 2 && screenMousePos.y <= itemPos.y + itemSize.y / 2) {

            setSelectedItem(index); // Set the clicked item as selected
            buyItem(items[index]);  // Trigger purchase
        }
    });
    if (screenMousePos.x >= textPos.x && screenMousePos.x <= textPos.x + textSize.x &&
        screenMousePos.y >= textPos.y && screenMousePos.y <= textPos.y + textSize.y) {

        if (!isInShop()) {
            enterShop();
        } else {
            exitShop();
        }
    }
    
}



export function drawShop() {

    items.forEach((item, index) => {
        const affordable = getCurrency() >= item.cost;
        const textColor = affordable ? (index === getSelectedItem() ? hsl(0, 0, 1) : hsl(0, 0, 0.7)) : hsl(0, 0, 0.3);

        // Larger clickable area for each item
        const itemPos = vec2(mainCanvas.width / 2, mainCanvas.height / 2 - 100 + index * 50); // Position for each item


        drawTextScreen(item.name + ' - ' + item.cost + ' currency', itemPos, 30, textColor, 2, hsl(0, 0, 0));
    });
}


export function enterShop() {

    setInShop(true);
}

export function exitShop() {
    setInShop(false);
}

function buyItem(item) {
    if (!isInShop()) {
        return;
    }
    if (getCurrency() >= item.cost && !item.purchased) {
        setCurrency(getCurrency() - item.cost);
        player.addItem(item.name); // Add item to player's inventory
        item.purchased = true; // Mark item as purchased

        if (item.name === 'Pistol' || item.name === 'Shotgun' || item.name === 'SMG') {
            player.weapon = item.name; // Automatically switch to the new weapon if it's a gun
        } else if (item.name === 'Fire Ability') {
            player.fireAbility = true; // Enable fire ability if purchased
        }

        exitShop();
    }
}