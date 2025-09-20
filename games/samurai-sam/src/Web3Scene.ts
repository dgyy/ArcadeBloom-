import { vec2, canvasFixedSize } from './littlejs';

import { HaloSaber } from './HaloSaber';
import { LightSaber } from './LightSaber';
import { MySvg } from './MySvg';
import { haloSaberData, lightSaberData } from './NearConnection';
import { SceneManager } from './SceneManager';
import {
  createB,
  createE,
  createG,
  createI,
  createL,
  createN,
  createO,
  createP,
  createPlayButton,
  createQ,
  createU,
  createY,
} from './bambooFont';
import { emit, on } from './gameEvents';
import { handleSvgCollisions } from './handleSvgCollisions';
import {
  buyNftSword,
  getHaloSaber,
  getLightSaber,
  getNftCollection,
  getNftTokensForOwner,
  hasNearConection,
  initNear,
  isLoggedIn,
  isOwned,
  login,
} from './near';
import { setEquippedDragColor, setIsUseSelectedColor, setSelectedDragColor } from './inputUtils';
import { darkPink, lightBlue } from './colors';
import { tween } from './tween';

export class Web3Scene {
  lightSaber: LightSaber;
  haloSaber: HaloSaber;
  playBtn: MySvg[] = [];
  loginBtn: MySvg[] = [];
  equipHaloSaberBtn: MySvg[] = [];
  equipLightSaberBtn: MySvg[] = [];
  buyLightSaberBtn: MySvg[] = [];
  buyHaloSaberBtn: MySvg[] = [];

  isEventInProgress = false;

  equipButton: MySvg[] = [];
  constructor(private sceneManager: SceneManager) {
    on('split', this.onSplit);
  }

  createLoginButton() {
    const l = createL();
    const o = createO();
    const g = createG();
    const i = createI();
    const n = createN();
    o.forEach((svg) => svg.translateSvg(vec2(120, 0)));
    g.forEach((svg) => svg.translateSvg(vec2(255, 0)));
    i.forEach((svg) => svg.translateSvg(vec2(420, 0)));
    n.forEach((svg) => svg.translateSvg(vec2(470, 0)));
    return [...l, ...o, ...g, ...i, ...n];
  }

  createEquipButton() {
    const e = createE();
    const q = createQ();
    const u = createU();
    const i = createI();
    const p = createP();
    q.forEach((svg) => svg.translateSvg(vec2(120, 0)));
    u.forEach((svg) => svg.translateSvg(vec2(255, 0)));
    i.forEach((svg) => svg.translateSvg(vec2(400, 0)));
    p.forEach((svg) => svg.translateSvg(vec2(450, 0)));
    return [...e, ...q, ...u, ...i, ...p];
  }

  createBuyButton() {
    const b = createB();
    const u = createU();
    const y = createY();

    u.forEach((s) => s.translateSvg(vec2(120, 0)));
    y.forEach((s) => s.translateSvg(vec2(310, 15)));

    return [...b, ...u, ...y];
  }

