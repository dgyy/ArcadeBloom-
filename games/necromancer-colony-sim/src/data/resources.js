import { resource, action, building } from './state.js';
import {
  visible as actionVisible,
  digStone,
  stealCorpse,
  reanimateSkeleton,
  reanimateMilitia,
  reanimateInfantry,
  reanimateArchers,
  reanimateCavalry
} from './actions.js';
import {
  built,
  rituralCircle,
  lumberMill,
  laboratory,
  quarry,
  masonsWorkshop,
  burnersCamp,
  mine,
  furnace,
  smithy,
  weaponsWorkshop,
  armorersWorkshop,
  bowyersWorkshop
} from './buildings.js';

// indices
export const name = 0;
export const icon = 1;
export const max = 2;
export const prereq = 3;
export const visible = 4;
export const amount = 5;
export const change = 6;

export const wood = 0;
export const stone = 1;
export const corpses = 2;
export const mana = 3;
export const skeletons = 4;
export const planks = 5;
export const research = 6;
export const blocks = 7;
export const charcoal = 8;
export const ironOre = 9;
export const iron = 10;
export const tools = 11;
export const weapons = 12;
export const armor = 13;
export const bows = 14;
export const militia = 15;
export const infantry = 16;
export const archers = 17;
export const cavalry = 18;

let resources = [];
export default resources;

