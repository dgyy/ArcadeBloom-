import { create } from "./dom"

let bounding = (el: HTMLElement | Range) => el.getBoundingClientRect()

export let html2canvas = (element: HTMLElement) => {
	let range = document.createRange()
  let offset = bounding(element)
  let canvas = create<HTMLCanvasElement>('canvas')
  canvas.width = offset.width
  canvas.height = offset.height

	let context = canvas.getContext('2d')!

  let drawText = (style: CSSStyleDeclaration, x: number, y: number, text: string) => {
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    context.textBaseline = 'top'
    context.fillStyle = style.color
    // @ts-expect-error Ok to coerce
    context.fillText(text, x, y + (style.fontSize | 0) * 0.1)
  }

	let drawElement = (element: ChildNode, style: CSSStyleDeclaration) => {
		if (element.nodeType === Node.TEXT_NODE) {
			range.selectNode(element)
			let rect = bounding(range)
			drawText(
        style,
        rect.left - offset.left - 0.5,
        rect.top - offset.top - 0.5,
        element.nodeValue!.trim()
      )
		} else {
			style = window.getComputedStyle(element as Element)
		}

    for (let node of element.childNodes) drawElement(node, style)
	}

	drawElement(element, {} as CSSStyleDeclaration)
	return canvas
}
