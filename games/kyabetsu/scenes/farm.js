import { common, commonEntities } from "./common.js";

export const farm = {
  id: "farm",
  bg: "linear-gradient(0deg, var(--c6) 68%, var(--c3) 68%)",
  ...common,
  entities: [
    ...commonEntities,
    {
      id: "c",
      sprite: "c",
      props: {
        x: 88,
        y: 51,
        w: 6,
        h: 8,
        scale: "-1 1"
      }
    },
    {
      id: "area",
      sprite: "area",
      props: {
        x: 50,
        y: 58,
        w: 90,
        h: 20,
        c: "var(--c6)"
      },
      onpress(...args) {
        this.exec("look", ...args);
        this.exec("move", ...args);
      }
    },
    {
      id: "exit1",
      sprite: "area",
      props: {
        x: 97,
        y: 55,
        w: 6,
        h: 8,
        c: "var(--c6)"
      },
      tooltip() {
        return "follow the path";
      },
      onpress({ pos }) {
        this.exec("move", { pos: { y: pos.y, x: 95 } });
        this.setScene("mountains");
      }
    },
    {
      id: "tree",
      sprite: "tree",
      props: {
        x: 20,
        y: 38,
        w: 18,
        h: 24,
        clip: "polygon(34% 1%, 64% 1%, 98% 75%, 76% 97%, 30% 98%, 3% 75%)"
      },
      actions: {
        hit() {
          this.playSound("hit");
          if (!this.state.tree) {
            this.setEntityProps("tree", {
              rotate: "-2deg"
            });
            this.state.tree = 1;
            this.setEntityProps("apple", {
              y: 50,
              clip: ""
            });
            this.exec("arm");
          }
        },
        use() {
          if (this.object === "torch") {
            this.exec("say", "c", "I am not a pyromaniac");
          } else if (this.object === "shovel") {
            this.exec("say", "c", "It's too hard work for me");
          } else {
            return this.none;
          }
        }
      }
    },
    {
      id: "apple",
      sprite: "apple",
      props: {
        x: 21,
        y: 34,
        w: 4,
        h: 4,
        clip: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 50%)"
      },
      actions: {
        "look-at"() {
          this.exec("say", "c", "It looks yummy");
        },
        "pick-up"() {
          if (this.state.tree) {
            this.exec("collect", { id: "apple", sprite: "apple", sceneObj: "apple" });
          } else {
            this.exec("say", "c", "I can't reach it");
          }
        }
      }
    },
    {
      id: "house",
      sprite: "house",
      props: {
        x: 72,
        y: 35,
        w: 30,
        h: 30
      }
    },
    {
      id: "door",
      sprite: "area",
      props: {
        x: 68.7,
        y: 42.8,
        w: 5.3,
        h: 9.7,
        c: "var(--c7)"
      },
      tooltip() {
        return "enter the house";
      },
      onpress({ pos }) {
        this.exec("move", { pos: { x: pos.x, y: this.getEntity("door").props.y + 5 } });
        this.setScene("house");
      }
    },
    {
      id: "cloud",
      sprite: "cloud",
      props: {
        x: 23,
        y: 13,
        w: 19,
        h: 19
      }
    },
    {
      id: "cloud2",
      sprite: "cloud",
      props: {
        x: 73,
        y: 9,
        w: 15,
        h: 15
      }
    },
    {
      id: "bush",
      sprite: "cloud",
      props: {
        x: 44,
        y: 44,
        w: 15,
        h: 15,
        c: "color-mix(in srgb, var(--c6) 80%, var(--c0) 20%)"
      }
    },
    {
      id: "bush2",
      sprite: "cloud",
      props: {
        x: 64,
        y: 74,
        w: 15,
        h: 15,
        c: "color-mix(in srgb, var(--c6) 80%, var(--c0) 20%)"
      }
    },
    {
      id: "bush3",
      sprite: "cloud",
      props: {
        x: 24,
        y: 80,
        w: 20,
        h: 20,
        c: "color-mix(in srgb, var(--c6) 80%, var(--c0) 20%)"
      }
    },
    {
      id: "swan",
      sprite: "duck",
      props: {
        x: 37,
        y: 56,
        w: 4,
        h: 4,
        c: "var(--c1)"
      },
      actions: {
        hit() {
          this.exec("say", "c", "I won't hurt her");
        },
        "look-at"() {
          this.exec("say", "c", "She can fly");
        },
        "pick-up"() {
          this.state.swan = (this.state.swan || 0) + 1;
          this.playSound("duck");
          this.exec("arm");
          const x = this.getEntity("swan").props.x;
          const p = [
            {
              x: 79,
              y: 36
            },
            {
              x: 18,
              y: 41,
            },
            {
              x: 25,
              y: 73,
            }
          ][(this.state.swan - 1) % 3];
          this.setEntityProps("swan", {
            ...p,
            scale: x < p.x ? 1 : "-1 1"
          });
        }
      }
    },
  ]
};
