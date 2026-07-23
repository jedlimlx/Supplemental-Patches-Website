---
title: Reflection Handlers
---
With the introduction of world-space reflections in Complementary Shaders 5.6, there is a need to introduce reflection handlers to handle how specific blocks are displayed within the reflection. By default, all non-solid blocks (i.e. odd-numbered `mat`) are not rendered. Those that we want to render, such as stairs, slabs, walls, carpets, etc. need reflection handlers. Furthermore, non-cube blocks like fire, campfires, glow lichen, etc. also need reflection handlers or they will not be displayed correctly in the reflection.

The reflection handlers available are shown below.

| Handler                 | When to Use                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `minecraft:discard`     | Anything that should not be shown in the reflection                                                           |
| `minecraft:half_blocks` | Half-blocks that should still be shown in the reflection<br>(e.g. stairs, slabs, walls)                       |
| `minecraft:non_solid`   | Non-solid cube blocks (i.e. odd-numbered `mat`) that should still be shown in the reflection<br>(e.g. leaves) |
| `minecraft:fire`        | Fires or similar cross-model blocks                                                                           |
| `minecraft:campfire`    | Campfires, braziers, etc.                                                                                     |
| `minecraft:carpet`      | Carpets and other flat blocks                                                                                 |
| `minecraft:glow_lichen` | Glow lichen or other similar blocks                                                                           |

