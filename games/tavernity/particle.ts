import { Actor, createActor } from './actor';
import { createAnimationFromDb } from './db';
import { drawSprite } from './draw';
import { Timer } from './utils';

export interface Particle extends Actor {}

export const createParticle = (
  animName: string,
  durationMs: number,
  x: number,
  y: number
) => {
  const anim = createAnimationFromDb(animName);
  const timer = new Timer(durationMs);

  timer.start();
  anim.start();

  const actor = createActor();
  const cl: Particle = {
    ...actor,
    x,
    y,
    update() {
      actor.update();
      if (timer.isDone()) {
        cl.remv = true;
      }
    },
    draw() {
      anim.update();
      drawSprite(anim.getSprite(), cl.x * 16, cl.y * 16);
    },
  };

  return cl;
};
