---
title: Opaque Blocks
---

To create a shader for an opaque block, you will need to create 
- a `.glsl` file to store shader code and 
- a `.json` file to denote which blocks to apply the shader to

These files should be placed under the `terrain` folder.

## GLSL Format

The shader code will be injected into `/shaders/lib/materials/materialHandling/terrainMaterials.glsl`. 

The shader code is evaluated at every vertex of the block. In layman's terms, the code is evaluated at every point on the block.

#### Inputs
You have access to the following within the shader code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`int mat` - The block id of the block being looked at, as assigned by Iris. <br>
`float frameTimeCounter` - Tracks time passing within the game. <br>

`vec3 color.rgb` - The color of the block within the block texture, for the currently evaluated part of the block. Each RGB value ranges between `0` and `1`. <br>
`vec2 lmCoordM` - The lightmap at the currently evaluated part of the block . `x` is the blocklight, `y` is the skylight. <br>
`vec3 playerPos + cameraPosition` - The sum provides the world-space coordinates of the part of the block currently being evaluated. <br>
`vec2 signMidCoordPos` - Provides the displacement from the centre of the texture being used on that surface of the block. <br>

`float NdotU` - The value of the dot product between the vector normal to the block surface and the vector pointing upwards. <br>
`vec3 normalM` - The vector normal to the block surface. <br>
`vec3 eastVec` - The vector pointing eastwards. <br>

`float skyLightCheck` - Ranges between 0 and 1 and checks for the presence of sky light. <br>

`sampler2D noisetex` - Used as a source of randomness. Can be read using `texture2D(noisetex, coord)` where `coord` is a `vec2`. The `g` component varies slowly while `r` and `b` components vary quickly.

#### Outputs
The following can be modified within the code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`float materialMask = OSIEBCA * x` - `x` is an integer denoting the [deferred material](deferred_materials) being applied on this item. <br>

`float emission` - Handles emissivity of the block. <br>
`float smoothnessG` - Handles strength of reflection by the sun and moon. <br>
`float smoothnessD` - Handles strength of screenspace reflections. <br>
`float highlightMult` - Controls strength of the multiplier for highlights. <br>

`vec2 lmCoordM` - Used to modify the  lightmap values. <br>
`vec3 color.rgb` - Can be used to modify the color of the block. <br>

`vec3 maRecolor` - After the color of the block has been modified by external lighting, performs `color.rgb += maRecolor`. <br>

`int subsurfaceMode` - Controls the type of subsurface scattering used. `1` is for leaves and general foliage, `2` is for lily pads and `3` is for vines as well as snow & ice (if the option is enabled). <br>

`boolean noSmoothLighting` - Controls whether or not smooth lighting is applied. <br>
`boolean noDirectionalShading` - Controls whether or not directional shading is applied. <br>

`float overlayNoiseIntensity` - Controls the intensity of overlaid noise when the moss / sand noise option is enabled. <br>
`float overlayNoiseEmission` - Controls the emissivity of overlaid noise when the moss / sand noise option is enabled. <br>

`float sandNoiseIntensity` - Controls the amount of sand to coat the block with, if the relevant option is enabled. <br>
`float mossNoiseIntensity` - Controls the amount of moss to coat the block with, if the relevant option is enabled.<br>

`float noiseFactor` - Adjusts the amount of noise added when `COATED_TEXTURES` is enabled. <br>

## JSON Format

The following are the parameters specified in the JSON. **Bolded** and *italicized* parameters are required.

***`name`*** - The name of the type of block handled by the shader. <br>
***`glsl`*** - The relative path to the `.glsl` file. Currently only searches for files within the same folder as the `.json` file. or within a sub-folder of that folder. <br>

