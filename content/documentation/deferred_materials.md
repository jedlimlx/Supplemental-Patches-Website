---
title: Deferred Materials
---
Deferred materials are material properties which run on the [deferred pass](https://shaders.properties/current/reference/programs/deferred/) of the shader, which lies in between the rendering of opaque and translucent blocks. This pass is typically used to handle reflections. As such, they are typically used to tint the color of reflections on metallic blocks.

To create a shader for deferred materials, you will need to create 
- a `.glsl` file to store shader code and 
- a `.json` file to denote the name of the material

These files should be placed under the `deferred` folder.

## GLSL Format

The shader code will be injected into `/shaders/lib/materials/materialHandling/deferredMaterials.glsl`. 

#### Inputs
You have access to the following within the shader code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`float smoothnessD` - The reflectivity of the block for screenspace reflections, which was set previously. <br>
`vec3 color.rgb` - The color of the block within the block texture, for the currently evaluated part of the block. Each RGB value ranges between `0` and `1`. 

#### Outputs
The following can be modified within the code. The data type is indicated in front. This is a non-exhaustive list and only touches on the most commonly used variables.

`float intenseFresnel` - Controls the strength of the fresnel effect. Typically set to `1.0`. <br>
`vec3 reflectColor` - Tints reflections on blocks with this deferred material.

## JSON Format

The following are the parameters specified in the JSON. **Bolded** and *italicized* parameters are required.

***`name`*** - The name of the type of block handled by the shader. <br>
***`glsl`*** - The relative path to the `.glsl` file. Currently only searches for files within the same folder as the `.json` file. or within a sub-folder of that folder. <br>

## Examples
### Blast Proof Plates

```glsl
intenseFresnel = 1.0;  
if (color.g > color.r) {  
    reflectColor = vec3(0.75, 1.0, 0.5);  
} else {  
    reflectColor = vec3(1.0, 0.85, 0.3);  
}
```

```json
{  
  "name": "blast_proof_plates",  
  "glsl": "blast_proof_plates.glsl"  
}
```

After defining the deferred material above, it can be accessed via the following shader.

```glsl
materialMask = OSIEBCA * deferredMaterial("supplemental_patches:savage_and_ravage/blast_proof_plates"); // Lead Fresnel  
  
#ifdef GBUFFERS_TERRAIN  
    smoothnessG = 0.8 * pow2(max(color.r, color.g));  
#else  
    smoothnessG = 0.8 * max(color.r, color.g);  
#endif  
  
highlightMult = 2.5 * min1(smoothnessG);  
smoothnessD = smoothnessG;  
  
color.rgb *= 0.2 + 0.7 * GetLuminance(color.rgb);  
  
#ifdef COATED_TEXTURES  
    noiseFactor = 0.33;  
#endif
```