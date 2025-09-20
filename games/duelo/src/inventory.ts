import {
    Animatable,
    animatableCreate,
    animatableDraw,
    animatableGetRootTransform,
    animatableSetOriginComponent,
    animatableTransform,
    animatableTransformApply,
} from './animation';
import { glClear, glProgramCreate, glSetViewMatrix, glSetViewport } from './gl';
import { matrixCreate, matrixScale, matrixSetIdentity, matrixTranslateVector, vectorCreate } from './glm';
import {
    storageAddGold,
    storageGetEquippedIds,
    storageGetGold,
    storageGetItemIds,
    storageSetEquippedIds,
    storageSetItemIds,
} from './storage';
import {
    CROWN_ID,
    EquippedIds,
    EquippedIdsProperties,
    equipCreateAnimatable,
    equipGetAttack,
    equipGetDefense,
    equipGetName,
    equipGetOriginComponentId,
    equipGetType,
} from './equip';
import {
    NearInstance,
    nearBuy,
    nearCancelSale,
    nearCollectSale,
    nearGetAccountId,
    nearGetUserSales,
    nearGetRandomSales,
    nearGetSignedIn,
    nearRequestSignIn,
    nearSell,
    nearSignOut,
    UserSales,
} from './near';
import { uiAlert, uiHideElement, uiShowElement } from './ui';
import { ModelType, objectCreate } from './model';

declare const inv: HTMLElement;
declare const invItems: HTMLElement;
declare const eqItems: HTMLElement;
declare const sellItems: HTMLElement;
declare const mktItems: HTMLElement;
declare const btninv: HTMLElement;
declare const menuinv: HTMLElement;
declare const invClose: HTMLElement;
declare const signMsg: HTMLElement;
declare const shop: HTMLElement;
declare const logged: HTMLElement;
declare const signOut: HTMLElement;
declare const mainnet: HTMLElement;
declare const testnet: HTMLElement;
declare const gold: HTMLElement;
declare const cnf: HTMLElement;
declare const yes: HTMLElement;
declare const no: HTMLElement;
declare const spinner: HTMLElement;
declare const touch: HTMLElement;
declare const css: HTMLElement;
declare const calc: HTMLElement;
declare const price: HTMLElement;
declare const invprice: HTMLElement;
declare const sellSell: HTMLElement;
declare const sellCancel: HTMLElement;

const enum InventoryProperties {
    InventoryItems,
    EquippedItems,
    SellItems,
    MarketItems,
    Near,
}

type MarketItems = Awaited<ReturnType<typeof nearGetRandomSales>>;

type Inventory = {
    [InventoryProperties.InventoryItems]: Array<number>;
    [InventoryProperties.EquippedItems]: EquippedIds;
    [InventoryProperties.SellItems]: UserSales;
    [InventoryProperties.MarketItems]: MarketItems;
    [InventoryProperties.Near]: NearInstance;
};

export const inventoryIsFull = () => {
    return storageGetItemIds().length >= 10;
};

export const inventoryAddItem = (itemId: number) => {
    const items = inventory[InventoryProperties.InventoryItems];
    if (items.length >= 10) {
        return;
    }

    items.push(itemId);
    inventorySetItems(items);
};

export const inventoryAddGold = (amount: number) => {
    storageAddGold(amount);
    renderGold();
};

const createItemAction = (action: string) => {
    const itemAction = document.createElement('div');
    itemAction.classList.add('i-act');
    itemAction.innerText = action;
    return itemAction;
};

const createPrice = (price: number) => {
    const itemPrice = document.createElement('div');
    itemPrice.classList.add('invprice');
    itemPrice.classList.add(getRenderedGoldClass());
    itemPrice.innerText = `${price}`;
    return itemPrice;
};

const selectItem = (itemDiv: HTMLDivElement) => {
    const current = inv.querySelector('.selected');
    current?.classList.remove('selected');
    current?.querySelectorAll('.i-top, .i-acts').forEach(uiHideElement);
    if (current !== itemDiv) {
        itemDiv.classList.add('selected');
        itemDiv.querySelectorAll('.i-top, .i-acts').forEach(uiShowElement);
    }
};

