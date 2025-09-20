function getElementsWithId(parentElement) {
    const elements = parentElement.querySelectorAll('[id]');
    const elementMap = {};

    elements.forEach(e => elementMap[e.id.replace(/-/g, "_")] = e);

    return elementMap;
}
export default getElementsWithId