// copied from svg-path-parser, but added nullpointer check
export function makeSvgPathCommandsAbsolute(commands) {
  var subpathStart,
    prevCmd = { x: 0, y: 0 };
  var attr = { x: 'x0', y: 'y0', x1: 'x0', y1: 'y0', x2: 'x0', y2: 'y0' };
  commands.forEach(function (cmd) {
    if (cmd.command === 'moveto') subpathStart = cmd;
    cmd.x0 = prevCmd.x;
    cmd.y0 = prevCmd.y;
    for (var a in attr) if (a in cmd) cmd[a] += cmd.relative ? cmd[attr[a]] : 0;
    if (!('x' in cmd)) cmd.x = prevCmd.x; // V
    if (!('y' in cmd)) cmd.y = prevCmd.y; // X
    cmd.relative = false;
    cmd.code = cmd.code.toUpperCase();
    if (cmd.command == 'closepath' && subpathStart) {
      // added nullpointer check
      cmd.x = subpathStart.x;
      cmd.y = subpathStart.y;
    }
    prevCmd = cmd;
  });
  return commands;
}
