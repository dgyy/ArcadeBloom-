import { createUniqueId } from './createUniqueId';
import { Cmd } from './types/Cmd';

export function assignIdsToCmds(cmds: Cmd[]) {
  cmds.forEach((cmd) => {
    if (!cmd.id) cmd.id = createUniqueId();
  });
}