`mat<n>` - Complementary Shaders divides the space of block IDs into blocks of `block_size` block IDs where `block_size` is a power of 2 and is at least 4. Each of these IDs are assigned to a list of blocks and within the `.glsl` code, this can be checked with `mat % ... == ?`. Blocks within `mat<n>`, where `n` is an odd number, are taken as not being whole blocks for the purposes of Advanced Coloured Lighting (ACL). <br>
`blockSize` - The number of block IDs this shader material will take up. Must be a power of 2 and greater than or equal to 4. If not specified, defaults to 4. <br>

`color` - The color of the block for use in ACL. Can be either a list of length `block_size` or a single color. Colors are referenced through their resource locations. To indicate no color, use `null`. See [this](Colors-&-Tints.md) for more information. <br>
`conditions` - The conditions for the block to be assigned the ACL color specified above. <br>
`held_lighting` - Either `true` or `false`. Controls if the block should light up surroundings when held by the player. <br>

`waving` - Specifies the type of waving motion that should be applied to the block. See ... for more details. <br>
`reflection_handler` - Specifies how reflections should be handled for this block. For more information, see [this](reflection_handlers) page. Can be either a list of length `block_size` or a single handler to be applied to all IDs within this block. <br>

`needs_voxelization` - Specifies if voxelization is needed. Voxelization, when ACL is enabled, allows blocks to identify what blocks surround them. <br>

## Examples
#### Lead Ore (Oreganized)

<img src="assets/lead_ore.png">

```GLSL
if (abs(color.b - color.r) > 0.04) {  // Raw Lead Part  
    #include "/lib/materials/specificMaterials/terrain/rawLeadBlock.glsl"  
  
    #ifdef GLOWING_ORE_LEAD  
        emission = 3.0 * sqrt2(max(color.r, color.b));  
  
        overlayNoiseIntensity = 0.6, overlayNoiseEmission = 0.5;  
        #ifdef SITUATIONAL_ORES  
            emission *= skyLightCheck;  
            color.rgb = mix(color.rgb, color.rgb * pow(color.rgb, vec3(0.5 * min1(GLOWING_ORE_MULT))), skyLightCheck);  
        #else  
            color.rgb *= pow(color.rgb, vec3(0.5 * min1(GLOWING_ORE_MULT)));  
        #endif  
        emission *= GLOWING_ORE_MULT;  
    #endif  
} else {  // Stone Part
    if (mat % 4 == 0) {
        #include "/lib/materials/specificMaterials/terrain/stone.glsl"
    } else {
        #include "/lib/materials/specificMaterials/terrain/deepslate.glsl"
    }
}
```

We begin by identifying which parts of the block are lead and which parts are stone. This is done using `abs(color.b - color.r)` which checks for the absolute difference between amounts of red and blue. For stone, this difference should be small, hence we check if the difference is larger than `0.04`. This allows us to apply the material shaders for stone / raw lead appropriately.

Furthermore, using `mat % 4`, we can check if the ore is normal ore or a deepslate ore and hence, apply the correct material shader.

Next, using compiler directives, we check if the option for glowing lead ore is enabled. If it is, we set the `emission` to be `3.0 * sqrt(max(color.r, color.b))`, since the lead ore contains both deep blue as well as orange bits.

Then, we check for the `SITUATIONAL_ORES` option. In essence, if enabled, this prevents ores from glowing when under skylight (i.e. when not in a cave). `skyLightCheck` is used for this.

Afterwards, we multiply `color.rgb` by `pow(color.rgb, vec3(0.5 * min1(GLOWING_ORE_MULT)))`. This is commonly done to offset the change in color of the ore due to emissivity.

Finally, we multiply the emission by `GLOWING_ORE_MULT` which is a setting that allows us to control the emissivity of all the ores.

```json
{  
  "name": "lead_ore",  
  "glsl": "lead_ore.glsl",  
  "mat0": [  
    "oreganized:lead_ore",  
  ],  
  "mat2": [
    "oreganized:deepslate_lead_ore"
  ],
  "color": "supplemental_patches:oreganized/lead_ore",  
  "conditions": [  
    "GLOWING_ORE_LEAD",  
    "DO_IPBR_LIGHTS"  
  ]  
}
```

