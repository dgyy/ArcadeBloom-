import { dist, getPointerPos, setElProps } from "./utils.js";
import { zzfx } from "./zzfx.js";

export default class Engine {
  constructor(c) {
    this.none = Symbol("none");
    Object.assign(this, c);
    this.state = {
      objects: {}
    };
    this.action = this.actions[0].id;
    this.drawHUD();
    this.setScene(this.scenes[0].id);
    this.containerEl.addEventListener("pointerdown", (e) => this.scene?.onpress?.call(this, e));
  }

  drawHUD() {
    this.hudEl = document.createElement("div");
    this.hudEl.classList.add("hud");

    this.actionsEl = document.createElement("div");
    this.actionsEl.classList.add("actions");

    this.objectsEl = document.createElement("div");
    this.objectsEl.classList.add("objects");

    this.actions.forEach(action => {
      const actionEl = document.createElement("button");
      actionEl.textContent = action.id.replace("-", " ");
      actionEl.dataset.action = action.id;
      actionEl.classList.toggle("selected", action.id === this.action);
      actionEl.addEventListener("click", () => {
        this.action = action.id;
        actionEl.parentElement.querySelector(".selected").classList.remove("selected");
        actionEl.classList.add("selected");
      });
      this.actionsEl.append(actionEl);
    });

    this.hudEl.append(this.actionsEl, this.objectsEl);
    this.containerEl.append(this.hudEl);
    this.drawObjects();
  }

  drawObjects() {
    this.objectsEl.innerHTML = "";
    Object.keys(this.state.objects).forEach(objectId => {
      const obj = this.state.objects[objectId];
      const objectEl = document.createElement("button");
      objectEl.dataset.object = objectId;
      const sprite = this.sprites[obj.sprite];
      const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgEl.innerHTML = sprite.svg;
      svgEl.setAttribute("viewBox", sprite.viewbox || "");
      const spanEl = document.createElement("span");
      spanEl.textContent = objectId;
      objectEl.append(svgEl, spanEl);
      objectEl.classList.toggle("selected", objectId === this.object);
      objectEl.addEventListener("click", () => {
        const useEl = objectEl.parentElement.parentElement.querySelector("[data-action='use']");
        if (this.object !== objectId) {
          this.object = objectId;
          objectEl.parentElement.querySelector(".selected")?.classList.remove("selected");
          objectEl.classList.add("selected");
          if (useEl) {
            useEl.dataset.object = objectId;
          }
        } else {
          this.object = null;
          objectEl.classList.remove("selected");
          if (useEl) {
            delete useEl.dataset.object;
          }
        }
      });
      if (sprite.style) {
        const styleEl = document.createElement("style");
        styleEl.innerHTML = `.objects{[data-object="${objectId}"] {${sprite.style}}}`;
        objectEl.append(styleEl);
      }
      if (obj.props) {
        setElProps(objectEl, obj.props);
      }
      this.objectsEl.append(objectEl);
    });
  }

