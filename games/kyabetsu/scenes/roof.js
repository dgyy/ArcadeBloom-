import { common, commonEntities } from "./common.js";

export const roof = {
  id: "roof",
  bg: "linear-gradient(17deg, transparent 70%, var(--c0) 70%), linear-gradient(-17deg, transparent 60%, var(--c0) 60%), color-mix(in srgb, var(--c7) 60%, var(--c0) 40%)",
  ...common,
  entities: [
    ...commonEntities,
    {
      id: "c",
      sprite: "c",
      props: {
        x: 58,
        y: 58,
        w: 6 * 2,
        h: 8 * 2
      }
    },
    {
      id: "area",
      sprite: "area",
      props: {
        x: 60,
        y: 64,
        w: 50,
        h: 15,
        c: "var(--c7)",
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
        x: 60,
        y: 72,
        w: 10,
        h: 8,
        c: "var(--c7)"
      },
      tooltip() {
        return "return on first floor";
      },
      onpress({ pos }) {
        this.exec("move", { pos: { y: 70, x: pos.x } });
        this.setScene("house");
      }
    },
    {
      id: "shovel",
      sprite: "shovel",
      props: {
        x: 75,
        y: 55,
        w: 10,
        h: 10
      },
      actions: {
        "pick-up"() {
          this.exec("collect", { id: "shovel", sprite: "shovel", sceneObj: "shovel" });
        }
      }
    }
  ]
};
