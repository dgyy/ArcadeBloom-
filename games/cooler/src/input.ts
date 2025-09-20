export type MyInput = (key: string) => boolean

function my_input(): MyInput {

  let keys: Set<string> = new Set()

  const on_down = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
    }
    keys.add(e.key)
  }

  const on_up = (key: string) => {
    keys.delete(key)
  }

  document.addEventListener('keydown', e => on_down(e))
  document.addEventListener('keyup', e => on_up(e.key))


  return (key: string) => {
    return [...keys].includes(key)
  }
}

export default my_input()