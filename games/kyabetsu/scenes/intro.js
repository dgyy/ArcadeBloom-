export const intro = {
  id: "intro",
  hud: false,
  bg: "var(--c3)",
  entities: [
    {
      id: "title",
      sprite: "title",
      props: {
        x: 50,
        y: 32,
        w: 100,
        h: 20
      },
    },
    {
      id: "cs",
      sprite: "cs",
      props: {
        x: 50,
        y: 50,
        w: 100,
        h: 100
      },
      onpress() {
        this.setScene("story");
      }
    },
    {
      id: "c",
      sprite: "c",
      props: {
        x: 50,
        y: 55,
        w: 20,
        h: 26
      }
    }
  ]
};