const createItemDiv = (
    itemId: number,
    actionsBuilder: (itemActions: HTMLDivElement, itemTop: HTMLDivElement, itemDiv: HTMLDivElement) => void
) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('invitem');

    if (itemId !== undefined) {
        itemDiv.classList.add(getRenderedItemClass(itemId));

        const name = equipGetName(itemId);
        const stats =
            equipGetType(itemId) === EquippedIdsProperties.SwordId
                ? `+${equipGetAttack(itemId)} ATK`
                : `+${equipGetDefense(itemId)} DEF`;

        const itemName = document.createElement('div');
        itemName.classList.add('i-name');
        itemName.innerText = `${name} (${stats})`;
        const itemTop = document.createElement('div');
        itemTop.classList.add('i-top');
        itemTop.classList.add('hidden');
        itemTop.style.display = 'none';
        itemTop.appendChild(itemName);
        itemDiv.appendChild(itemTop);
        itemDiv.style.backgroundColor = '#222';

        const itemActions = document.createElement('div');
        itemActions.classList.add('i-acts');
        itemActions.classList.add('hidden');
        itemActions.style.display = 'none';
        itemDiv.appendChild(itemActions);

        actionsBuilder(itemActions, itemTop, itemDiv);

        itemDiv.onclick = () => selectItem(itemDiv);
    }
    return itemDiv;
};

const inventory = {
    [InventoryProperties.InventoryItems]: storageGetItemIds(),
    [InventoryProperties.EquippedItems]: storageGetEquippedIds(),
    [InventoryProperties.SellItems]: [] as UserSales,
    [InventoryProperties.MarketItems]: [] as MarketItems,
    [InventoryProperties.Near]: null,
};

export const inventoryStart = async () => {
    const near = await nearGetSignedIn().catch(() => null);
    inventory[InventoryProperties.Near] = near;
    inventory[InventoryProperties.SellItems] = near ? await nearGetUserSales(near) : [];
    inventory[InventoryProperties.MarketItems] = near ? await nearGetRandomSales(near) : [];

    toggleSignIn(near);

    renderInventory();
    renderGold();
    renderEquippedItems();

    if (inventory) {
        renderUserSales();
        renderMarket();
    }

    uiShowElement(inv);
};

const renderInventory = () => {
    invItems.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const itemId = inventory[InventoryProperties.InventoryItems][i];
        const itemDiv = createItemDiv(itemId, itemActions => {
            const equipAction = createItemAction('EQUIP');
            equipAction.onclick = () => {
                const equipped = storageGetEquippedIds();
                const equipSlot = equipGetType(itemId);
                const oldEquipped = equipped[equipSlot];
                const items = storageGetItemIds();
                items.splice(i, 1, ...(oldEquipped >= 0 ? [oldEquipped] : []));
                equipped[equipSlot] = itemId;
                inventorySetItems(items);
                inventorySetEquippedItems(equipped);
            };
            itemActions.appendChild(equipAction);

            const near = inventory[InventoryProperties.Near];
            if (near && itemId !== CROWN_ID) {
                const sellAction = createItemAction('SELL');
                sellAction.onclick = async () => {
                    if (inventory[InventoryProperties.SellItems].length >= 10) {
                        uiAlert('YOU CAN ONLY HAVE 10 ITEMS FOR SALE AT A TIME.');
                        return;
                    }

                    const price = await inventoryShowCalc();
                    if (!price) {
                        return;
                    }

                    uiShowElement(spinner);
                    const sale = await nearSell(near, itemId, price).catch(showGenericError);
                    if (sale) {
                        const items = storageGetItemIds();
                        items.splice(i, 1);
                        inventorySetUserSales();
                        inventorySetItems(items);
                    }
                    uiHideElement(spinner);
                };
                itemActions.appendChild(sellAction);
            }

            if (itemId !== CROWN_ID) {
                const dropAction = createItemAction('DROP');
                dropAction.onclick = () => {
                    uiShowElement(cnf);
                    const close = () => uiHideElement(cnf);
                    yes.onclick = () => {
                        yes.onclick = null;
                        const items = storageGetItemIds();
                        items.splice(i, 1);
                        inventorySetItems(items);
                        close();
                    };
                    no.onclick = close;
                };
                itemActions.appendChild(dropAction);
            }
        });

        invItems.appendChild(itemDiv);
    }
};

const showGenericError = () => uiAlert('AN ERROR OCCURRED. PLEASE TRY AGAIN LATER.');

