import { common, commonEntities } from "./common.js";

export const hole2 = {
  id: "hole2",
  bg: "var(--c0)",
  ...common,
  entities: [
    ...commonEntities,
    {
      id: "c",
      sprite: "c",
      props: {
        x: 26,
        y: 45,
        w: 6*3,
        h: 8*3
      }
    },
    {
      id: "area",
      sprite: "area",
      props: {
        x: 50,
        y: 53,
        w: 50,
        h: 15,
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
        x: 23,
        y: 53,
        w: 6,
        h: 8,
        c: "var(--c0)",
      },
      tooltip() {
        return "follow the path";
      },
      onpress({ pos }) {
        this.exec("move", { pos: { y: pos.y, x: 26 } });
        this.setScene("hole");
      }
    },
    {
      id: "torch",
      sprite: "torch",
      props: {
        x: 68,
        y: 52,
        w: 12,
        h: 12
      },
      actions: {
        "look-at"() {
          this.exec("say", "c", "It makes light");
        },
        "pick-up"() {
          this.exec("collect", { id: "torch", sprite: "torch", sceneObj: "torch" });
          this.state.torch = 1;
        }
      }
    }
  ]
};