export function initResources() {
  resources.push(
    // 0
    [
      'Wood',
      '🪵',
      100,
      ,
      true
    ],

    // 1
    [
      'Stone',
      '🪨',
      100,
      [
        [action, digStone, actionVisible, true]
      ]
    ],

    // 2
    [
      'Corpses',
      '⚰️',
      2,
      [
        [action, stealCorpse, actionVisible, true]
      ]
    ],

    // 3
    [
      'Mana',
      '✨',
      25,
      [
        [action, reanimateSkeleton, actionVisible, true]
      ],
      false,
      5
    ],

    // 4
    [
      'skeletons',
      'Skeletons',
      0,
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 5
    [
      'Planks',
      '<img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAA1VBMVEUAAABfRC9mSTN6WD53VjxvUThMNyZnSzVGMyN4VjxhRjFQOiddQy5NNyZNNyVQOShpTDVINSRZQCxGMyNkSTRbQS11VDpqTjZxUjiBXUFUPClUPClZQCxsTzZfRDBMNyVzUzloTDZxUjl5Vz6DX0FYPytwUThGMyNlSTRKNiV1VDpqTjZ7WT55Vz6LZUZxUjhmSjVdQy92VTuDYENhRzJfRDFbQS1pTTZnSzVXPipjSDNdQy9ZQCxlSTRSOihzUzlwUThrTzZOOCZVPCluUDdMNiVINSQdqybDAAAANHRSTlMABhgQ/vvz4NfWv6x9Y0o0KyIL+vn59vLo5ubl187GwLesqZ6WlpKQhXh0aGRZUE1COTYjpoa/KQAAAMhJREFUGNNdkFcWgjAQRVHsghR7770rPZEu+1+SCXgYdP5yz7vJmzCZydVqnJBjfmenqBoe1Hkpw24tBWmm7UcVYPmypSJs2u9mA+D8RWwz8KMtsKNOIQlW5JSJXcNSEA78kpAyeawbFg36e5A3HrERuXEKPa/Fb7AkQZteSIK0Dw/rzVyPBnFQB/nguEmfYT5ljw4NEhvDKmzVCfXYXkObpeN6sT1iU3YuEGiQt9t3CPYLiY04Boa9rKpFQ1En/1/+PC3KYub8AcxzI3LKXt/zAAAAAElFTkSuQmCC"/>',
      25,
      [
        [building, lumberMill, built, 1]
      ]
    ],

    // 6
    [
      'Research',
      '📜',
      ,  // no limit
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 7
    [
      'Blocks',
      '<img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABC1BMVEUAAABQUFBVVVVaWlpfX19ycnJLS0t3d3dCQkJoaGhtbW09PT1HR0dkZGR8fHxOTk5kZGR8fHw4ODhubm5HR0dVVVVnZ2dhYWF6enpjY2NXV1dbW1s4ODhHR0dCQkJHR0c9PT1oaGg2NjZHR0dtbW1ubm4/Pz9/f388PDxlZWU6Ojo9PT1MTEw9PT1CQkJjY2M0NDRtbW1fX193d3dfX19DQ0OAgIA+Pj5ycnJjY2N8fHxMTExsbGx3d3djY2OAgIBpaWlxcXFnZ2c0NDR7e3t7e3s5OTlISEhaWlpzc3M4ODgzMzNLS0tHR0d7e3tkZGQ1NTVwcHBNTU1kZGRERERISEg1NTVubm5ERETvjnbTAAAAWXRSTlMA4NvX0r/luu7IxPPqzbUtKRz4JGJYU0MvLQ4H8ebk2NewqaNsY1FGQDYK69XOycXCt7a0s7Kxr6ynpqGgnZ2VkIqFgn57e3Z1cm1kW1NOSkVAQD8nJR4YE1wr3S4AAADRSURBVBjTfckFc8JAEAXgV0tLuDQhLlCKS93dBXf9/7+EC3dkwjDwzey83bfYKIYV9se9XSgsPWK/h8zzX5s/vNzNfsibX/ce98Jq9pcG18leidyrNtGyoqhBiXyXzFRkLvWZM2koUCRJerccSxmYndKTdEFPWu4uXFssbz04OwGDRRWQtwMGTxnyVsDgSUuBeum7+qnQFBhaEkKSCZLU3Uork0kQaoTp0QFznofu73dDAMWHk+hZ1HfsTx5csZyOq6paV+P/ZYR43Z/LRnqM9WYTABfQPE+RQQAAAABJRU5ErkJggg=="/>',
      25,
      [
        [building, masonsWorkshop, built, 1]
      ]
    ],

    // 8
    [
      'Charcoal',
      '<img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAY1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmaHTeAAAAIHRSTlMA+w4Hr4nw7MJ4ajs19tDHloJTSi4eF+Xh1bSfcGFXREQlbggAAAB+SURBVBjTtY9HDoMwEEXHuJdQA+nJv/8pI9sgjFgi3mI0eppKZ/Lje9fhIcVro4YnIqwqnMNMN4RxkT1Wbnn2JFDikgzYcE+l18JcgCZt84DRAET7sQxQbyIuGaCtrIHW5sMC0dfEhOVuHaNJQ/1Ik1RQjee9qF3xQjXnx/kDVJoPEo9nyBsAAAAASUVORK5CYII="/>',
      50,
      [
        [building, burnersCamp, built, 1]
      ]
    ],

    // 9
    [
      'Iron ore',
      '<img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABO1BMVEUAAABVcGhJZl1rhX4zUEd0jodGYlo6V052kIljf3ZyjYVXc2tXcmpceG9yjIV9l5B1j4heenJ5k4xSbmZ8lY6Ko5xlgHiOp6BXc2tAXVRVcWh/mJE2U0p8lo92kIlYc2tshn82U0p3kYlLZ19/mZF0jodQbGMqSD9OamEmRDp7lY5mgXk5Vk1jfnZYdGuLo5xkfndzjYaKo5wrSD9HZFs+W1I2U0qOp6BRbWVge3NGYlqSqqRkf3eDnJVwioJVcGguTEJIZFuFnpd5kotfenJbdm5/mZE2U0pbdm6Npp9rhX5uiIBEYFdbd298lo99lo9ZdWxfenJDX1YiQDdOamGJoptjfXVqhX1SbmU/W1JOamJ7lI1wioJuiIFog3phfHRJZV1FYVhDX1c5V01mgXlkf3dMaF9/mZJceG/+v/fDAAAAV3RSTlMA/u9jKP779vDr3aeYgnl2YV9VPisTB/37+vj06efm4NTT0tHQ0NDOzc3JwsLBvr23srGrpaGcmJSSioaGhYBxcGxraGhoZFxaV1VQSklIOTk4LS0dGg9l5XaaAAAAzUlEQVQY02MgB5hbo4uI+IkaiYuiCapGS9vqe6KKMcewRqc7haIKaofHcGipIIuI2XMLpoTHCPC7IQkqRzAGcKaE28lF8yMETdIiuHnjOb34lITE4II+bGkWPBnxcQp8HLIicNEgx5AICV7duFguZ3+4oGmSlUYET6ANMzOXAFxQJzKJKSpC3tcgLpZVCCbIwh6ZlBDFqGeZGh5rCFfqnhyZCBT1iE8N94YLspiBRYVdXcIQLlV3UASKMqlJCSLEgjWNWWTYJdmYhPEENwD8bCNnidwV9QAAAABJRU5ErkJggg=="/>',
      50,
      [
        [building, mine, built, 1]
      ]
    ],

    // 10
    [
      'Iron',
      '<img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABXFBMVEUAAABQbWR4k4tbdm5CX1YsSUBTb2cyUEdifXVuiIFYc2uFn5c4VUw5Vk0sSkE/XFMoRjx0joY8WVBwi4OOp6CTq6QtSkErSD5NaWGUraZshn8sSkGLpJ2Wr6gpRz5jfnZGYlmRqqM5Vk0nRTuDnJVqhH17lI1HY1uOp6BJZVx0jodRbWR9lo9BXlVTb2ZGYlllgHg5Vk2Sq6RzjoYqRz5CX1Y/XFNifXUvTUOVraZyjYVIZFsxTkUsSUCXr6g1UkmZsauKo5w+W1KEnpaMpZ5deHBNaWB+l5A/XFOXsKklQzmRqqNbdm50joc3VEtqhHxYc2the3RSbmUuS0IqRz6Bm5N8l49qhXxdeHCRqqONpp9vioJLZ1+HoJmFnpd2kYp0j4dyjIVmgXlkgHdge3NXc2pWcWlSbmZPamJHY1s7WE8xTkWVrqeKo5yIoZp6k4xth4BjfXVhfHREYFeC0x4tAAAAVXRSTlMANP7+5cvHw7mvmZKSinFoZDYrIBUMCAT38e/r5+Xi39/V1dLOzcrHxMC/u7qzsrGtp6SkoaCZl5aRj42LhXpnZWVhX1lQUEdHREI+PTk4Ly4pHA8Oo3Yj3wAAANhJREFUGNNjoB5wUbQUQRNyV4mNipS0E0USEtRiCguNy42KlHWACQUahEcnxgNF86IiczzBQkFcESnJ4QWJCflhobEy3kYgMWuJ9DTmiMKk8OgEoBHODBpAYz1YMmMy0lIjipLDOa3i1RgYuB0ZGAyFdBViMtJTmTnkhaWifQV1uEUYgtl5ePmLM2O0GblczZNUOY2FgSYKSNvYZ2WZ6jMw6gVEpHD4g632UjbJzuYVMmPQZGRj84G5UVxAjlXcj4efRd0N2YNifKwW7EpO6EERYssnRr2ABQASwSfinWYMXwAAAABJRU5ErkJggg=="/>',
      25,
      [
        [building, furnace, built, 1]
      ]
    ],

     // 11
    [
      'Tools',
      '🔨',
      20,
      [
        [building, smithy, built, 1]
      ]
    ],

    // 12
    [
      'Weapons',
      '⚔️',
      10,
      [
        [building, weaponsWorkshop, built, 1]
      ]
    ],

    // 13
    [
      'Armor',
      '🛡️',
      10,
      [
        [building, armorersWorkshop, built, 1]
      ]
    ],

    // 14
    [
      'Bows',
      '🏹',
      10,
      [
        [building, bowyersWorkshop, built, 1]
      ]
    ],

    // 15
    [
      'Militia',
      '💀',
      ,  // no limit
      [
        [action, reanimateMilitia, actionVisible, true]
      ]
    ],

    // 16
    [
      'Infantry',
      '🎚️',
      ,  // no limit
      [
        [action, reanimateInfantry, actionVisible, true]
      ]
    ],

    // 17
    [
      'Archers',
      '𓀎',
      ,  // no limit
      [
        [action, reanimateArchers, actionVisible, true]
      ]
    ],

    // 18
    [
      'Cavalry',
      '🐴',
      ,  // no limit
      [
        [action, reanimateCavalry, actionVisible, true]
      ]
    ]
  );
}