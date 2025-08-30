---
title: Colours & Tints
---

In order to add new colors and tints for Advanced Colored Lighting (ACL), `.json` files can be added under folders named `colors` and `tints`.

The code will be injected into `/shaders/lib/colors/blocklightColors.glsl`.

## JSON Format

There is only one field that needs to be filled in, which is the `code` field. It contains a single line of GLSL code that outputs a `vec4` (or a `vec3` for tints).

The first 3 components are the RGB components of the color and the last component is the amount of additional light that the block should emit (in addition to normal Minecraft blocklight). The last component should not be too large, at most about `0.2`.

> [!info] Take Note
> 
> When defining your own colours, if you aren't able to see them, try increasing the magnitude of the first three components (the RGB values). This makes them stronger. In addition, try and place your block inside a cave, rather than having it exposed to skylight. That makes the blocklight colour more obvious (and helps you check that its working).

## Injections

Additional code can be injected into the top section of `/shaders/lib/colors/blocklightColorsACL.glsl` by placing `.glsl` files within the `colors/injects` folder. This can be used to define additional processing before the code within the `.json`.

For example, if you want to have an option to change the color of light emitted, you can do something like the following.

```glsl
#ifdef CHANGE_COLOR_OPTION
    vec3 yourColor = <your color>
#else
    vec3 yourColor = <some other color>
#endif
```

```json
{
    "code": "vec4(yourColor, 0.0)"
}
```