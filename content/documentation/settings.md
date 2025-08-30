---
title: Settings
---

Supplemental Patches allows new settings to be added to the settings page. The structure of the settings page is defined by the directory structure of the settings folder. All these settings are placed under the `Supplemental Patches Settings` button within the shaderpack.

A sample directory is below.

```
.
├── about
│     ├── info_1.json
│     └── info_2.json
├── caverns_and_chasms
│     ├── glowing_mime_energy.json
│     ├── glowing_silver_ore.json
│     ├── glowing_soul_silver_ore.json
│     └── glowing_spinel_ore.json
├── caverns_and_chasms.json
├── divider.json
├── doom_and_gloom
│     ├── fog
│     │     ├── aurora_visibility.json
│     │     ├── fog_bloom.json
│     │     ├── fog_intensity.json
│     │     └── sun_brightness.json
│     └── fog.json
├── doom_and_gloom.json
├── galosphere
│     ├── glowing_allurite.json
│     ├── glowing_lumiere.json
│     ├── glowing_pink_salt.json
│     ├── glowing_silver_ore.json
│     └── waving_rope.json
├── galosphere.json
├── general
│     ├── potion_effects.json
│     └── waving_rope.json
├── general.json
├── oreganized
│     ├── crystal_glass_opacity.json
│     ├── glowing_lead_ore.json
│     ├── glowing_silver_ore.json
│     ├── molten_lead
│     │     └── waviness.json
│     └── molten_lead.json
├── oreganized.json
├── quark
│     ├── glowing_oretortoise_mult.json
│     ├── oretortoise.json
│     └── situational_oretortoise.json
├── quark.json
├── shader_version.json
├── upgrade_aquatic
│     └── upgrade_aquatic.json
├── upgrade_aquatic.json
├── wetland_whimsy
│     └── glowing_bloodcap.json
├── wetland_whismy.json
├── yungs_cave_biomes
│     ├── sandstorm
│     │     ├── sandstorm_fog_bloom.json
│     │     ├── sandstorm_fog_intensity.json
│     │     └── sandstorm_waving_intensity.json
│     └── sandstorm.json
└── yungs_cave_biomes.json
```

Within each folder, there should be `.json` files and subfolders. There should be one `.json` file per subfolder to indicate information about that subfolder. Other settings are represented by a single `.json`.

The JSON parameters are as follows. **Bolded** and *italized* parameters are required.

- ***`type`*** - The type of setting. This is either `directory`, `info`, `setting` or `divider`.
- ***`name`*** - The name of the setting within the code. This will be used to reference the setting within your code. Typically, the naming convention is to have this entirely in UPPERCASE_LETTERS with underscores.
- ***`<language_code>`*** - The name of this parameter should be a language code, such as `en_US`, `zh_CN` or `ja_JP`. Under this parameter, there are other parameters that dependent on `type`. If not provided, the user-unfriendly `name` will be shown on screen.
- `priority` - The priority of the JSON. Higher priorities will be shown first on the screen. Settings with equal priority are sorted by alphabetical order of their `name`. 


More specific parameters are each `type` are below.

