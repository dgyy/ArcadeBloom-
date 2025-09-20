# JS13k 2023

Theme: 13th century

Tower defence: defend a castle. from people the lords have been ripping off. Luckily they are peasants and we have a castle.

(Peasant = anybody earning less than 1M a year)

## Implemented

* Perlin noise - [repository](https://github.com/joeiddon/perlin/blob/master/perlin.js)
* Comanche helicopter game map - voxel space [article](https://github.com/s-macke/VoxelSpace)

Todo

STOP FIDDLING AROUND and start the game logic. It is fun to dabble the algorithms but this is not algorithm jam - its a game jam.


* Camera
  * How grunt is in the field of vision of camera?
    * Project the point of grunt to the vision plane of camera
      1. Line from point to camera
      2. See of it intersects with the plane
      3. What is the visible area on the plane
        * The size of the 2d box is camera.distance (+ 90 degrees -> 45 degrees left and right)
* Units on ground
  * No need to ground collision detection - If no cliffs
  * Move logic
    * No overlapping units
  * Size
  * How to control ? (Dark Omen, Or TD)

* Unit types?
  * meelee <-
  * archer
    * how to draw arrow fly path?
  * catapult

* Castle
  * Attackers hit the walls decreasing their size by one each time
  * Lose when walls breached

## Run

```sh
npm run dev
```