  onSplit = (evt) => {
    if (this.sceneManager.currentScene != 'w') return;
    const other = evt.detail.data.svg;
    this.playBtn.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        this.isEventInProgress = true;
        setIsUseSelectedColor(false); // use the equipped color instead
        emit('play');
      }
    });
    if (this.lightSaber) {
      this.lightSaber.getSvgs().forEach((svg) => {
        if (svg == other) {
          setSelectedDragColor(lightBlue);
        }
      });
    }
    if (this.haloSaber) {
      this.haloSaber.getSvgs().forEach((svg) => {
        if (svg == other) {
          setSelectedDragColor(darkPink);
        }
      });
    }
    this.loginBtn.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        if (login() != false) {
          this.isEventInProgress = true;
        }
      }
    });
    this.equipLightSaberBtn.forEach((svg) => {
      if (svg == other) {
        setSelectedDragColor(lightBlue);
        setEquippedDragColor(lightBlue);
      }
    });
    this.equipHaloSaberBtn.forEach((svg) => {
      if (svg == other) {
        setSelectedDragColor(darkPink);
        setEquippedDragColor(darkPink);
      }
    });
    this.buyLightSaberBtn.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        if (isLoggedIn()) {
          buyNftSword(lightSaberData);
          this.isEventInProgress = true;
        } else {
          if (login() != false) {
            this.isEventInProgress = true;
          }
        }
      }
    });
    this.buyHaloSaberBtn.forEach((svg) => {
      if (this.isEventInProgress) return;
      if (svg == other) {
        this.isEventInProgress = true;
        if (isLoggedIn()) {
          buyNftSword(haloSaberData);
        } else {
          login();
        }
      }
    });
  };

  async initWeapons() {
    await Promise.all([getNftCollection()]);
    this.lightSaber = getLightSaber();
    this.haloSaber = getHaloSaber();
    this.lightSaber = new LightSaber(this.lightSaber.collection);
    this.haloSaber = new HaloSaber(this.haloSaber.collection);
  }
  update() {
    if (this.lightSaber) this.lightSaber.update();
    if (this.haloSaber) this.haloSaber.update();

    if (isLoggedIn() && isOwned(lightSaberData)) {
      this.equipLightSaberBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    } else if (hasNearConection()) {
      this.buyLightSaberBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    }
    if (isLoggedIn() && isOwned(haloSaberData)) {
      this.equipHaloSaberBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    } else if (hasNearConection()) {
      this.buyHaloSaberBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    }

    this.playBtn.forEach((s) => {
      s.update();
      handleSvgCollisions(s, 2);
    });
    if (hasNearConection() && !isLoggedIn()) {
      this.loginBtn.forEach((s) => {
        s.update();
        handleSvgCollisions(s, 1);
      });
    }
  }
  render(ctx) {
    if (this.lightSaber) this.lightSaber.render(ctx);
    if (this.haloSaber) this.haloSaber.render(ctx);

    ctx.save();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;

    if (isLoggedIn() && isOwned(lightSaberData)) {
      this.equipLightSaberBtn.forEach((s) => s.render(ctx));
    } else {
      this.buyLightSaberBtn.forEach((s) => s.render(ctx));
    }
    if (isLoggedIn() && isOwned(haloSaberData)) {
      this.equipHaloSaberBtn.forEach((s) => s.render(ctx));
    } else {
      this.buyHaloSaberBtn.forEach((s) => s.render(ctx));
    }

    this.playBtn.forEach((s) => s.render(ctx));
    if (!isLoggedIn()) {
      this.loginBtn.forEach((s) => s.render(ctx));
    }
    ctx.restore();
  }
  start() {
    this.playBtn.length = 0;
    this.buyLightSaberBtn.length = 0;
    this.buyHaloSaberBtn.length = 0;
    this.loginBtn.length = 0;
    this.equipHaloSaberBtn.length = 0;
    this.equipLightSaberBtn.length = 0;

    this.playBtn = createPlayButton();
    this.buyLightSaberBtn = this.createBuyButton();
    this.buyHaloSaberBtn = this.createBuyButton();
    this.loginBtn = this.createLoginButton();
    this.equipHaloSaberBtn = this.createEquipButton();
    this.equipLightSaberBtn = this.createEquipButton();
    this.buyLightSaberBtn.forEach((s) => {
      s.setScale(0.25);
      s.setGravityScale(0);
      s.translateSvg(vec2(375, 500));
    });
    this.buyHaloSaberBtn.forEach((s) => {
      s.setScale(0.25);
      s.setGravityScale(0);
      s.translateSvg(vec2(150, 500));
    });
    this.equipHaloSaberBtn.forEach((s) => {
      s.setGravityScale(0);
      s.setScale(0.25);
      s.translateSvg(vec2(150, 500));
    });
    this.equipLightSaberBtn.forEach((s) => {
      s.setGravityScale(0);
      s.setScale(0.25);
      s.translateSvg(vec2(375, 500));
    });
    this.loginBtn.forEach((s) => {
      s.setGravityScale(0);
      s.setScale(0.25);
    });
    tween(
      this.loginBtn,
      vec2(canvasFixedSize.x / 2 - 70, canvasFixedSize.y),
      vec2(canvasFixedSize.x / 2 - 70, canvasFixedSize.y - 100),
      1
    );
    this.isEventInProgress = false;
    initNear().then(async () => {
      if (isLoggedIn()) {
        await getNftTokensForOwner();
      }
    });
    setIsUseSelectedColor(true);
    this.initWeapons();
  }
}
