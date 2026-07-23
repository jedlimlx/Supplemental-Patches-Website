
> [!info] Take Note
> 
> Please have a look at the [documentation](https://github.com/Redi2Go/PhotonicEngine/wiki/Documentation:-ph_lights.json) on the Photonics wiki for the `ph_light.json` file before continuing to understand how ray-traced lights are specified for Photonics.

# Defines

Within the `ph_light.json` file, which is how shaders communicate information about blocks to Photonics, variables may be created that can be referenced with `*variable`. To create such variables, you will need to create a `.json` file within the `photonics/defines` folder.

The file should take on the structure of the section which would be placed under the parameter `defines` in `ph_light.json`. For instance, 

```json
{
  "colors": {
    "example_color": "#ffffff",
    "example_color2": "rgb(1.0, 1.0, 1.0)"
  },
  "intensities": {
    "default": 1
  },
  "radii": {
    "default": 1
  },
  "falloffs": {
    "default": 1
  }
}
```

All files within this folder will be merged to form the final `defines` segment of the `ph_light.json` file.

# Light Groups

To ensure that the emissive blocks within your resource-pack are compatible with Photonics, you will need to create light-groups and assign the relevant blocks to them.

To create a light-group, you will need to create a `.json` file within the `photonics` folder (or a sub-folder).

## JSON Format

The structure of the final `ph_light.json` is hierarchal. All light groups inherit properties such as their `color`, `intensity`, `radius` and `falloff` from their parent groups. This hierarchal structure is represented in a series of nested folders with child light groups being placed in a sub-folder, whose name is specified in the `overrides` parameter. 

>[!note] Take Note
> The children of a sub-folder can be contained within different resource-packs as long as the path to the folder is the same. You are highly encouraged to have a look at the light groups available by default and place your custom light groups under an appropriate parent.

The parameters of these JSON files are as follows. **Bolded** and *italicized* parameters are required.

***`group`*** - The *unique* name of this light group. Ensure that it is *unique* as this is used within the material shaders to determine which light group the material will be added to.

`color`, `intensity`, `radius`, `falloff`, etc. - These parameters are added verbatim into `ph_light.json`. See the documentation on the Photonics wiki for more information. In the case where these may change with certain settings, they are be specified as follows,

```json
"intensity": {  
  "conditions": ["!defined GLOWING_EMERALD_BLOCK"],  
  "value": 0  
}
```

or in the case of multiple conditions (including a final `else`, which is indicated by the lack of a condition)

```json
"intensity": [  
  {  
    "conditions": ["EMISSIVE_REDSTONE_BLOCK"],  
    "value": "*full_block"  
  },  
  {  
    "value": "0"  
  }  
],
```

`overrides` - This specifies the sub-folder where all the child light groups are contained.

## Adding Blocks

There are two options for adding blocks to light groups. First, the relevant blocks can be added within the `blocks` parameter. This is used in the default `*.json` files that are used to reconstruct `ph_light.json`. However, this is not recommended.

The second way is to add the blocks via the `light_group` parameter within the material shader `.json` files. The format is identical to the format for specifying the blocklight colours, except that instead of identifying light groups through their resource path, they are identified directly by name.

For instance, to add blocks to light groups conditionally, the `conditions` are filled identically while `color` is renamed to `light_group`.

```json
{  
  ...
  "blocklight": {  
    "color": "supplemental_patches:enderscape/celestial_growth",  
    "conditions": [  
      "DO_IPBR_LIGHTS",  
      "GLOWING_CELESTIAL_GROWTHS"  
    ]  
  },  
  "light_groups": {  
    "group": "celestial_growth",
    "conditions": [  
	  "DO_IPBR_LIGHTS",  
	  "GLOWING_CELESTIAL_GROWTHS"  
	]  
  },
  ...
}
```

# Light Modifiers

By default, Euphoria Patches applies a handful of [light modifiers](https://github.com/Redi2Go/PhotonicEngine/wiki/Documentation:-Light-Modifier) such as a flickering effect on fire (requires ReSTIR mode). Supplemental Patches allows defines the following light modifiers by default:

| Name                    | Usage                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minecraft:flickering`  | Can be used on any block that should flicker. The same flickering settings are applied from Euphoria Patches are applied.                             |
| `minecraft:normal_fire` | Applies both the flickering effect and blocklight colour changes from Euphoria Patches' Soul Sand Valley Overhaul Option and Purple End Fire options. |

To specify these on various blocks, see the documentation on [opaque blocks](opaque_blocks) where the JSON parameter `light_modifiers` is documented.