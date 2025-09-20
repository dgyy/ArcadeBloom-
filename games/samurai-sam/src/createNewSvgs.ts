import { vec2 } from './littlejs';

import { splitCubicCurve } from './splitCubicCurve';
import { Cmd } from './types/Cmd';
import { IntersectionPoint } from './types/IntersectionPoint';
import { MySvg } from './MySvg';
import { translateCoordinates } from './translateCoordinates';

export function createNewSvgs(svg: MySvg, p: IntersectionPoint): MySvg[] {
  if (!svg || !p) return [];
  const newSvg1 = new MySvg(
    null,
    svg.cmds,
    null,
    'orange',
    svg.pos.copy().add(vec2(0, 0)),
    svg.velocity.copy(),
    svg.size.copy(),
    svg.getGravityScale()
  );
  newSvg1.setGravityScale(5);
  newSvg1.velocity.x = -1;
  const newSvg2 = new MySvg(
    null,
    svg.cmds,
    null,
    'gray',
    svg.pos.copy().add(vec2(0, 0), svg.velocity.copy(), svg.size.copy(), svg.getGravityScale())
  );
  newSvg2.setGravityScale(10);
  newSvg2.velocity.x = 1;
  let cmdIndex = -1;
  const cmd: Cmd = svg.cmds.find((cmd, index) => {
    cmdIndex = index;
    return cmd.id == p.id;
  });
  if (!cmd) return;
  if (cmd.code == 'C') {
    const newCurves1 = splitCubicCurve(cmd, p.intersectionPoint);
    newCurves1[1].isIntersectionPoint = true;
    const newCurves2 = splitCubicCurve(cmd, p.intersectionPoint);
    newCurves2[1].isIntersectionPoint = true;
    translateCoordinates(newCurves1, svg.pos.copy().multiply(vec2(-1, -1))); // translate the coordinates back to origin.
    translateCoordinates(newCurves2, svg.pos.copy().multiply(vec2(-1, -1))); // translate the coordinates back to origin.
    newSvg1.addCmds(cmdIndex, 1, newCurves1);
    newSvg2.addCmds(cmdIndex, 1, newCurves2);
  }

  return [newSvg1, newSvg2];
}
