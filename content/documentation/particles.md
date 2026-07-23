---
title: Particles
---

Supplemental Patches adds the ability to type shaders to *specific* particles rather than only particles of a certain color. This is done through dynamically reading the locations of the particle textures within the texture atlas and writing dynamic GLSL code that will run your shader code only when the correct particle is used. (note that only the texture being used can be distinguished, it is possible for two particles to use the same texture)

However, this means that for the correct particle shaders to run, the shaders must be reloaded every time a new mod is added to the game (unless the mod adds no particles).

In order to add particle shaders, you will need 
- a `.glsl` file to store shader code and 
- a `.json` file to denote which particles to apply the shader

These files should be placed under the `particle` folder.

## GLSL Format

The shader code will be injected into `/shaders/programs/gbuffers_textured.glsl`. 

The shader code is evaluated at every vertex of the particle. In layman's terms, the code is evaluated at every point on the particle.

#### Inputs
You have access to the following within the shader code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`vec3 color.rgb` - The color of the block within the block texture, for the currently evaluated part of the block. Each RGB value ranges between `0` and `1`. <br>
`float color.a` - The alpha value for translucent particles, ranging between `0` and `1`. <br>

`vec2 lmCoordM` - The lightmap at the currently evaluated part of the block . `x` is the blocklight, `y` is the skylight. <br>

#### Outputs
The following can be modified within the code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`float emission` - Handles emissivity of the block. <br>

`vec2 lmCoordM` - Used to modify the lightmap values. <br>
`vec3 color.rgb` - Can be used to modify the color of the particle. <br>
`vec3 color.a` - Can be used to modify the translucency of the particle. <br>

`float purkinjeOverwrite` - Overwrites the darkness desaturation effect if set to `1.0` for that part of the particle.

`discard` - Used to decide not to render the particle.

## JSON Format

The following are the parameters specified in the JSON. **Bolded** and *italicized* parameters are required.

***`name`*** - The name of the type of particle handled by the shader. <br>
***`glsl`*** - The relative path to the `.glsl` file. Currently only searches for files within the same folder as the `.json` file. or within a sub-folder of that folder. <br>

`mat0` - The list of particle *textures* that the shader will be applied to. Note that you place particle *textures* in here, not the particles themselves since there is no way to distingush between *particles* in Iris, only between the *textures* that are used.