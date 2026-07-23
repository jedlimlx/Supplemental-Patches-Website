---
title: Mixins
---
Sometimes, you need fine-grained control over what code is patched into Euphoria Patches. This is where mixins come in. In order to define mixins, you will need 
- a `.glsl` file to store shader code that will be patched in and 
- a `.json` file to locate the area where the GLSL code is patched

These files should be placed under the `mixins` folder.

## JSON Format

The following are the parameters specified in the JSON. They are all required.

**`file`** - This is the path to the GLSL file in which code should be patched. It should begin with `/shader`.
**`type`** - This is one of `after`, `before` and `replace`. This determines how the code is placed with respect to the `key`.
`key` - This determines the location where the code is patched.
`code` - The path of the GLSL file where the code to be patched is stored.
`regex` - Defaults to `false`. If set to `true`, a regex expression may be placed into the parameter `key`.

## Examples

Consider the following segment of code from `/shaders/program/gbuffers_terrain.glsl`.

```glsl
int subsurfaceMode = 0;
bool noSmoothLighting = false, noDirectionalShading = false, noVanillaAO = false, centerShadowBias = false, noGeneratedNormals = false, doTileRandomisation = true, isFoliage = false;
float smoothnessG = 0.0, highlightMult = 1.0, emission = 0.0, noiseFactor = 1.0, snowFactor = 1.0, snowMinNdotU = 0.0, noPuddles = 0.0, overlayNoiseIntensity = 1.0, snowNoiseIntensity = 1.0, sandNoiseIntensity = 1.0, mossNoiseIntensity = 1.0, overlayNoiseTransparentOverwrite = 0.0, overlayNoiseEmission = 1.0, IPBRMult = 1.0, lavaNoiseIntensity = LAVA_NOISE_INTENSITY, enderDragonDead = 1.0;
vec2 lmCoordM = lmCoord
vec3 normalM = normal, geoNormal = normal, shadowMult = vec3(1.0);
vec3 worldGeoNormal = normalize(ViewToPlayer(geoNormal * 10000.0));
vec3 dhColor = vec3(1.0);
float purkinjeOverwrite = 0.0;
```

Suppose add a new parameter `fogOverride`, that can be modified within my terrain shaders. The only way to do this would be using a mixin. We can do this using the following JSON file and GLSL file.

```json
{  
  "file": "/shaders/program/gbuffers_terrain.glsl",  
  "type": "after",  
  "key": "float purkinjeOverwrite = 0.0;",  
  "code": "add_fog_override.glsl"  
}
```

```glsl
float fogOverride = 0.0;
```

This will insert the line `float fogOverride = 0.0;` just below `float purkinjeOverwrite = 0.0;`.