---
title: Translucent Blocks
---

To create a shader for an translucent block, you will need to create 
- a `.glsl` file to store shader code and 
- a `.json` file to denote which blocks to apply the shader

These files should be placed under the `translucent` folder.

## GLSL Format

The shader code will be injected into `/shaders/lib/materials/materialHandling/translucentMaterials.glsl`. 

The shader code is evaluated at every vertex of the block. In layman's terms, the code is evaluated at every point on the block.

#### Inputs
You have access to the following within the shader code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`int mat` - The block id of the block being looked at, as assigned by Iris. <br>
`float frameTimeCounter` - Tracks time passing within the game. <br>

`vec3 color.rgb` - The color of the block within the block texture, for the currently evaluated part of the block. Each RGB value ranges between `0` and `1`. <br>
`float color.a` - The alpha component of the block within the block texture, for the currently evaluated part of the block. Ranges between `0` and `1`. <br>

`vec2 lmCoordM` - The lightmap at the currently evaluated part of the block . `x` is the blocklight, `y` is the skylight. <br>
`vec3 playerPos + cameraPosition` - The sum provides the world-space coordinates of the part of the block currently being evaluated. <br>
`vec2 signMidCoordPos` - Provides the displacement from the centre of the texture being used on that surface of the block. <br>

`float NdotU` - The value of the dot product between the vector normal to the block surface and the vector pointing upwards. <br>
`vec3 normalM` - The vector normal to the block surface. <br>
`vec3 eastVec` - The vector pointing eastwards. <br>

`float fresnel` - Ranges between 0 and 1 and provides the strength of the fresnel effect. <br>

`float skyLightCheck` - Ranges between 0 and 1 and checks for the presence of sky light. <br>
`sampler2D noisetex` - Used as a source of randomness. Can be read using `texture2D(noisetex, coord)` where `coord` is a `vec2`. The `g` component varies slowly while `r` and `b` components vary quickly.

#### Outputs
The following can be modified within the code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`float materialMask = OSIEBCA * x` - `x` is an integer denoting the deferred material being applied on this block. See ... for more information. <br>

`float emission` - Handles emissivity of the block. <br>
`float smoothnessG` - Handles strength of reflection by the sun and moon. <br>
`float reflectMult` - Handles strength of screenspace reflections. <br>
`float highlightMult` - Controls strength of the multiplier for highlights.<br>

`vec4 translucentMult` - Controls the color and transluency of the block. The first 3 components are the color, the last component is the alpha value / translucency.<br>
`float translucentMultCalculated` - Enables the use of `translucentMult` to <br>

`vec2 lmCoordM` - Used to modify the  lightmap values. <br>
`vec3 color.rgb` - Can be used to modify the color of the block. <br>
`float color.a` - Can be used to modify the alpha value of the block. <br>

`vec3 maRecolor` - After the color of the block has been modified by external lighting, performs `color.rgb += maRecolor`. <br>

`int subsurfaceMode` - Controls the type of subsurface scattering used. `1` is for leaves and general foliage, `2` is for lily pads and `3` is for vines as well as snow & ice (if the option is enabled). <br>

`boolean noSmoothLighting` - Controls whether or not smooth lighting is applied. <br>
`boolean noDirectionalShading` - Controls whether or not directional shading is applied. <br>

`float overlayNoiseIntensity` - Controls the intensity of overlaid noise when the moss / sand noise option is enabled. <br>
`float overlayNoiseEmission` - Controls the emissivity of overlaid noise when the moss / sand noise option is enabled. <br>
`float overlayNoiseAlpha` - Controls the translucency of the overlaid noise when the moss / sand noise option is enabled. <br>

`float sandNoiseIntensity` - Controls the amount of sand to coat the block with, if the relevant option is enabled. <br>
`float mossNoiseIntensity` - Controls the amount of moss to coat the block with, if the relevant option is enabled.<br>

`float noiseFactor` - Adjusts the amount of noise added when `COATED_TEXTURES` is enabled. <br>

## JSON Format

The following are the parameters specified in the JSON. **Bolded** and *italicized* parameters are required.

***`name`*** - The name of the type of block handled by the shader. <br>
***`glsl`*** - The relative path to the `.glsl` file. Currently only searches for files within the same folder as the `.json` file. or within a sub-folder of that folder. <br>

`mat<n>` - Complementary Shaders divides the space of block IDs into blocks of `block_size` block IDs where `block_size` is a power of 2 and is at least 4. Each of these IDs are assigned to a list of blocks and within the `.glsl` code, this can be checked with `mat % ... == ?`. <br>
`block_size` - The number of block IDs this shader material will take up. Must be a power of 2 and greater than or equal to 4. If not specified, defaults to 4. <br>

`blocklight` - The color / tint of the block for use in ACL. Can be either a list of length 4 or a single color / tint. Colors / tints are referenced through their resource locations. To indicate no color / tint, use `null`. Whether a color or tint has been specified is automatically determined by the program as all colors and tints should have unique ids. See [this](Colors-&-Tints.md) for more information. <br>

`conditions` - The conditions for the block to be assigned the ACL color specified above. <br>
`held_lighting` - Either `true` or `false`. Controls if the block should light up surroundings when held by the player. <br>
`needs_voxelization` - Specifies if voxelization is needed. Voxelization, when ACL is enabled, allows blocks to identify what blocks surround them. <br>
## Examples
### Poise Cluster

