import { ITEMS } from "./config";
let BAG_ITEM = new Proxy(new Array(ITEMS.length).fill(0), {
    set(target, property, value) {
        let r = Reflect.set(target, property, value)
        renderItem()
        return r;
    }
})
let elem = {}
let unlock = []
const initBag = () => {
    elem = document.getElementById('bag')
    BAG_ITEM[0] = 5
    BAG_ITEM[1] = 5
}
const renderItem = () => {
    let s = ''
    for (const i in BAG_ITEM) {
        if (!unlock.includes(i) && BAG_ITEM[i] > 0) {
            unlock.push(i)
        }

        if (unlock.includes(i)) {
            s += ITEMS[i] + '*' + BAG_ITEM[i] + '\n'
        }
    }
    elem.innerText = s
}
const addItem = (items) => {
    for (const itemName in items) {
        BAG_ITEM[itemName] += items[itemName]
    }
}
const delItem = (items) => {
    for (const itemName in items) {
        BAG_ITEM[itemName] -= items[itemName]
    }
}
export { initBag, BAG_ITEM, addItem,delItem }