#### Prismarine Coral Crystal (Upgrade Aquatic)

<img src="assets/prismarine_coral_crystals.png">

```glsl
smoothnessG = pow2(color.g) * 0.8;  
highlightMult = 1.5;  
smoothnessD = smoothnessG;  
  
#ifdef COATED_TEXTURES  
    noiseFactor = 0.66;  
#endif  
  
if (mat % 4 < 2) {  
    noSmoothLighting = true;  
  
    #ifdef GBUFFERS_TERRAIN  
        vec3 worldPos = playerPos.xyz + cameraPosition.xyz;  
        vec3 blockPos;  
        if (mat % 4 == 0) {  
            blockPos = abs(fract(worldPos) - vec3(0.5));  
        } else {  
            blockPos = abs(fract(worldPos) - vec3(0.5, 0.2, 0.5));  
        }  
  
        float r = length(blockPos);  
        emission = smoothnessG - 0.5 * pow3(color.g);  
        emission *= pow2(max0(1.0 - r * 1.3) * color.r) * 35.0;  
        color.r *= 1.0 - emission * 0.05;  
  
        overlayNoiseIntensity = 0.5;  
    #endif  
}
```

First, we begin by defining the reflectivity of the block (`smoothnessG`, `smoothnessD`) and `highlightMult`. In addition, we define the `noiseFactor` as well. These are defined to the same as the prismarine block.

