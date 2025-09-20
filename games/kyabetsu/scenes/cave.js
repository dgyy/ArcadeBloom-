import { common, commonEntities } from "./common.js";

export const cave = {
  id: "cave",
  bg: "var(--c0)",
  ...common,
  entities: [
    ...commonEntities,
    {
      id: "c",
      sprite: "c",
      props: {
        x: 49,
        y: 65,
        w: 6 * 2,
        h: 8 * 2
      }
    },
    {
      id: "area",
      sprite: "area",
      props: {
        x: 50,
        y: 48,
        w: 20,
        h: 43,
        c: "var(--c0)",
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
        x: 50,
        y: 72,
        w: 10,
        h: 8,
        c: "var(--c0)",
      },
      tooltip() {
        return "exit the cave";
      },
      onpress({ pos }) {
        this.exec("move", { pos: { y: 67, x: pos.x } });
        this.setScene("mountains");
      }
    },
    {
      id: "exit2",
      sprite: "area",
      props: {
        x: 50,
        y: 24,
        w: 10,
        h: 8,
        c: "var(--c0)",
      },
      tooltip() {
        return "follow the path";
      },
      onpress({ pos }) {
        if (this.state.rock >= 20) {
          this.exec("move", { pos: { y: 26, x: pos.x } });
          this.setScene("cave2");
        }
      }
    },
    {
      id: "rock",
      sprite: "rock",
      props: {
        x: 50,
        y: 24,
        w: 12,
        h: 13,
      },
      actions: {
        "look-at"() {
          this.exec("say", "c", "It blocks the path");
        },
        hit() {
          this.exec("arm");
          this.playSound("hit");
        },
        use() {
          if (this.object === "shovel") {
            this.state.rock = (this.state.rock || 0) + 1;
            this.exec("arm");
            this.playSound("hit");
            this.setEntityProps("rock", {
              x: 50 + this.state.rock / 10,
              rotate: this.state.rock + "deg"
            });
            if (this.state.rock >= 20) {
              this.setEntityProps("rock", {
                x: 60,
                rotate: "45deg"
              });
            }
          } else {
            return this.none;
          }
        }
      }
    }
  ]
};
