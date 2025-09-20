import { common, commonEntities } from "./common.js";

export const cave2 = {
  id: "cave2",
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
        return "follow the path";
      },
      onpress({ pos }) {
        this.exec("move", { pos: { y: 70, x: pos.x } });
        this.setScene("cave");
      }
    },
    {
      id: "graffiti",
      sprite: "graffiti",
      props: {
        x: 51,
        y: 15,
        w: 23,
        h: 23
      },
      actions: {
        "look-at"() {
          this.exec("say", "c", "It seems an ancient writing");
        },
        read() {
          this.exec("talk", [
            ["c", "I dont't know this language"],
            ["c", "Maybe someone else knows it"]
          ]);
          this.state.graffiti = 1;
        }
      }
    }
  ]
};
