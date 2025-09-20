const insig = 0.7;

export enum PenColor {
    Red,
    Green,
    Blue,
    None,
    RealRed,
    RealPurple
}

class Color{
    r: number
    g: number
    b: number
    a: number

    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    isGrey(){
        return this.r == this.g && this.g == this.b;
    }

    colorMap(color: PenColor){
        switch(color){
            case PenColor.Red:
                return [1, insig, insig]
            case PenColor.Green:
                return [insig, 1, insig]
            case PenColor.Blue:
                return [insig, insig, 1]
            case PenColor.RealRed:
                return [1, 0.2, 0.2]
            case PenColor.RealPurple:
                return [0.8, 0.3, 1]
            default:
                return [1, 1, 1]
        }
    }

    mapTo(color: PenColor){
        this.r *= this.colorMap(color)[0]
        this.g *= this.colorMap(color)[1]
        this.b *= this.colorMap(color)[2]
    }
}

function colorizeImage(img: HTMLImageElement, cp: PenColor): HTMLCanvasElement{
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 32, 32, 0, 0, 32, 32);

    const imgData = ctx.getImageData(0,0, img.width, img.height);
    const data = imgData.data;
    const colors: Color[] = [];

    for (let i: number = 0; i < data.length; i += 4)
    {
        const color = new Color(imgData.data[i], imgData.data[i+1], imgData.data[i+2], imgData.data[i+3]);
        if(color.isGrey()) color.mapTo(cp);
        colors.push(color);
    }

    for (let i: number = 0; i < colors.length; i++)
    {
        imgData.data[i*4] = colors[i].r;
        imgData.data[i*4+1] = colors[i].g;
        imgData.data[i*4+2] = colors[i].b;
        imgData.data[i*4+3] = colors[i].a;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas
}

export {colorizeImage}