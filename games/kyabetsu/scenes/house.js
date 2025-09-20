import { common, commonEntities } from "./common.js";

export const house = {
  id: "house",
  bg: "linear-gradient(17deg, transparent 80%, var(--c0) 80%), linear-gradient(-17deg, transparent 80%, var(--c0) 80%), color-mix(in srgb, var(--c7) 60%, var(--c0) 40%)",
  ...common,
  actionconf: { ...common.actionconf, val: 30 },
  entities: [
    ...commonEntities,
    {
      id: "c",
      sprite: "c",
      props: {
        x: 50,
        y: 60,
        w: 6 * 1.5,
        h: 8 * 1.5
      }
    },
    {
      id: "area",
      sprite: "area",
      props: {
        x: 50,
        y: 50,
        w: 40,
        h: 40,
        c: "var(--c7)"
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
        c: "var(--c7)"
      },
      tooltip() {
        return "leave the house";
      },
      onpress({ pos }) {
        this.exec("move", { pos: { y: 70, x: pos.x } });
        this.setScene("farm");
      }
    },
    {
      id: "ladder",
      sprite: "ladder",
      props: {
        x: 71,
        y: 25,
        w: 20,
        h: 20,
        rotate: "13deg"
      },
      actions: {
        "look-at"() {
          this.exec("say", "c", "It's just a ladder");
        },
        "pick-up"() {
          if (!this.state.violet) {
            this.exec("say", "ao", "Don't touch that!");
          } else if (this.state.ladder) {
            this.exec("collect", { id: "ladder", sprite: "ladder", sceneObj: "ladder" });
          } else {
            this.exec("talk", [
              ["ao", "I need it to go on the roof"],
              ["ao", "What do you need it for?"]
            ]);
          }
        },
        use() {
          if (this.object === "torch") {
            this.exec("say", "c", "I am not a pyromaniac");
          } else if (!this.object) {
            if (this.state.violet) {
              this.setScene("roof");
            } else {
              this.exec("say", "ao", "Where are you going!?");
            }
          } else {
            return this.none;
          }
        }
      }
    },
    {
      id: "mirror",
      sprite: "mirror",
      props: {
        x: 39,
        y: 27,
        w: 6,
        h: 6
      },
      actions: {
        "pick-up"() {
          if (!this.state.violet) {
            this.exec("say", "ao", "It's my mirror!");
          } else {
            this.exec("collect", { id: "mirror", sprite: "mirror", sceneObj: "mirror" });
            setTimeout(() => {
              this.exec("say", "ao", "I lend it to you");
            }, 100);
          }
        },
        "look-at"() {
          this.exec("say", "c", "It reflects");
        }
      }
    },
    {
      id: "ao",
      sprite: "ao",
      props: {
        x: 41,
        y: 41,
        w: 10,
        h: 14
      },
      actions: {
        hit() {
          this.exec("say", "c", "This is not nice");
        },
        "talk-to"() {
          if (this.state.moon) {
            this.exec("talk", [
              ["c", "Come with me on the Moon"],
              ["ao", "I am old"],
              ["ao", "My last day is here"],
              ["ao", "With my flowers"],
              ["c", "Can I take the ladder?"],
              ["ao", "Just do it"]
            ]);
            this.state.ladder = 1;
          } else if (this.state.graffiti) {
            this.exec("talk", [
              ["c", "Can you read graffiti?"],
              ["ao", "Do I look like a caveman??"]
            ]);
          } else if (this.state.scroll && this.state.ao) {
            this.exec("talk", [
              ["c", "What day is this?"],
              ["ao", "Today is 12th September 1313"],
              ["ao", "Tomorrow is the last day"]
            ]);
          } else {
            this.exec("talk", [
              ["c", "Hello Sir"],
              ["c", "Can I ask where are we?"],
              ["ao", "In my home!?"],
              ["c", "Sorry I got lost"],
              ["ao", "Get out!"]
            ]);
            this.state.ao = 1;
          }
        },
        "look-at"() {
          this.exec("say", "c", "He looks old and tired");
        },
        use() {
          if (this.object === "violet") {
            this.destroy("violet");
            this.exec("talk", [
              ["ao", "Nice violet, thanks"],
              ["ao", "I'm going to plant it"],
              ["ao", "I love flowers"]
            ]);
            this.state.violet = 1;
            setTimeout(() => {
              this.setEntityProps("ao", {
                y: 55,
                x: 35,
                scale: "-1 1"
              });
              this.setEntityProps("violet", {
                hidden: false
              });
            }, 3000);
          } else if (this.object === "apple") {
            this.exec("say", "ao", "Fruit is good");
          } else if (this.object === "torch" || this.object === "shovel") {
            this.exec("say", "c", "I don't want hurt him");
          } else if (this.object === "duck") {
            this.exec("say", "ao", "Cute");
          } else {
            return this.none;
          }
        }
      }
    },
    {
      id: "scroll",
      sprite: "scroll",
      props: {
        x: 50,
        y: 24,
        w: 10,
        h: 14
      },
      actions: {
        "pick-up"() {
          this.exec("say", "c", "I don't want break that");
        },
        "look-at"() {
          this.exec("say", "c", "It seems very old");
        },
        read({ pos }) {
          this.exec("talk", [
            ["c", "The day 13th September 1313"],
            ["c", "The Sun will explode"],
            ["c", "The sky become red"],
            ["c", "Everything melt"],
            ["c", "The Moon will be launched far away"],
            ["c", "The End is set"],
            ["ao", "That's the profecy!"]
          ]);
          this.state.scroll = 1;
        },
        use() {
          if (this.object === "torch") {
            this.exec("say", "c", "I am not a pyromaniac");
          } else {
            return this.none;
          }
        }
      }
    },
    {
      id: "rose",
      sprite: "flower",
      props: {
        x: 26,
        y: 58,
        w: 6,
        h: 6,
        c: "pink"
      },
      actions: {
        "look-at"() {
          this.exec("say", "c", "It smells good");
        },
        "pick-up"() {
          this.exec("say", "ao", "Don't touch my flowers!");
        },
      }
    },
    {
      id: "violet",
      sprite: "flower",
      props: {
        x: 31,
        y: 58,
        w: 5,
        h: 5,
        c: "var(--c4)",
        hidden: true
      }
    }
  ]
};
