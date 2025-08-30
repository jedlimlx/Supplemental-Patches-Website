---
title: Getting Started
---

Supplemental Patches enables users to create custom shaders for modded blocks, entities, items, particles, etc, through a resource-pack. In this tutorial, we will create such a resource-pack.

# Pre-requisites

To build a resource-pack that Supplemental Patches can use, you will need
- A suitable text editor for modifying shader code.
- A colour picker program that allows you to choose colours from a texture.
- An instance of Minecraft with [Iris / Oculus](https://www.irisshaders.dev/), [Complementary Shaders](https://www.complementary.dev/) and [Euphoria Patches](http://euphoriapatches.com/). Note that Supplemental Patches **DOES NOT** work with Optifine.
- A basic understanding of the syntax of OpenGL Shading Language (GLSL), which for the most part, is largely similar to C.

# Pack Structure

Let's begin by defining the contents of the assets folder of the resource-pack. If you're not sure of how to create a resource-pack, check out [this tutorial](https://minecraft.fandom.com/wiki/Tutorials/Creating_a_resource_pack) first.

All files for patching Euphoria Patches should be contained within a main folder named `euphoria` (see below).

```
assets
├── <your resource pack name>
│     └── euphoria
│         ├── <your other folders and files go here>
│         ...
...
```

# Creating Block Shaders

Now, let's create a new shader for Galosphere's Allurite Lamp.

<p style="text-align:center">
    <img src="assets/textures/allurite_lamp.png" width=200>
</p>

> [!info] Take Note
> 
> The actual shader being applied on this block within the built-in resource-pack is a fair bit 
> more complicated than what we will create here, but we're keeping it simple for this tutorial.
> The full code is below if you're interested.
> 
> > [!code]- GLSL Code
> > 
> > ```glsl
> > materialMask = OSIEBCA; // Intense Fresnel
> > float factor = pow2(0.6 * color.b + 0.4 * color.g);
> > smoothnessG = 0.8 - factor * 0.3;
> > highlightMult = factor * 3.0;
> > smoothnessD = factor;
> > 
> > noSmoothLighting = true;
> > lmCoordM.x *= 0.88;
> > 
> > emission = pow2(0.8 * color.r + 0.2 * color.g) * 5.5;
> > color.r *= 1.0 - emission * 0.09;
> >
> > #ifdef COATED_TEXTURES
> >      noiseFactor = 0.66;
> > #endif
> >
> > #ifdef DISTANT_LIGHT_BOKEH
> >     DoDistantLightBokehMaterial(emission, 2.0, lViewPos);
> > #endif
> > ```


To define a block shader, we will need to define a JSON file and a GLSL file within the `euphoria/terrain` folder.

## Writing the GLSL Code

First, let's create the GLSL file, which contains the shader code used to render the block. The code is executed for each vertex of the block (think of it as each pixel, though its typically finer than that).

### Emission

We want the brighter parts of the block to glow more. This can be achieved by setting the value of the `emission` variable. To access the colour, we can make use of the `vec3 color.rgb` variable.

For instance, we can try the following, using the `pow2` function which squares the input.
```glsl
emission = pow2(color.b) * 2.0;
```

### Reflectiveness

Next, we should define the reflectiveness of the block. This is done by setting the value of `smoothnessG` and `smoothnessD`.

`smoothnessG` handles the strength of reflection by the sun and moon while `smoothnessD` handles strength of screenspace reflections. For now, let's define a constant value of reflectiveness across the lamp.

```glsl
smoothnessG = 0.8;
smoothnessD = smoothnessG;
```

Since this is a crystal, we should enable the intense Fresnel effect as while by setting the value of material mask to `OSIEBCA`.

```glsl
materialMask = OSIEBCA; // Intense Fresnel
smoothnessG = 0.8;
smoothnessD = factor;
```

### Additional Effects

We can also add a noise factor, which determines the amount of noise added when the `COATED_TEXTURES` setting is enabled. In this case, we will use the same value as amethyst.
```glsl  
#ifdef COATED_TEXTURES 
	noiseFactor = 0.66;
#endif
```

We can also add some options for `DISTANT_LIGHT_BOKEH`. The second parameter `2.0` defines the emissiveness of the block when the player is viewing the block from a large distance (the distance from the block is `lViewPos`).
```glsl
#ifdef DISTANT_LIGHT_BOKEH
	DoDistantLightBokehMaterial(emission, 2.0, lViewPos);
#endif
```

### Final Code

Putting all this together, we have the following code. Name the file something like `allurite_lamp.glsl`.

> [!warning] Warning
> 
> Do not use capital letters in the name of any files in the resource-pack. Ideally, name your files in `snake_case`. This will prevent the resource-pack from crashing the game for versions `1.21` and higher.

```glsl
materialMask = OSIEBCA; // Intense Fresnel
smoothnessG = 0.8;
smoothnessD = smoothnessG;

emission = pow2(color.b) * 2.0;

#ifdef COATED_TEXTURES 
	noiseFactor = 0.66;
#endif

#ifdef DISTANT_LIGHT_BOKEH
	DoDistantLightBokehMaterial(emission, 2.0, lViewPos);
#endif
```

## Defining the JSON file

Now, we can define the JSON file as follows. Save the JSON in the same folder as the GLSL file.

```json
{
  "name": "allurite_lamp",
  "glsl": "allurite_lamp.glsl",
  "mat0": [
    "galosphere:allurite_lamp"
  ],
  "color": "yourresourcepackname:allurite_lamp",
  "held_lighting": true
}
```


`name` is the name of the block. This is for clarity purposes as it is used to label the GLSL code when it is patched into Euphoria Patches.

`glsl` is the name of the GLSL file.

`mat0` is a list of all blocks the shader should be applied to. By default, `mat0` through `mat3` can be defined, with the number being obtainable within the shader code using `mat % 4`. However, note that for light-emitting blocks such as this, only `mat0` and `mat2` can be used (if you want coloured lighting).

`color` is the resource-path of the colour file which we define in the next section. If you want to make use of a colour that is already defined by the base Euphoria Patches, set it to `minecraft:block_type`. Check out the full list [here](https://github.com/jedlimlx/supplemental-patches/tree/1.20.1-forge/src/main/resources/assets/minecraft/euphoria/colors).

`held_lighting` defines whether or not the block should emit light when held in the player's hands. In this case, since this is a bright lamp, we want this to be the case.

## Adding Coloured Lighting

Now, let's add support for Euphoria Patches' Advanced Coloured Lighting (ACL). You will need to place a file within the `euphoria/colors` folder.

The JSON file is below. It has only one parameter `code`. Name it `allurite_lamp.json`. The resource-path will be `yourresourcepackname:allurite_lamp`. If any subfolders are defined within the `euphoria/colors` folder, they should be included in the resource-path.

```json
{
  "code": "vec4(vec3(0.15, 1.05, 1.35) * 4, 0.0)"
}
```

The file contains a single line of GLSL code that outputs a `vec4`. The first 3 components are the RGB components of the color and the last component is the amount of additional light that the block should emit (in addition to normal Minecraft blocklight). The last component should not be too large, at most about `0.2`.

> [!info] Take Note
> 
> When defining your own colours, if you aren't able to see them, try increasing the magnitude of the first three components (the RGB values). This makes them stronger. In addition, try and place your block inside a cave, rather than having it exposed to skylight. That makes the blocklight colour more obvious (and helps you check that its working).

# Conclusion

With that, we have built our very first block shaders for Supplemental Patches!