const renderGold = () => {
    gold.classList.add(getRenderedGoldClass());
    gold.innerText = `${storageGetGold()} GOLD`;
};

const inventorySetItems = (items: Array<number>) => {
    storageSetItemIds(items);
    inventory[InventoryProperties.InventoryItems] = items;
    renderInventory();
};

const inventorySetEquippedItems = (equipped: EquippedIds) => {
    onEquip?.(equipped);
    storageSetEquippedIds(equipped);
    inventory[InventoryProperties.EquippedItems] = equipped;
    renderEquippedItems();
};

const inventorySetUserSales = async () => {
    inventory[InventoryProperties.SellItems] = await nearGetUserSales(inventory[InventoryProperties.Near]);
    renderUserSales();
};

const renderEquippedItems = () => {
    eqItems.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const itemId = inventory[InventoryProperties.EquippedItems][i];
        const itemDiv = createItemDiv(itemId, itemActions => {
            const unequipAction = createItemAction('UNEQUIP');
            unequipAction.onclick = () => {
                if (inventoryIsFull()) {
                    uiAlert('YOUR INVENTORY IS FULL.');
                    return;
                }

                const equipped = storageGetEquippedIds();
                equipped[equipGetType(itemId)] = undefined;
                inventoryAddItem(itemId);
                inventorySetEquippedItems(equipped);
            };
            itemActions.appendChild(unequipAction);
        });

        eqItems.appendChild(itemDiv);
    }
};

const renderUserSales = () => {
    sellItems.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const userSale = inventory[InventoryProperties.SellItems][i];
        const itemDiv = createItemDiv(userSale?.sale.itemId, (itemActions, itemTop, itemDiv) => {
            if (!userSale) {
                return;
            }

            const sale = userSale.sale;
            const near = inventory[InventoryProperties.Near];
            if (userSale.completed) {
                const collectAction = createItemAction('COLLECT');
                itemDiv.appendChild(createPrice(sale.price));
                collectAction.onclick = async () => {
                    uiShowElement(spinner);
                    const sale = await nearCollectSale(near, userSale.id).catch(showGenericError);
                    if (sale) {
                        inventoryAddGold(sale.price);
                        inventorySetUserSales();
                    }
                    uiHideElement(spinner);
                };
                itemActions.appendChild(collectAction);
                const sellerName = document.createElement('div');
                sellerName.classList.add('i-seller');
                sellerName.innerText = `SOLD TO ${userSale.buyerId}`;
                itemTop.appendChild(sellerName);
                const sold = document.createElement('div');
                sold.classList.add('i-sold');
                sold.innerText = 'SOLD!';
                itemDiv.appendChild(sold);
            } else {
                itemDiv.appendChild(createPrice(sale.price));
                const cancelAction = createItemAction('CANCEL');
                cancelAction.onclick = async () => {
                    if (inventoryIsFull()) {
                        uiAlert('YOUR INVENTORY IS FULL.');
                        return;
                    }

                    uiShowElement(spinner);
                    const sale = await nearCancelSale(near, userSale.id).catch(showGenericError);
                    if (sale) {
                        inventorySetUserSales();
                        inventoryAddItem(sale.itemId);
                    }
                    uiHideElement(spinner);
                };
                itemActions.appendChild(cancelAction);
            }
        });

        sellItems.appendChild(itemDiv);
    }
};

const renderMarket = () => {
    mktItems.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const saleEntry = inventory[InventoryProperties.MarketItems][i];
        const itemDiv = createItemDiv(saleEntry?.sale.itemId, (itemActions, itemTop, itemDiv) => {
            if (!saleEntry) {
                return;
            }
            const sale = saleEntry.sale;
            const buyAction = createItemAction('BUY');
            const price = createPrice(sale.price);
            itemDiv.appendChild(price);

            if (sale.price > storageGetGold()) {
                price.style.color = '#f00';
            }

            buyAction.onclick = async () => {
                if (storageGetGold() < sale.price) {
                    uiAlert("YOU DON'T HAVE ENOUGH GOLD.");
                    return;
                }

                if (inventoryIsFull()) {
                    uiAlert('YOUR INVENTORY IS FULL.');
                    return;
                }

                const near = inventory[InventoryProperties.Near];

                uiShowElement(spinner);
                const bought = await nearBuy(near, saleEntry.id).catch(showGenericError);
                if (bought) {
                    inventoryAddGold(-bought.price);
                    inventoryAddItem(bought.itemId);
                    itemDiv.replaceWith(createItemDiv(undefined, () => {}));
                }

                uiHideElement(spinner);
            };
            const sellerName = document.createElement('div');
            sellerName.classList.add('i-seller');
            sellerName.innerText = `SOLD BY ${sale.sellerId}`;
            itemTop.appendChild(sellerName);
            itemActions.appendChild(buyAction);
        });

        mktItems.appendChild(itemDiv);
    }
};

