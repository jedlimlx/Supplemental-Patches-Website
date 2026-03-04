---
title: Uniforms
---

Supplemental Patches adds several uniforms to Iris, which enable mod-specific effects to be created, such as Doom & Gloom's Fog effect.

A overview of uniforms added by Iris can be found at https://shaders.properties/current/reference/uniforms/overview/.

The list of uniforms added by Supplemental Patches can be found below. (note: for Fabric-specific mods, the uniforms will only load when on Fabric, until I figure out how to use Sinytra Connector)

| Uniform                      | Type    | Description                                                                                                                                                                                     | Value Range | Requires                 |
| ---------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------ |
| `yungSandstorm`              | `float` | Returns `0` if there is no sandstorm and `1` if there is.                                                                                                                                       | `0.0,1.0`   | YUNG's Cave Biomes       |
| `yungSandstormWindDirection` | `vec3`  | The wind direction of the sandstorm at the player's current position. <br><br>To be more specific, it is the updated velocity of a particle that started at rest at the position of the player. | `[0,∞)`     | YUNG's Cave Biomes       |
| `brainDamage`                | `float` | Amplifier of the brain damage effect in Oreganized                                                                                                                                              | `[0,9]`     | Oreganized               |
| `doomAndGloomfog`            | `float` | Returns `0` if there is no Fog and `1` if there is.                                                                                                                                             | `0.0,1.0`   | Doom & Gloom             |
| `haunt`                      | `float` | Strength of the haunt effect.                                                                                                                                                                   | `[0,1]`     | Trailier Tales           |
| `hauntFactor`                | `float` | Strength of dimming from the haunt effect.                                                                                                                                                      | `[0,1]`     | Trailier Tales           |
| `scorchfulSandstorm`         | `int`   | Returns the type of sandstorm that is experienced in the biome that the player is currently in.<br><br>`0` - No sandstorms<br>`1` - Regular sandstorms<br>`2` - Red sandstorms<br>              | `0,1,2`     | Scorchful                |
| `betrayed`                   | `float` | Returns `0` if there is no betrayed effect and `1` if there is.                                                                                                                                 | `0.0,1.0`   | Jaden's Nether Expansion |
| `enderscapeNebulaColor`      | `vec3`  | The color of the nebula within current biome.                                                                                                                                                   | `[0,255]`   | Enderscape               |
| `enderscapeNebulaAlpha`      | `float` | The opacity of the nebula within the current biome.                                                                                                                                             | `[0, 1]`    | Enderscape               |
| `enderscapeStarColor`        | `vec3`  | The color of the End stars within current biome.                                                                                                                                                | `[0,255]`   | Enderscape               |
| `enderscapeFlashColor`       | `vec3`  | The color of the End Flash within current biome.                                                                                                                                                | `[0,255]`   | Enderscape               |
| `enderscapeStarAlpha`        | `float` | The opacity of the End stars within the current biome.                                                                                                                                          | `[0, 1]`    | Enderscape               |
| `moonSize`                   | `float` | The moon size for the given lunar event that is occuring. The default size of the moon is 20.                                                                                                   | `[0,∞)`     | Enhanced Celestials      |
| `moonColor`                  | `vec3`  | The colour of the moon for the given lunar event that is occuring.                                                                                                                              | `[0.0,1.0]` | Enhanced Celestials      |
| `skylightColor`              | `vec3`  | The colour of the skylight for the given lunar event that is occuring.                                                                                                                          | `[0.0,1.0]` | Enhanced Celestials      |

## Mod Detection

Supplemental Patches supports detection of whether a given mod is installed using compiler directions. The constants are added in the format of `MOD_<UPPERCASE_MOD_ID>`. This works for all mods.

## Modded Biomes

Supplemental Patches also supports biome detection from all mods. 

However, as the full list of biomes is only available once the world has been loaded, only biomes from the mods below are supported directly through Iris' [`biome`](https://shaders.properties/current/reference/uniforms/biome/) uniform and will not require a shader reload upon entering the world to function properly. To identify biomes from these mods, a constant in the format `BIOME_<UPPERCASE_BIOME_ID>` is added for each biome.

- Atmospheric
- Autumnity
- Endergetic Expansion
- Enderscape
- Environmental
- Galosphere
- Jaden's Nether Expansion
- Soulful Nether
- Neapolitan
- Spawn
- Soulful Nether
- Wetland Whimsy
- YUNG's Cave Biomes

Biomes from other mods will require a shader reload to upon joining the world, in order for the relevant constants, in the format `MOD_BIOME_<UPPERCASE_BIOME_ID>` to be added. In addition, they should be checked against a new uniform `modded_biomes`.

## Adding Uniforms

In order to add uniforms that can be used inside the other code within the resource-pack, you will need to create a `.json` file within a folder named `uniforms`.

An example is shown below, which detects if a player is within the Lost Caves biome added by YUNG's Cave Biomes.
```json
{  
  "type": "float",  
  "name": "inLostCaves",  
  "code": "smooth(54, if(in(biome, BIOME_LOST_CAVES), 1, 0), 15, 15)",  
  "conditions": [  
    "MOD_YUNGSCAVEBIOMES"  
  ]  
}
```

The following are the parameters specified in the JSON. **Bolded** and *italicized* parameters are required.

- ***`type`*** - The type of the uniform.
- ***`name`*** - The name of the uniform.
- `code` - The custom uniform code (if the uniform is a custom uniform). Will be injected into `shader.properties`. See [this](https://shaders.properties/current/reference/shadersproperties/custom_uniforms/) for more information on custom uniforms.
- `default` - The default value for this uniform.
- `conditions` - A list of conditions for the uniform to be used (e.g. if a mod is installed).


## Cobblemon IDs

Supplemental Patches adds the ability to give Cobblemon custom shaders using their showndown IDs. This can be done using [entity shaders](entities.md). The entity IDs in this case are the showdown IDs of the Cobblemon (e.g. `cobblemon:mr_mime`). This unfortunately does not allow distinguishing between different forms and regional variants. Support for that will come in a later update.