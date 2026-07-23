---
title: Items
---

To create a shader for an item, you will need to create 
- a `.glsl` file to store shader code and 
- a `.json` file to denote which items to apply the shader to

These files should be placed under the `items` folder.

## GLSL Format

The shader code will be injected into `/shaders/lib/materials/materialHandling/entityMaterials.glsl`. 

The shader code is evaluated at every vertex of the item. In layman's terms, the code is evaluated at every point on the item.

#### Inputs
You have access to the following within the shader code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`int currentRenderedItemId` - The item id of the item being rendered at, as assigned by Iris. <br>
`float frameTimeCounter` - Tracks time passing within the game. <br>

`vec3 color.rgb` - The color of the item within the item texture, for the currently evaluated part of the item. Each RGB value ranges between `0` and `1`. <br>
`vec2 lmCoordM` - The lightmap at the currently evaluated part of the item. `x` is the blocklight, `y` is the skylight. <br>
`vec3 playerPos + cameraPosition` - The sum provides the world-space coordinates of the part of the item currently being evaluated. <br>
`vec2 signMidCoordPos` - Provides the displacement from the centre of the texture being used on that surface of the item. <br>

`float NdotU` - The value of the dot product between the vector normal to the item surface and the vector pointing upwards. <br>
`vec3 normalM` - The vector normal to the item surface. 
`vec3 eastVec` - The vector pointing eastwards. <br>

`float skyLightCheck` - Ranges between 0 and 1 and checks for the presence of sky light. <br>

`sampler2D noisetex` - Used as a source of randomness. Can be read using `texture2D(noisetex, coord)` where `coord` is a `vec2`. The `g` component varies slowly while `r` and `b` components vary quickly. <br>
`sampler2D tex` - Used to read the entire texture file of the item, together with `texelFetch`. The size of `tex` can be obtained by `textureSize(tex, 0)`.<br>
`vec2 texCoord` - Gives the coordinate of the part of the item being read on the texture. Ranges between `0` and `1`.

#### Outputs
The following can be modified within the code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`float materialMask = OSIEBCA * x` - `x` is an integer denoting the [deferred material](deferred_materials) being applied on this item.

`float emission` - Handles emissivity of the item. <br>
`float smoothnessG` - Handles strength of reflection by the sun and moon. <br>
`float smoothnessD` - Handles strength of screenspace reflections. <br>
`float highlightMult` - Controls strength of the multiplier for highlights. <br>

`vec2 lmCoordM` - Used to modify the lightmap values. <br>
`vec3 color.rgb` - Can be used to modify the color of the item. <br>

`int subsurfaceMode` - Controls the type of subsurface scattering used. `1` is for leaves and general foliage, `2` is for lily pads and `3` is for vines as well as snow & ice (if the option is enabled). <br>

`boolean noSmoothLighting` - Controls whether or not smooth lighting is applied. <br>
`boolean noDirectionalShading` - Controls whether or not directional shading is applied. <br>

`float noiseFactor` - Adjusts the amount of noise added when `COATED_TEXTURES` is enabled.<br>

`float purkinjeOverwrite` - Overwrites the darkness desaturation effect if set to `1.0` for that part of the item.

## JSON Format

The following are the parameters specified in the JSON. **Bolded** and *italicized* parameters are required.

***`name`*** - The name of the type of item handled by the shader. 
***`glsl`*** - The relative path to the `.glsl` file. Currently only searches for files within the same folder as the `.json` file. or within a sub-folder of that folder. <br>

`mat<n>` - Complementary Shaders divides the space of item IDs into blocks of `block_size` item IDs where `block_size` is a power of 2 and is at least 4. Each of these IDs are assigned to a list of entities and within the `.glsl` code, this can be checked with `currentRenderedItemId % ... == ?`.<br>
`block_size` - The number of item IDs this shader material will take up. Must be a power of 2 and greater than or equal to 4. If not specified, defaults to 4. <br>