import { MySvg } from './MySvg';
import { createUniqueId } from './createUniqueId';
import { Cmd } from './types/Cmd';

// find index of intersection point.
// trace from first intersection
// create a MoveTo command to the first point
// iterate to next intersection
// if we meet the array endpoint before we see the next intersection, start from index 0.
// keep all points in the trace
// when finding next intersection, create a new path from the intersection points closePath command (which is a copy of the intersection point)
// Do the same again, but in the opposite order (or start from the second intersection point)
export function splitSvgInTwo(svgs: MySvg[]) {
  // TODO (johnedvard) Cleanup code

  // part 1 split
  const svg = svgs[0];
  const intersectionIndex = svg.cmds.findIndex((cmd) => cmd.isIntersectionPoint);
  const moveToCmd: Cmd = {
    id: createUniqueId(),
    x: svg.cmds[intersectionIndex].x0,
    y: svg.cmds[intersectionIndex].y0,
    code: 'M',
    command: 'moveto',
  };
  const keep = [moveToCmd];
  keep.push({ ...svg.cmds[intersectionIndex] });
  let i = (intersectionIndex + 1) % svg.cmds.length; // maybe not needed. Can set i = intersectionIndex + 1 instead
  for (i; i < svg.cmds.length; i++) {
    const cmdCpy = { ...svg.cmds[i] };
    if (cmdCpy.isIntersectionPoint) break;
    keep.push(cmdCpy);
  }
  const cmdClosePath: Cmd = {
    id: createUniqueId(),
    x: moveToCmd.x,
    y: moveToCmd.y,
    code: 'Z',
    command: 'closepath',
  };
  keep.push(cmdClosePath);
  svgs[0].setCmds(keep);

  // part 2 split
  const svg2 = svgs[1];
  let intersectionIndex2 = -1;
  for (let i = svg2.cmds.length - 1; i >= 0; i--) {
    if (svg2.cmds[i].isIntersectionPoint) {
      intersectionIndex2 = i;
      break;
    }
  }
  const moveToCmd2: Cmd = {
    id: createUniqueId(),
    x: svg2.cmds[intersectionIndex2].x0,
    y: svg2.cmds[intersectionIndex2].y0,
    code: 'M',
    command: 'moveto',
  };
  const keep2 = [moveToCmd2];
  keep2.push({ ...svg2.cmds[intersectionIndex2] });
  let hasFoundIntersectionPoint = false;
  let i2 = intersectionIndex2;
  while (!hasFoundIntersectionPoint) {
    i2 = (i2 + 1) % svg2.cmds.length; // start from 0 if we pass the length of the array
    const cmdCpy = { ...svg2.cmds[i2] };
    if (cmdCpy.code != 'C') continue; // don't add the existing move to and close path points
    if (cmdCpy.isIntersectionPoint) {
      hasFoundIntersectionPoint = true;
      break;
    }
    keep2.push(cmdCpy);
  }
  const cmdClosePath2: Cmd = {
    id: createUniqueId(),
    x: moveToCmd2.x,
    y: moveToCmd2.y,
    code: 'Z',
    command: 'closepath',
  };
  keep2.push(cmdClosePath2);
  svgs[1].setCmds(keep2);
}