<img src="assets/poise_cluster.png">

```glsl
smoothnessG = 0.3 * color.r;  
  
translucentMultCalculated = true;  
reflectMult = pow2(color.r - color.g);  
translucentMult.rgb = pow2(color.rgb);  
  
highlightMult = 2.5;  
overlayNoiseAlpha = 0.4;  
sandNoiseIntensity = 0.2;  
mossNoiseIntensity = 0.2;
```

```json
{  
  "name": "poise_cluster",  
  "glsl": "poise_cluster.glsl",  
  "mat0": [  
    "endergetic:poise_cluster"  
  ],  
  "blocklight": "supplemental_patches:endergetic/poise_cluster"  
}
```

### Corundum Lamps

<img src="assets/corundum_lamps.png">

```glsl
float factor;  
if (mat % 16 < 8) {  
    factor = color.b;  
} else if (mat % 8 < 4) {  
    factor = 0.8 * color.g + 0.2 * color.r;  
} else if (mat % 2 == 0) {  
    factor = color.g;  
} else {  
    factor = (color.r + color.b + color.g) / 3;  
}

float dotColor = dot(color.rgb, color.rgb);  
translucentMultCalculated = true;  
reflectMult = dotColor * 0.7 - factor * 0.2;  
translucentMult.rgb = pow2(color.rgb) * 0.5;

smoothnessG = 1.2 - factor * 0.5;  
highlightMult = factor * 3.0;

if (mat % 2) {  
    noSmoothLighting = true;  
    lmCoordM.x *= 0.88;  
  
    emission = pow2(min(color.r, min(color.g, color.b))) * 7.0;  
    if (color.r < color.b && color.r < color.g) {
        color.r *= 1.0 - emission * 0.07;  
    } else if (color.g < color.r && color.g < color.b) {
        color.g *= 1.0 - emission * 0.07;  
    } else {
        color.b *= 1.0 - emission * 0.07;  
    }

    emission *= 1.3;  

    overlayNoiseIntensity = 0.5;  
}
```

```json
{  
  "name": "crystal_lamps",  
  "glsl": "crystal_lamps.glsl",  
  "mat0": [  
    "quark:red_crystal_lamp:lit=true"  
  ],  
  "mat1": [  
    "quark:red_crystal_lamp:lit=false"  
  ],  
  "mat2": [  
    "quark:orange_crystal_lamp:lit=true"  
  ],  
  "mat3": [  
    "quark:orange_crystal_lamp:lit=false"  
  ],  
  "mat4": [  
    "quark:yellow_crystal_lamp:lit=true"  
  ],  
  "mat5": [  
    "quark:yellow_crystal_lamp:lit=false"  
  ],  
  "mat6": [  
    "quark:green_crystal_lamp:lit=true"  
  ],  
  "mat7": [  
    "quark:green_crystal_lamp:lit=false"  
  ],  
  "mat8": [  
    "quark:blue_crystal_lamp:lit=true"  
  ],  
  "mat9": [  
    "quark:blue_crystal_lamp:lit=false"  
  ],  
  "mat10": [  
    "quark:indigo_crystal_lamp:lit=true"  
  ],  
  "mat11": [  
    "quark:indigo_crystal_lamp:lit=false"  
  ],  
  "mat12": [  
    "quark:violet_crystal_lamp:lit=true"  
  ],  
  "mat13": [  
    "quark:violet_crystal_lamp:lit=false"  
  ],  
  "mat14": [  
    "quark:black_crystal_lamp:lit=true"  
  ],  
  "mat15": [  
    "quark:black_crystal_lamp:lit=false"  
  ],  
  "blocklight": [  
    "supplemental_patches:quark/crystal_lamp/red",  
    null,    
    "supplemental_patches:quark/crystal_lamp/orange",  
    null,    
    "supplemental_patches:quark/crystal_lamp/yellow",  
    null,    
    "supplemental_patches:quark/crystal_lamp/green",  
    null,    
    "supplemental_patches:quark/crystal_lamp/blue",  
    null,    
    "supplemental_patches:quark/crystal_lamp/indigo",  
    null,    
    "supplemental_patches:quark/crystal_lamp/violet",  
    null,    
    "supplemental_patches:quark/crystal_lamp/black",  
    null  
    ],  
  "block_size": 16  
}
```

### Aria Mushrooms

<img src="assets/aria_mushroom.png">

```glsl
emission = 2.0 * pow2(color.r) + 0.2 * pow2(color.b);  
smoothnessG = 0.3 * color.r;  
  
translucentMultCalculated = true;  
reflectMult = max0(1.2 - emission);  
translucentMult.rgb = pow2(color.rgb) * 0.4;  
  
highlightMult = 2.5;  
overlayNoiseAlpha = 0.4;  
sandNoiseIntensity = 0.5;  
mossNoiseIntensity = 0.5;
```

```json
{  
  "name": "aria_mushroom",  
  "glsl": "aria_mushroom.glsl",  
  "mat0": [  
    "wetland_whimsy:aria_mushroom_block"  
  ],  
  "blocklight": "supplemental_patches:wetland_whimsy/aria_mushroom",  
  "heldLighting": true  
}
```