Next, we check if `mat % 4 < 2` since `mat2` refers to the prismarine coral block. We then disable smooth lighting, which is typically done on blocks with odd shapes. If this shader is being evaluated within `GBUFFERS_TERRAIN` shader program (see [this](https://shaders.properties/current/reference/programs/gbuffers/) for more details), we make the crystal emissive.

To do this, first we obtain the position within the block we are looking at using `playerPos.xyz + cameraPosition.xyz`. We are going to make the parts of the block that are closer to the centre more emissive. The centre is defined as `vec3(0.5, 0.5, 0.5)` for most of the coral crystals and `vec3(0.5, 0.2, 0.5)` for the coral fan (since it is close to the ground.)

Then, we can get `r`, the distance to the centre defined above. We then start with a base emission value of `smoothnessG - 0.5 * pow3(color.g)`, which gives a nice smooth curve shown below. This makes the brighter parts of the coral crystal more emissive.

<img src="assets/prismarine_coral_emission.svg">

Then, `emission` is multiplied by `pow2(max0(1.0 - r * 1.3) * color.r) * 35.0`. `max0(1.0 - r * 1.3)` makes `emission` decrease as `r` increases, lower-bounded by 0. Multiplication by `color.r` makes the brighter parts of the coral more emissive as since the coral is turquoise, only very bright areas will have a large component of red. Finally, the whole thing is squared and multiplied by 35.

Finally, `color.r` is multiplied by `1.0 - emission * 0.05`. This decreases the contrast by slightly decreasing the amount of red in areas with high emissivity.

```json
{  
  "name": "prismarine_coral",  
  "glsl": "prismarine_coral.glsl",  
  "mat0": [  
    "upgrade_aquatic:prismarine_coral",  
    "upgrade_aquatic:prismarine_coral_wall_fan",  
    "upgrade_aquatic:prismarine_coral_shower"  
  ],  
  "mat1": [  
    "upgrade_aquatic:prismarine_coral_fan"  
  ],  
  "mat2": [  
    "upgrade_aquatic:prismarine_coral_block"  
  ],  
  "color": "supplemental_patches:upgrade_aquatic/prismarine"  
}
```
#### Paper Lantern (Twigs)

<img src="assets/twigs_paper_lantern.png">

```glsl
if (color.r / color.b > 1.9) {  
    #include "/lib/materials/specificMaterials/planks/oakPlanks.glsl"  
    lmCoordM.x *= 0.88;  
} else {  
    vec2 bpos = floor(playerPos.xz + cameraPosition.xz + 0.5)  
    + floor(playerPos.y + cameraPosition.y + 0.5);  
    vec2 flickerNoise = texture2D(noisetex, vec2(frameTimeCounter * 0.015 + bpos.r * 0.1)).rb;  
  
    noSmoothLighting = true;  
    lmCoordM.x = 0.77;  
  
    emission = 0.4 * (color.r + color.b + color.g);  
  
    // motion of candle within lantern  
    vec3 fractPos = fract(playerPos.xyz + cameraPosition.xyz) - 0.5;  
    if (abs(NdotU) < 0.1 && max(abs(fractPos.x), abs(fractPos.z)) > 0.1)  
        emission /= (1 + length(signMidCoordPos - 0.05 * sin(flickerNoise.gr * 5.0)));  
  
    // appearance of flickering  
    emission *= (1.0 + min1(max(flickerNoise.r, flickerNoise.g) * 1.7)) * 0.5;  
  
    #ifdef SOUL_SAND_VALLEY_OVERHAUL_INTERNAL  
        color.r *= mix(max(emission, 1) + 1, 1, inSoulValley);  
        color.b *= mix(1, pow3(max(emission, 1)) + 1, inSoulValley);  
        color.g *= max(emission, 1) + 1;  
    #else  
        color.r *= pow1_5(max(emission, 1)) + 1;  
        color.g *= max(emission, 1) + 1;  
    #endif  
  
    #ifdef DISTANT_LIGHT_BOKEH  
        DoDistantLightBokehMaterial(color, vec4(1.0, 0.6, 0.2, 1.0), emission, 5.0, lViewPos);  
    #endif  
}
```

First, we check for the wooden part of the lantern on top. Its `lmCoordM.x` is reduced to make it seem like it isn't being illuminated by the lantern.

Then, we compute `bpos` which is used to read from `noisetex`. It is dependent on the block's position to prevent lanterns placed close together to have the same random candle motion.

After some minor tweaks, `emission` is set to `0.4 * (color.r + color.b + color.g)`, to account for the fact that the lanterns have patterns on them. This means colors other than white also need to be emissive.

Then, by checking `abs(NdotU) < 0.1` and `max(abs(fractPos.x), abs(fractPos.z)) > 0.1`, we check that we are only looking at the side-walls of the lantern. We can then adjust the `emission` by dividing by `(1 + length(signMidCoordPos - 0.05 * sin(flickerNoise.gr * 5.0)))`. This function increases as we get further from the centre of the lantern due to the magnitude of `signMidCoordPos.` However, this "centre" is also shifted periodically and randomly by `0.05 * sin(flickerNoise.gr * 5.0)`. `0.05` controls the magnitude of this shift and `5.0` controls the rate at which it changes.

Following this, we create the appearance of flickering by multiplying `emission` by `(1.0 + min1(max(flickerNoise.r, flickerNoise.g) * 1.7)) * 0.5`. This will cause `emission` to increase if `max(flickerNoise.r, flickerNoise.g) * 1.7` increases above 1.

Finally, we shift the color of the lantern to blue and add distant light bokeh if the relevant options are enabled.

```json
{  
  "name": "paper_lantern",  
  "glsl": "paper_lantern.glsl",  
  "mat0": [  
    "twigs:paper_lantern",  
    "twigs:allium_paper_lantern",  
    "twigs:blue_orchid_paper_lantern",  
    "twigs:crimson_roots_paper_lantern",  
    "twigs:dandelion_paper_lantern",  
    "twigs:torchflower_paper_lantern",
    "quark:paper_lantern",  
    "quark:paper_lantern_sakura"  
  ],  
  "color": "minecraft:lantern"  
}
```