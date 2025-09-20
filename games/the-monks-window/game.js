let round = 0;

const gameLoop = (ptoken) => {
  round += 1;
  vassals.push(ptoken);
  const size = 5;
  const cSize = 130;
  let baddies = [];

  const base = document.getElementById("b-base");
  const capt = document.getElementById("capt");
  base.classList.remove("winner");
  base.innerHTML = "";
  capt.innerHTML = "";

  let bmoj = [ptoken];

  while (bmoj.indexOf(ptoken) !== -1) {
    bmoj = emojis.sort(() => Math.random() - 0.5).slice(0, 5);
  }

  const Board = () => {
    return [...new Array(size)]
      .map((row) => [...new Array(size)])
      .map((row, i) =>
        div(
          { class: "row" },
          row.map((cell, j) =>
            div({
              id: `cell-${i}-${j}`,
              class: "cell",
            })
          )
        )
      );
  };

  const Baddies = () => {
    return [...new Array(10)].map((bad, i) => () => {
      const row = round % 2 == 0 ? (i % 2) + (size - 2) : i % 2;
      const col = i % 5;
      const baddie = {
        bad: bmoj[i % bmoj.length],
        row,
        col,
        id: "baddie" + baddies.length,
      };
      baddies.push(baddie);

      return div(
        {
          id: baddie.id,
          class: "baddy",
          style: `transform: translate3d(${col * cSize}px,${row * cSize}px,0)`,
          emoji: baddie.bad,
        },
        ...[...new Array(10)].map((a, i) =>
          div(
            {
              class: "zer",
              style: `transform: translateZ(${0.02 * i}em) rotateZ(45deg)`,
            },
            baddie.bad
          )
        )
      );
    });
  };

  const player = div(
    { id: "player", class: "hidden player", emoji: ptoken },
    ...[...new Array(10)].map((a, i) =>
      div(
        {
          class: "zer",
          style: `transform: translateZ(${0.02 * i}em) rotateZ(45deg)`,
        },
        ptoken
      )
    )
  );
  van.add(base, Board(), Baddies(), player);
  const possibles = (row, col) => {
    arr = [];
    for (var i = -1; i <= 1; i += 2) {
      arr.push([row + i, col]);
    }
    for (var j = -1; j <= 1; j += 2) {
      arr.push([row, col + j]);
    }
    return arr.filter(
      (move) => move[0] > -1 && move[0] < size && move[1] > -1 && move[1] < size
    );
  };

  const turn = () => {
    const playerLoc = player.dataset.loc.split(",").map((n) => Number(n));
    const dangerZone = possibles(playerLoc[0], playerLoc[1]);

    // find the closest to the player
    const mover = baddies
      .map((b) => {
        b.dist = Math.sqrt(
          Math.pow(playerLoc[0] - b.row, 2) + Math.pow(playerLoc[1] - b.col, 2)
        );
        return b;
      })
      .sort((a, b) => a.dist - b.dist + Math.random() * 0.3)
      .filter((b) => {
        b.moves = possibles(b.row, b.col).filter((move) => {
          return (
            dangerZone
              .concat([playerLoc])
              .concat(baddies.map((bad) => [bad.row, bad.col]))
              .map((loc) => loc.toString())
              .indexOf(move.toString()) === -1
          );
        });
        return b.moves.length > 0;
      })[0];

    // move into a non capture spot.
    const move = mover.moves.sort((m) => Math.random() - 0.5)[0];
    mover.row = move[0];
    mover.col = move[1];
    document.getElementById(mover.id).style.transform = `translate3d(${
      mover.col * cSize
    }px,${mover.row * cSize}px,0)`;

    // move your token
    let pmoves = possibles(playerLoc[0], playerLoc[1]);
    pmoves = pmoves
      .map((move) => {
        // check if it's a capture
        const bmap = baddies.map((b) => [b.row, b.col]);
        const bad = bmap.filter((b) => b[0] == move[0] && b[1] == move[1])[0];
        if (bad) {
          const dest = [
            bad[0] - playerLoc[0] + bad[0],
            bad[1] - playerLoc[1] + bad[1],
          ];
          const dbad = bmap.filter(
            (b) => b[0] === dest[0] && b[1] == dest[1]
          )[0];
          if (
            !dbad &&
            dest[1] > -1 &&
            dest[1] < size &&
            dest[0] > -1 &&
            dest[0] < size
          ) {
            // row capture
            return {
              col: dest[0],
              row: dest[1],
              cap: true,
              bad,
            };
          }
          return null;
        } else {
          return {
            col: move[0],
            row: move[1],
          };
        }
      })
      .filter((move) => move);

    pmoves
      .map((loc) => document.getElementById(`cell-${loc.col}-${loc.row}`))
      .forEach((cell, index) => {
        cell.classList.add("highlight");
        cell.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const move = pmoves[index];
          const loc = cell.id
            .split("-")
            .slice(1)
            .map((n) => Number(n));
          player.style.transform = `translate3d(${loc[1] * cSize}px,${
            loc[0] * cSize
          }px,0)`;

          player.dataset.loc = loc;
          [...document.getElementsByClassName("highlight")].forEach((c) => {
            c.classList.remove("highlight");
            c.onclick = null;
          });

          // check if the move was a capture
          if (move.cap) {
            const i = baddies.findIndex(
              (bad) => bad.row == move.bad[0] && bad.col === move.bad[1]
            );
            const baddie = document.getElementById(baddies[i].id);
            baddie.classList.add("dead");
            [...baddie.children].forEach((zer) => {
              zer.style.transform = `translate3d(${
                Math.random() * 800 - 400
              }px, ${Math.random() * 800 - 400}px, ${
                Math.random() * 200
              }px) rotateX(${Math.random() * 2000 - 1000}deg) rotateY(${
                Math.random() * 2000 - 1000
              }deg) scale(0.5)`;
              zer.style.filter = "contrast(0) brightness(10)";
              zer.style.opacity = "0";
            });
            setTimeout(() => {
              baddie.classList.add("hidden");
              baddie.parentElement.removeChild(baddie);
              baddies.splice(i, 1);
            }, 500);

            zzfx(...trumpet);
            captured.push(baddie.getAttribute("emoji"));
            capt.innerText += baddie.getAttribute("emoji");
          } else {
            zzfx(...drum);
          }

          // check if winning
          if (captured.length < 3) {
            setTimeout(turn, 600);
          } else {
            document.getElementById("panes").innerHTML = captured.join(" ");
            zzfx(...drum);

            setTimeout(() => {
              base.classList.add("winner");
              zzfx(...drum);
              zzfx(
                ...[
                  0.7,
                  0,
                  662,
                  0.17,
                  1.2,
                  0.2,
                  ,
                  ,
                  0.25,
                  ,
                  420,
                  0.5,
                  0.25,
                  ,
                  ,
                  ,
                  0.03,
                  0.86,
                  0.1,
                  1,
                ]
              );

              [...document.getElementsByClassName("baddy")]
                .concat([...document.getElementsByClassName("cell")])
                .forEach((c) => (c.style.transform = "rotate(45deg) scale(0)"));

              setTimeout(() => {
                zzfx(...drum);
              }, 500);
            }, 500);
            setTimeout(() => {
              setTimeout(() => {
                base.classList.remove("winner");
              }, 5000);
              nextSlide("window");
            }, 2100);
          }
        };
      });
  };

  // place your token
  const starts = [...document.getElementsByClassName("cell")].filter((cell) =>
    round % 2 == 0
      ? Number(cell.id.split("-")[1]) < 3
      : Number(cell.id.split("-")[1]) > 1
  );

  starts.forEach((cell) => {
    const loc = cell.id
      .split("-")
      .slice(1)
      .map((n) => Number(n));
    cell.classList.add("highlight");
    cell.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      player.classList.remove("hidden");
      player.style.transform = `translate3d(${loc[1] * cSize}px,${
        loc[0] * cSize
      }px,0)`;

      player.dataset.loc = loc;
      starts.forEach((c) => {
        c.classList.remove("highlight");
        c.onclick = null;
      });
      setTimeout(turn, 300);
    };
  });
};
