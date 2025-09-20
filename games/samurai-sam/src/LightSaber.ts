import { vec2 } from './littlejs';
import { INftCollection } from './INftCollection';
import { MySvg } from './MySvg';
import { lightBlue } from './colors';
import { handleSvgCollisions } from './handleSvgCollisions';

export class LightSaber {
  handleSvg: MySvg;
  swordPart1Svg: MySvg;
  collection: INftCollection;

  constructor(collection: INftCollection) {
    this.collection = collection;
    collection['metadata']['attributes'].forEach((a) => {
      switch (a['trait_type']) {
        case 'Handle':
          this.handleSvg = new MySvg(a['value'], null, null, 'white');
          this.handleSvg.setGravityScale(0);
          this.handleSvg.translateSvg(vec2(-20, 94));
          break;
        case 'Sword part1':
          this.swordPart1Svg = new MySvg(a['value'], null, null, lightBlue);
          this.swordPart1Svg.setGravityScale(0);
          break;
      }
    });
    this.getSvgs().forEach((svg) => {
      svg.setPos(vec2(400, 300));
    });
  }
  update() {
    this.getSvgs().forEach((svg) => {
      svg.update();
      handleSvgCollisions(svg, 1);
    });
  }
  render(ctx) {
    this.getSvgs().forEach((svg) => svg.render(ctx));
  }
  getSvgs() {
    const svgs = [];
    if (this.swordPart1Svg) svgs.push(this.swordPart1Svg);
    if (this.handleSvg) svgs.push(this.handleSvg);
    return svgs;
  }

  setScale(scale: vec2) {
    this.getSvgs().forEach((svg) => {
      svg.setScale(scale);
    });
  }
  setPos(pos: vec2) {
    this.getSvgs().forEach((svg) => {
      svg.setPos(pos);
    });
  }
  translate(dist: vec2) {
    this.getSvgs().forEach((svg) => {
      svg.translateSvg(dist);
    });
  }
  getCollection() {
    return this.collection;
  }
}
