import { Cmd } from './types/Cmd';
import { CmdCode } from './types/CmdCode';
import { createUniqueId } from './createUniqueId';

export function parseSvg(path: string): Cmd[] {
  const cmds: Cmd[] = [];
  for (let i = 0; i < path.length; i++) {
    let cmd: Cmd;

    if (path[i] == 'M') {
      cmd = createCmd(path.substring(i + 1, path.length), 'M');
    } else if (path[i] == 'C') {
      cmd = createCmd(path.substring(i + 1, path.length), 'C');
    } else if (path[i] == 'Z') {
      cmd = createCmd(path.substring(i, path.length), 'Z');
    } else {
      continue;
    }
    cmds.push(cmd);
  }
  return cmds;
}

function createCmd(path: string, code: CmdCode): Cmd {
  const commandSegmentMatch = path.match(/^(.*?)[a-zA-Z]/);
  if (!commandSegmentMatch || commandSegmentMatch.length < 2) return;
  const commandTxt = commandSegmentMatch[1]; // the second match does not include the letter

  const coordinates = getCoordinates(commandTxt, code);
  const cmd: Cmd = {
    id: createUniqueId(),
    code,
    command: getCommand(code),
    ...coordinates,
  };
  return cmd;
}

function getCommand(code: CmdCode) {
  switch (code) {
    case 'M':
      return 'moveto';
    case 'C':
      return 'curveto';
    case 'Z':
      return 'closepath';
  }
}

function getCoordinates(commandTxt: string, code: CmdCode) {
  const points = { x: NaN, y: NaN, x1: NaN, y1: NaN, x2: NaN, y2: NaN };

  const coords = commandTxt.split(' ');
  switch (code) {
    case 'M':
      points.x = parseFloat(coords[0].split(',')[0]);
      points.y = parseFloat(coords[0].split(',')[1]);
      break;
    case 'C':
      points.x = parseFloat(coords[2].split(',')[0]);
      points.y = parseFloat(coords[2].split(',')[1]);
      points.x2 = parseFloat(coords[1].split(',')[0]);
      points.y2 = parseFloat(coords[1].split(',')[1]);
      points.x1 = parseFloat(coords[0].split(',')[0]);
      points.y1 = parseFloat(coords[0].split(',')[1]);
      break;
    case 'Z':
  }

  return points;
}