const toggleElement = (element: HTMLElement, show: boolean) => {
    element.style.display = show ? null : 'none';
};

const toggleSignIn = async (near: NearInstance) => {
    toggleElement(signMsg, near === null);
    toggleElement(mainnet, near === null);
    toggleElement(testnet, near === null);
    toggleElement(shop, near !== null);
    if (near) {
        logged.innerText = `LOGGED IN TO NEAR AS ${nearGetAccountId(near)}`;
    }
};

const getRenderedItemClass = (itemId: number) => {
    const animatable = equipCreateAnimatable(itemId);
    const originComponentId = equipGetOriginComponentId(itemId);
    return getRenderedClass(itemId, animatable, originComponentId);
};

const getRenderedGoldClass = () => {
    const animatable = animatableCreate(objectCreate(ModelType.Gold), []);
    const originComponentId = 0;
    return getRenderedClass('gold', animatable, originComponentId);
};

const getRenderedClass = (() => {
    const WIDTH = 128;
    const HEIGHT = 128;
    const SCALE = 0.05;
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const program = glProgramCreate(canvas, WIDTH, HEIGHT);
    glSetViewport(program, 0, 0, WIDTH, HEIGHT);
    const viewMatrix = matrixCreate();
    matrixSetIdentity(viewMatrix);
    matrixScale(viewMatrix, SCALE, SCALE);
    glSetViewMatrix(program, viewMatrix);
    const renderedIds = {};

    return (cacheId: number | string, animatable: Animatable, originComponentId: number) => {
        if (!renderedIds[cacheId]) {
            glClear(program, [0, 0, 0, 0]);

            const matrix = animatableGetRootTransform(animatable);
            matrixSetIdentity(matrix);
            animatableTransform(animatable);
            animatableSetOriginComponent(animatable, originComponentId);
            matrixSetIdentity(matrix);
            matrixTranslateVector(matrix, vectorCreate(0, 0));
            animatableTransformApply(animatable, matrix);
            animatableDraw(animatable, program);

            const img = canvas.toDataURL('image/png');
            css.innerHTML += `.img-${cacheId} { background-image: url(${img}); }`;
            renderedIds[cacheId] = true;
        }
        return `img-${cacheId}`;
    };
})();

export const inventoryInit = () => {
    mainnet.onclick = testnet.onclick = (event: MouseEvent) => {
        nearRequestSignIn((event.target as HTMLDivElement).id);
    };

    signOut.onclick = async () => {
        await nearSignOut();
        toggleSignIn(null);
    };

    btninv.onclick = () => {
        inventoryStart();
        uiHideElement(touch);

        invClose.onclick = () => {
            uiHideElement(inv);
            uiShowElement(touch);
        };
    };

    menuinv.onclick = () => {
        inventoryStart();

        invClose.onclick = () => {
            uiHideElement(inv);
        };
    };
};

const inventoryShowCalc = (): Promise<number> =>
    new Promise(resolve => {
        let value = 0;

        const renderValue = () => {
            price.innerText = `${value}`;
        };

        calc.onclick = event => {
            const pressed = (event.target as HTMLElement).innerText;
            switch (pressed) {
                case 'AC':
                    value = 0;
                    break;
                case 'CE':
                    value = Math.floor(value / 10);
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    value = Math.min(99999, value * 10 + parseInt(pressed, 10));
                    break;
            }

            renderValue();
        };

        renderValue();
        uiShowElement(invprice);

        sellSell.onclick = () => {
            if (value === 0) {
                return;
            }
            uiHideElement(invprice);
            resolve(value);
        };

        sellCancel.onclick = () => {
            uiHideElement(invprice);
            resolve(null);
        };
    });

let onEquip = null;
export const inventorySetOnEquip = (callback: (equipped: EquippedIds) => void) => {
    onEquip = callback;
};
