export const story = {
  id: "story",
  hud: false,
  bg: "var(--c3)",
  entities: [
    {
      id: "story",
      sprite: "story",
      props: {
        x: 50,
        y: 50,
        w: 100,
        h: 100
      },
      onpress() {
        this.setScene("mountains");
      }
    },
  ]
};
