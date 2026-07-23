---
title: Textures
---

Supplemental Patches allows custom textures to be added to the shaderpack from within the resource-pack or from other resource-packs. This takes advantage of the custom texture feature provided by Iris, documented [here](https://shaders.properties/current/reference/buffers/custom_textures/).

This is achieved by adding a JSON file to the `textures` folder.

## JSON Format

The following are the parameters specified in the JSON. **Bolded** and *italicized* parameters are required.

***`texture`*** - The path to the texture that will be added to the resource pack.
***`name`*** - The variable name the texture should be accessed by within the shader code. <br>
`conditions` - A list of conditions describing when the texture should be added to the shaderpack.

### Examples

```glsl
{  
  "texture": "enderscape:textures/environment/nebula1.png",  
  "name": "nebula1",  
  "conditions": [  
    "MOD_ENDERSCAPE"  
  ]  
}
```

This adds the nebula texture from Enderscape to the shaderpack, under the name `nebula1`, when the Enderscape mod is installed.