---
title: Waving Objects
---

Supplemental Patches adds the ability to allow various blocks to deform over time, to create a waving motion. This is typically applied to foliage or to various fluids.

To apply a waving function to a block or block entity, you will need to define the `waving` attribute within the JSON files for those blocks. There are 2 options here. You may apply one of the predefined options listed in the table below or you may create a custom waving function.

| Waving Function                     | Use Case                                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `minecraft:grounded_waving_foliage` | For 1-block tall foliage that is placed on the ground. This prevents the base of the texture from waving. |
| `minecraft:hanging_waving_foliage`  | For 1-block tall foliage that is placed on the ceiling. This prevents the top of the foliage from waving. |
| `minecraft:waving_foliage`          | For unrestricted waving. Can be used on the top half of 2 block tall foliage.                             |
| `minecraft:waving_leaves`           | For waving leaves.                                                                                        |
| `minecraft:waving_sugar_cane`       | For sugar cane. Waving only occurs if the `WAVING_SUGAR_CANE` option is enabled.                          |
| `minecraft:waving_tall_foliage`     | For tall non-emissive foliage that grows from the ceiling / the ground.                                   |
| `minecraft:waving_tall_foliage_2`   | For tall emissive foliage that grows from the ceiling  / the ground (e.g. cave vines).                    |

To create your own custom waving function, you will need to define a GLSL file
 - a `.glsl` file to store shader code and 
 - a `.json` file to provide some auxiliary information

These files should be placed under the `waving` folder.

## GLSL Format

The shader code will be injected into `/shaders/lib/materials/materialMethods/wavingBlocks.glsl`. 

The shader code is evaluated at every vertex of the block. In layman's terms, the code is evaluated at every point on the block.

#### Inputs
You have access to the following within the shader code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`vec3 worldPos` - Provides the world-space coordinates of the part of the block currently being evaluated. 

`float frameTimeCounter` - Tracks time passing within the game.

#### Outputs
The following can be modified within the code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`vec3 playerPos.xyz` - Shifting the value of this variable will result in the block being deformed by the provided displacement.

## JSON Format

The following are the parameters specified in the JSON. **Bolded** and *italicized* parameters are required.

***`glsl`*** - The relative path to the GLSL file containing the code.

`conditions` - The conditions for the block to be allowed to wave.


## Waving Functions

TBC