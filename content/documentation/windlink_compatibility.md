---
title: Windlink Compatibility
---
Supplemental Patches has compatibility with the Windlink mod which can currently be downloaded from [here](https://github.com/plunderpixels/plunderengine/tree/main/). The mod provides a terrain-aware wind simulation which is used to provide deformations to various blocks such as leaves, vines and lanterns.

To compatibility to a block or block entity, you will need to define the `windlink` attribute within the JSON files for those blocks. There are 2 options here. You may apply one of the predefined options listed in the table below or you may create a custom waving function.

| Waving Function                            | Use Case                                                           |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `minecraft:grounded_waving_foliage_lower`  | For short 1-block high grasses or the lower half of tall grasses.  |
| `minecraft:grounded_waving_foliage_higher` | For the upper half of tall grasses.                                |
| `minecraft:grounded_waving_foliage`        | For tall grasses, can be applied to both the lower and upper half. |
| `minecraft:waving_ceiling_vine`            | For vines that grow from the ceiling (e.g. glow berries).          |
| `minecraft:waving_wall_vine`               | For vines that grow on walls (e.g. regular vines).                 |
| `minecraft:waving_ground_vine`             | For vines that grow up from the ground (e.g. twisting vines).      |
| `minecraft:waving_leaves`                  | For waving leaves.                                                 |
| `minecraft:waving_lilypad`                 | For lilypads and plants on the water surface.                      |
| `minecraft:waving_stalk`                   | For tall plants with thick stalks (e.g. bamboo or sugarcane).      |
| `minecraft:waving_pendant`                 | For chains and lanterns.                                           |
| `minecraft:waving_campfire`                | For campfires (makes the fire within the campfire wave).           |
| `minecraft:waving_fire`                    | For waving fire.                                                   |
