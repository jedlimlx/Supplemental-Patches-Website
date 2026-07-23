---
title: Specific Materials
---

When writing your GLSL code for custom blocks, there are often situations where sections of code will need to be reused. Typically, this occurs when a specific material, say some metal, is part of a more complex block.

For example, consider the code for Galosphere's combustion table,

```glsl
if (color.b > 0.8) {  // Silver Part  
    #include "/lib/materials/specificMaterials/terrain/silverBlock.glsl"  
} else {  // Wood Part  
    #include "/lib/materials/specificMaterials/planks/darkOakPlanks.glsl"  
}
```

There is a silver part and a wood part. Their shaders are defined by GLSL files found under `/lib/materials/specificMaterials`.

In order to add the specific materials, you will need 
- a `.glsl` file to store shader code and 
- a `.json` file to denote which particles to apply the shader

These files should be placed under the `specific_materials` folder.

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

`mat0` - The list of particle *textures* that the shader will be applied to. Note that you place particle *textures* in here, not the particles themselves.