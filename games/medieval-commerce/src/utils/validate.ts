export function invariant (condition: unknown, message?: string) {
  if (!condition) {
    throw new Error(message ?? 'Invariant violation')
  }
}

export function nullthrows <T> (value?: T | null | void, message?: string): T {
  if (value == null) {
    throw new Error(message ?? 'Got unexpected null')
  }

  return value
}
