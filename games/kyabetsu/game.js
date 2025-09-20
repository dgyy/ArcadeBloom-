import "./style.js";
import Engine from "./lib/engine.js";
import * as sprites from "./sprites.js";
import { intro } from "./scenes/intro.js";
import { mountains } from "./scenes/mountains.js";
import { cave } from "./scenes/cave.js";
import { farm } from "./scenes/farm.js";
import { end } from "./scenes/end.js";
import { story } from "./scenes/story.js";
import { house } from "./scenes/house.js";
import { hole } from "./scenes/hole.js";
import { moon } from "./scenes/moon.js";
import { hole2 } from "./scenes/hole2.js";
import { roof } from "./scenes/roof.js";
import { cave2 } from "./scenes/cave2.js";

new Engine({
  containerEl: document.querySelector("main"),
  sprites,
  actions: [
    {
      id: "look-at",
      default: "Nothing special here"
    },
    {
      id: "talk-to",
      default: "I can't"
    },
    {
      id: "pick-up",
      default: "It's hard"
    },
    {
      id: "hit",
      default: "Not a good idea"
    },
    {
      id: "read",
      default: "Nothing to read"
    },
    {
      id: "use",
      default: "How?"
    }
  ],
  sounds: {
    move: () => [3.8, , 305, .03, .01, , 1, 3.8, , 32, , , , .2, , .1, .01, .64, .02, , -1083],
    collect: () => [1.1, , 308, .02, .1, .16, 1, 3.8, 4, , , , , , , , , .56, .01],
    say: (v) => [.5, 0, 100 + v * 400, .18, .38, .28, Math.random() > 0.5 ? 2 : 3, .9, , , , , , v, 1, , , .71, .05, , 600 + v * 600],
    scene: () => [1.2, 0, 131.81, , 0.5 + Math.random() * 0.5, .44, , 1 + Math.random(), , , -100, .01, .23, , , .1, , .5, .08, Math.random(), -1004],
    hit: () => [2, , 296, .01, , .19, 1, .6, , -41, , , , .6, , , .02, .72, .02],
    spider: () => [, .4, 18, .11, .04, 0, , 5.4, 14.7, 50, -103, .12, , .1, 64, , , .93, .07, .02],
    yes: () => [, , 381, .06, .29, .45, , 3.1, , 162, 124, .06, .07, .5, , , , .71, .11],
    duck: () => [, , 54, .02, , , 3, 2.4, -17, 34, -497, , .09, , , , .24, 1.3, .02, .05, -1414]
  },
  functions: {
    move({ pos }) {
      this.setEntityProps("c", {
        x: pos.x,
        y: pos.y - this.getEntity("c").props.h / 3
      });
      this.setEntityProps("msg", {
        display: "none"
      });
      this.playSound("move");
      this.getEntityEl("c").querySelector("#f1")?.beginElement();
      this.getEntityEl("c").querySelector("#f2")?.beginElement();
    },
    look({ pos, who }) {
      this.setEntityProps(who || "c", {
        scale: pos.x < this.getEntity(who || "c").props.x ? "-1 1" : 1
      });
    },
    say(who, text, opts) {
      const id = opts?.id || "msg";
      const pos = this.getEntity(who).props;
      const x = pos.x;
      const h = this.getEntity(id).props.h / 2;
      const y = Math.max(h * 2, pos.y - pos.h / 2) - h;
      this.setEntityProps(id, {
        x: Math.max(Math.min(x, 90), 10),
        y,
        display: "none",
        text: "",
        zindex: 110,
        d: opts?.d
      });
      setTimeout(() => {
        this.setEntityProps(id, {
          text,
          display: "flex",
        });
        if ((id === "tooltip" && this.getEntity("msg")?.props.display === "flex") || (id === "msg" && this.getEntity("tooltip")?.props.display === "flex")) {
          this.setEntityProps(id, {
            zindex: this.getEntity(id === "msg" ? "tooltip" : "msg").props.zindex + 2
          });
        }
      }, opts?.t ?? 100);
      if (id === "msg") {
        this.playSound(who === "duck" ? "duck" : "say", ({ "c": 0.3, "ao": 0.1 }[who] || 0) + Math.random() * 0.3);
        this.getEntityEl(who).querySelector("#mouth")?.beginElement();
      }
    },
    collect({ id, sprite, sceneObj, props }) {
      const c = this.getEntity("c");
      this.setEntityProps(sceneObj, {
        x: c.props.x,
        y: c.props.y,
      });
      setTimeout(() => {
        this.setEntityProps(sceneObj, {
          hidden: true,
          scale: 0
        });
        this.collect({ id, sprite, props });
      }, 200);
      this.playSound("collect");
      this.exec("arm");
    },
    talk(list) {
      this.lock(true);
      this.setEntityProps("tooltip", {
        display: "none",
      });
      clearInterval(this._t);
      let i = 0;
      this.exec("say", ...list[i++]);
      this._t = setInterval(() => {
        if (i < list.length) {
          this.exec("say", ...list[i++]);
        } else {
          clearInterval(this._t);
          this.lock(false);
          this.setEntityProps("msg", {
            display: "none"
          });
        }
      }, 2000);
    },
    arm() {
      this.getEntityEl("c").querySelector("#a1")?.beginElement();
    }
  },
  onTooltip(entity, text) {
    if (entity) {
      this.exec("say", entity.id, text, { id: "tooltip", t: 0, d: !!entity.tooltip });
    } else {
      this.setEntityProps("tooltip", {
        display: "none"
      });
    }
  },
  onSceneLeave() {
    clearInterval(this._t);
    this.playSound("scene");
  },
  scenes: [
    intro,
    story,
    mountains,
    farm,
    cave,
    hole2,
    end,
    house,
    hole,
    moon,
    roof,
    cave2
  ]
});
