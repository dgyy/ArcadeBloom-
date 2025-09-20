class element{
    constructor(html){
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        this.html = tempElement.firstChild;
    }
}

export default element