  drawEntities() {
    if (this.scene.bg) {
      this.containerEl.style.background = this.scene.bg;
    }
    this.scene.entities.forEach(entity => {
      const sprite = this.sprites[entity.sprite];
      const entityEl = document.createElement("div");
      entityEl.dataset.entity = entity.id;
      entityEl.dataset.actions = !!entity.actions;
      entityEl.dataset.onpress = !!entity.onpress;
      if (sprite.svg) {
        const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgEl.innerHTML = sprite.svg;
        svgEl.setAttribute("viewBox", sprite.viewbox || "");
        entityEl.append(svgEl);
      }
      if (sprite.style) {
        const styleEl = document.createElement("style");
        styleEl.innerHTML = `main{[data-entity="${entity.id}"] {${sprite.style}}}`;
        entityEl.append(styleEl);
      }
      if (entity.onpress || entity.actions) {
        entityEl.addEventListener("pointerdown", e => {
          if (this.scene && e.button === 0) {
            e.stopPropagation();
            const pos = getPointerPos(this.containerEl, e);
            const distance = this.scene.actionconf ? dist(this.getEntity(this.scene.actionconf.id)?.props, entity.props) : 0;
            const params = { pos, dist: distance };
            if (entity.actions) {
              const entityAction = entity.actions[this.action];
              // const globalActionConf = this.actions.find(a => a.id === this.action);
              if (!this.scene.actionconf || this.scene.actionconf.ignoredist?.includes(this.action) || distance < this.scene.actionconf.val) {
                this.scene.onactions?.call(this, params)
                // globalActionConf.fn?.call(this, params);
                if (!(entityAction && entityAction.call(this, params) !== this.none)) {
                  this.scene.actionconf?.onnoaction?.call(this, params);
                }
              } else {
                this.scene.actionconf?.onfar?.call(this, params);
              }
            } else if (entity.onpress) {
              e.stopPropagation();
              this.scene.onentitypress?.call(this, params)
              entity.onpress.call(this, params);
            }
          }
        });
      }
      if (this.onTooltip && (entity.actions || entity.onpress)) {
        entityEl.addEventListener("pointerenter", e => {
          clearTimeout(this._ttt);
          const actionEl = this.hudEl.querySelector(".actions .selected");
          const objectEl = this.hudEl.querySelector(".objects .selected");
          if (actionEl) {
            let text = "";
            if(entity.tooltip) {
              text = entity.tooltip.call(this);
            } else if (entity.actions) {
              text = actionEl.dataset.action.replace("-", " ");
              if (text === "use" && objectEl) {
                text += " " + objectEl.dataset.object + " with";
              }
              text += " " + entity.id;
            }

            if (text) {
              this.onTooltip(entity, text);
            } else {
              this.onTooltip();
            }
          }
        });
        entityEl.addEventListener("pointerleave", e => {
          this._ttt = setTimeout(() => {
            this.onTooltip();
          }, matchMedia("(pointer:fine)").matches ? 0 : 1000);
        });
      }
      setElProps(entityEl, entity.props);
      this.containerEl.append(entityEl);
    });
    this.hudEl.dataset.visible = this.scene.hud !== false;
  }

  setScene(id) {
    this.onTooltip();
    if (this.onSceneLeave) {
      this.onSceneLeave();
    }
    this.scene = null;
    this.containerEl.style.pointerEvents = "none";
    this.containerEl.animate([
      { opacity: "1" },
      { opacity: "0" },
    ], {
      duration: 500
    }).addEventListener("finish", () => {
      this.scene = this.scenes.find(s => s.id === id);
      this.containerEl.querySelectorAll("[data-entity]").forEach(e => e.remove());
      this.drawEntities();
      this.containerEl.style.pointerEvents = "";
      this.containerEl.animate([
        { opacity: "0" },
        { opacity: "1" },
      ], {
        duration: 500
      });
      if (this.scene.onenter) {
        this.scene.onenter.call(this);
      }
    });
  }

  getEntity(id) {
    return this.scene?.entities.find(e => e.id === id);
  }

  getEntityEl(id) {
    return this.containerEl.querySelector(`[data-entity="${id}"]`);
  }

  setEntityProps(entityId, props) {
    const entity = this.getEntity(entityId);
    if (entity) {
      const entityEl = this.getEntityEl(entity.id);
      setElProps(entityEl, props);
      entity.props = {
        ...entity.props,
        ...props
      };
    }
  }

  exec(id, ...args) {
    this.functions[id].call(this, ...args);
  }

  collect({ id, sprite, props }) {
    this.state.objects[id] = {
      sprite,
      props
    };
    this.drawObjects();
  }

  destroy(id) {
    const useEl = this.containerEl.querySelector("[data-action='use']");
    if (useEl && useEl.dataset.object === id) {
      delete useEl.dataset.object;
    }
    if (this.object === id) {
      this.object = null;
    }
    delete this.state.objects[id];
    this.drawObjects();
  }

  playSound(s, v) {
    zzfx(...this.sounds[s](v));
  }

  lock(v) {
    this.containerEl.dataset.lock = v;
    document.body.style.cursor = v ? "progress" : "";
  }
}
