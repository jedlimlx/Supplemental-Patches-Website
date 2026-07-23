---
title: Entities
---

To create a shader for an entity, you will need to create 
- a `.glsl` file to store shader code and 
- a `.json` file to denote which entities to apply the shader to

These files should be placed under the `entity` folder.

## GLSL Format

The shader code will be injected into `/shaders/lib/materials/materialHandling/entityMaterials.glsl`. 

The shader code is evaluated at every vertex of the entity. In layman's terms, the code is evaluated at every point on the entity.

#### Inputs
You have access to the following within the shader code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`int entityId` - The entity id of the entity being looked at, as assigned by Iris. <br>
`float frameTimeCounter` - Tracks time passing within the game. <br>

`vec3 color.rgb` - The color of the entity within the entity texture, for the currently evaluated part of the entity. Each RGB value ranges between `0` and `1`. <br>
`vec2 lmCoordM` - The lightmap at the currently evaluated part of the entity . `x` is the blocklight, `y` is the skylight. <br>
`vec3 playerPos + cameraPosition` - The sum provides the world-space coordinates of the part of the entity currently being evaluated. <br>
`vec2 signMidCoordPos` - Provides the displacement from the centre of the texture being used on that surface of the entity. <br>

`float NdotU` - The value of the dot product between the vector normal to the entity surface and the vector pointing upwards. <br>
`vec3 normalM` - The vector normal to the entity surface. 
`vec3 eastVec` - The vector pointing eastwards. <br>

`float skyLightCheck` - Ranges between 0 and 1 and checks for the presence of sky light. <br>

`sampler2D noisetex` - Used as a source of randomness. Can be read using `texture2D(noisetex, coord)` where `coord` is a `vec2`. The `g` component varies slowly while `r` and `b` components vary quickly. <br>
`sampler2D tex` - Used to read the entire texture file of the entity, together with `texelFetch`. The size of `tex` can be obtained by `textureSize(tex, 0)`.<br>
`vec2 texCoord` - Gives the coordinate of the part of the entity being read on the texture. Ranges between `0` and `1`.

#### Outputs
The following can be modified within the code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`float materialMask = OSIEBCA * x` - `x` is an integer denoting the [deferred material](deferred_materials) being applied on this item.<br>

`float emission` - Handles emissivity of the entity. <br>
`float smoothnessG` - Handles strength of reflection by the sun and moon. <br>
`float smoothnessD` - Handles strength of screenspace reflections. <br>
`float highlightMult` - Controls strength of the multiplier for highlights. <br>

`vec2 lmCoordM` - Used to modify the  lightmap values. <br>
`vec3 color.rgb` - Can be used to modify the color of the entity. <br>

`int subsurfaceMode` - Controls the type of subsurface scattering used. `1` is for leaves and general foliage, `2` is for lily pads and `3` is for vines as well as snow & ice (if the option is enabled). <br>

`boolean noSmoothLighting` - Controls whether or not smooth lighting is applied. <br>
`boolean noDirectionalShading` - Controls whether or not directional shading is applied. <br>

`float noiseFactor` - Adjusts the amount of noise added when `COATED_TEXTURES` is enabled.<br>

`float purkinjeOverwrite` - Overwrites the darkness desaturation effect if set to `1.0` for that part of the entity.

## JSON Format

The following are the parameters specified in the JSON. **Bolded** and *italicized* parameters are required.

***`name`*** - The name of the type of entity handled by the shader. 
***`glsl`*** - The relative path to the `.glsl` file. Currently only searches for files within the same folder as the `.json` file. or within a sub-folder of that folder. <br>

`mat<n>` - Complementary Shaders divides the space of entity IDs into blocks of `block_size` entity IDs where `block_size` is a power of 2 and is at least 4. Each of these IDs are assigned to a list of entities and within the `.glsl` code, this can be checked with `entityId % ... == ?`.
`block_size` - The number of entity IDs this shader material will take up. Must be a power of 2 and greater than or equal to 4. If not specified, defaults to 4. <br>

## Examples

### Pike (Upgrade Aquatic)
<img src="assets/obsidian_pike.png">

```glsl
vec4 pikeColour = texelFetch(tex, ivec2(0, 31), 0);  
if (CheckForColor(pikeColour.rgb, vec3(16, 12, 28))) {  // obsidian  
    #include "/lib/materials/specificMaterials/terrain/obsidian.glsl"  
  
    highlightMult *= 0.5;  
  
    if (color.r > 0.3) {  
        emission = 4.0 * color.r;  
        color.r *= 1.15;  
    }  
} else if (CheckForColor(pikeColour.rgb, vec3(49, 71, 83))) {  // supercharged  
    if (color.r > 0.35 && color.b > 1.8 * color.r)  
    emission = 3.5 * color.b;  
}
```

To identify the type of pike, we read the eye color of the pike using `texelFetch(tex, ivec2(0, 31), 0)`. Then, we check the color against the different pike textures and apply the relevant shaders.

```json
{  
  "name": "pike",  
  "glsl": "pike.glsl",  
  "mat0": [  
    "upgrade_aquatic:pike"  
  ]  
}
```

### Wildfire (Friends & Foes)
<img src="assets/wildfire.png">

```glsl
lmCoordM = vec2(0.9, 0.0);  
emission = min(color.r, 0.7) * 1.4;  
  
float dotColor = dot(color.rgb, color.rgb);  
if (CheckForColor(color.rgb, vec3(221, 54, 72)) || CheckForColor(color.rgb, vec3(137, 29, 52))) {  
   emission = 4.0;  
} else if (abs(dotColor - 1.5) > 1.4) {  
    emission = 5.0;  
} else {  
    #ifdef SOUL_SAND_VALLEY_OVERHAUL_INTERNAL  
        color.rgb = changeColorFunction(color.rgb, 2.0, colorSoul, inSoulValley);  
    #endif  
    #ifdef PURPLE_END_FIRE_INTERNAL  
        color.rgb = changeColorFunction(color.rgb, 2.0, colorEndBreath, 1.0);  
    #endif  
}
```

```json
{  
  "name": "wildfire",  
  "glsl": "wildfire.glsl",  
  "mat0": [  
    "friendsandfoes:wildfire"  
  ]  
}
```
### Berserker (Galosphere)
<img src="assets/berserker.png">

```glsl
if (color.r > 0.8) {  
    #include "/lib/materials/specificMaterials/terrain/pinkSalt.glsl"  
  
    if (entityId % 4 == 0) {  
        #if GLOWING_PINK_SALT >= 3  
            emission = pow2(color.g) * color.g * 3.0;  
            color.g *= 1.0 - emission * 0.07;  
            emission *= 1.3;  
        #endif  
    } else {  
        #if GLOWING_PINK_SALT >= 2  
            emission = pow2(color.g) * color.g * 3.0;  
            color.g *= 1.0 - emission * 0.07;  
            emission *= 1.3;  
        #endif  
    }  
  
    overlayNoiseIntensity = 0.5;  
}
```



```json
{  
  "name": "preserved",  
  "glsl": "preserved.glsl",  
  "mat0": [  
    "galosphere:preserved"  
  ],  
  "mat1": [  
    "galosphere:berserker"  
  ]  
}
```