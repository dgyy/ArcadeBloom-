export const end = {
  id: "end",
  hud: false,
  bg: "transparent",
  entities: [
    {
      id: "end",
      sprite: "end",
      props: {
        x: 50,
        y: 50,
        w: 100,
        h: 100
      },
      onpress() {
        location.reload();
      }
    }
  ]
};