| Type        | Usage                                                                 | Parameters                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `directory` | Used to create subfolders to organise settings.                       | - ***`folder`*** - The name of the subdirectory this `.json` file is linked to.<br>- ***`<language_code>/screen`*** - The name of this settings folder within the shaderpack settings GUI.<br>- `<language_code>/comment` - A comment describing the settings within the folder. Will appear as a tooltip.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `info`      | Used to provide information about the shaderpack.                     | - ***`<language_code>/option`*** - The name of this information box within the shaderpack settings GUI.<br>- `<language_code>/comment` - A comment containing the information. Will appear as a tooltip.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `setting`   | Used to enable settings to be changed.                                | -`file` - The settings file the settings should be placed in. When not specified, defaults to `common.glsl`.<br>- `activation` - Determines if the setting be placed in the `activationSettings.glsl` file to be "activated". Should be set to `true` for boolean settings that are not used with a `#ifdef` statement within the shaderpack.<br><br>- `default` - The default value of the setting. Can be a number or a boolean.<br>- `conditions` - Conditions that can be placed to modify the default value of the setting. Do not use with `default`. Comes as a list of dictionaries with `if` (containing conditions)  and `then` (containing the value).<br><br>- `values` - Contains the values that the setting can take up. Not necessary if the setting can only be set to `true` and `false`.<br>- `slider` - Should the setting be a slider. Useful if there are a large number of values. If not, values will cycle when the setting button is clicked.<br><br>- ***`<language_code>/option`*** - The name of this setting within the shaderpack settings GUI.<br>- `<language_code>/comment` - A comment describing this setting. Will appear as a tooltip.<br>- `<language_code>/value.<value>` - Replace `<value>` with a value that the setting can take. Typically used for settings with a small number of options. |
| `divider`   | Used as a divider, to breakup the settings page into different parts. | - `dividers` - The number of empty spaces that the divider should take up. (default: `2`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |


## Examples

An example of a setting containing a small number of possible values.
```json
{  
  "type": "setting",  
  "name": "GLOWING_PINK_SALT",  
  "default": 2,  
  "values": [0, 1, 2, 3],  
  "en_US": {  
    "option": "Glowing Pink Salt",  
    "value.0": "§cOFF",  
    "value.1": "Cluster",  
    "value.2": "Cluster & Berserker",  
    "value.3": "Cluster & Berserker & Preserved"  
  }  
}
```

An example of using the `conditions` option.
```json
{  
  "type": "setting",  
  "name": "GLOWING_ORE_SILVER_G",  
  "conditions": [  
    {  
      "if": "GLOWING_ORE_MASTER == 2 || SHADER_STYLE == 4 && GLOWING_ORE_MASTER == 1",  
      "then": true  
    }  
  ],  
  "en_US": {  
    "option": "Glowing Silver Ore §e[*]§r",  
    "comment": "§e[*]§r This setting will only affect the silver ore added by Galosphere."  
  }  
}
```

An example of a slider.
```json
{  
  "type": "setting",  
  "name": "FOG_INTENSITY",  
  "default": 0.150,  
  "slider": true,  
  "values": [  
    0.025, 0.050, 0.075, 0.100,  
    0.125, 0.150, 0.175, 0.200,  
    0.225, 0.250, 0.275, 0.300  
  ],  
  "en_US": {  
    "option": "Fog Intensity",  
    "comment": "Determines intensity of the fog."  
  }  
}
```

An example of a setting that can only be set to either `true` or `false`.
```json
{  
  "type": "setting",  
  "name": "GLOWING_POTION_EFFECT",  
  "default": true,  
  "en_US": {  
    "option": "Glowing Potion Effects",  
    "comment": "Enables glowing potion effect particles."  
  }  
}
```

## Settings Files

In Euphoria Patches 1.6, settings files were introduced to decrease the time taken for the shader to recompile after settings are changed. Instead of placing all settings within `common.glsl`, the settings are instead placed in various files under `/lib/shaderSettings`, which are included where they are needed.

The list of default settings files is below:
- `bedrockNoise.glsl`  
- `bloom.glsl`  
- `blueScreen.glsl`  
- `clouds.glsl`  
- `cloudsAndLighting.glsl`  
- `colorMult.glsl`  
- `composite.glsl`  
- `composite2.glsl`  
- `composite3.glsl`  
- `composite5.glsl`  
- `deferred1.glsl`  
- `emissionMult.glsl`  
- `emissiveFlowers.glsl`  
- `endBeams.glsl`  
- `enderStars.glsl`  
- `entities.glsl`  
- `entityMaterials.glsl`  
- `final.glsl`  
- `interactiveFoliage.glsl`  
- `lightAndAmbientColors.glsl`  
- `longExposure.glsl`  
- `mainFog.glsl`  
- `mainLighting.glsl`  
- `materials.glsl`  
- `overworldBeams.glsl`  
- `raindropColor.glsl`  
- `settingsFileDefines.glsl`  
- `shockwave.glsl`  
- `stars.glsl`  
- `volumetricLight.glsl`  
- `water.glsl`  
- `wavingBlocks.glsl`  
- `worldMotionBlur.glsl`

### Custom Settings Files

New settings files can be specified using JSON files placed within the `euphoria/settings_files` folder.

The JSON parameters are as follows. **Bolded** and *italized* parameters are required.
- ***`name`*** - The name of the settings file. Should end in `.glsl`.
- `files` - A list of files the settings should be included in. For example, a settings file containing particle settings should be placed in `program/gbuffered_textured.glsl`.