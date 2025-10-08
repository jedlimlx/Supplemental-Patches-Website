---
title: Technical Changelog
---
## 0.6.0-beta

![[0.6.0-beta.png]]

**Fixes**
- Fixed the lack of emissivity on Spectres in Species
- Fixed the uncoloured sky-light during lunar events in Enhanced Celestials
- Fix issues where default value of uniforms is null and considered an unknown variable (by @[chililisoup](https://github.com/chililisoup))
- Fixed unexpected nonwhite token in `lumiere_composter.glsl`, `enderscape_nebula.glsl` (by @[chililisoup](https://github.com/chililisoup))

**Additions**
- Add support for the following mods
	- Cinderscapes
	- Enderscape (updated to 1.1.0)
	- Species
	- Aloof
	- Diamonds in the Rough
	- Beeten
	- Enhanced Celestials
- Add new option `reflection_handlers` to specify how opaque blocks should be handled during world-space reflection
- Add ability to inject new functions into `common_functions.glsl` which will be accessible everywhere
- Add `CIRRUS_CLOUDS` option to turn the second layer of unbound clouds into cirrus clouds
- Add new uniforms `moonSize`, `moonColor`, `skylightColor` to handle lunar events from Enhanced Celestials

**Changes**
- Updated to *Complementary Shaders 5.6 + Euphoria Patches 1.7.0*
- Updated to Minecraft 1.21.9
- Errors in the resourcepack and shaderpack are not outputted to the Minecraft chat
- Significantly improved time taken for patching with over 10x improvement (by @[chililisoup](https://github.com/chililisoup))

---
## 0.5.1-beta

<img src="assets/versions/0.5.1-beta.png">

**Fixes**
- Fix issues with IDs with `minecraft` namespace not properly replacing IDs in `*.properties` files
- Fix issue with regenerating shaders with keybinds on Fabric
- Replace all `endstone` with `endStone` so shaders will compile on case-sensitive filesystems (e.g. Linux) (thanks @Lightdrew)

**Additions**
- Add support for the following mods
	- Effective
	- Particular
	- Upgrade Aquatic (updated to 1.21.1)
- Add new waving function `minecraft:tall_waving_foliage_2` for foliage that glows (e.g. cave vines)

**Changes**
- System message is now outputted whenever the shaderpack is regenerated after a resource-pack reload


## 0.5.0-beta

<img src="assets/versions/0.5.0-beta.png">

**Fixes**
- Fix issues with Enderscape nebula shaders not working with older versions of OpenGL due to use of C-style initialisers

**Additions**
- Add `default` option for uniforms to enable specifying a default value for uniforms to take up if the conditions provided are not met.
- Add `layer.*` option for `block.properties.json` to allow specifying which blocks need to change the layer under which they are rendered (e.g. glass blocks).
- Add ability to inject code to modify ACL fog by placing files under `atmospherics/fog/acl_fogs`
- Add support for the following mods
	- Atmospheric
	- Autumnity
	- Berry Good
	- Environmental
	- Illager Expansion
	- Oh the Biomes We've Gone (including some biome-specific effects!)
	- Snowy Spirit
	- YUNG's Cave Biomes (updated to 1.21.1)
	- Wetland Whimsy (updated to 1.3)
	- End's Delight
- Add shaders for dragon charge from Amendments 2.0
- Added spiral reimagined clouds for magical biomes in BWG and Biomes O Plenty
- Add new setting `DO_DOOM_AND_GLOOM_FOG` to allow fog to be enabled even if Doom and Gloom is not installed

**Changes**
- Slightly improve look of ACL fog when Doom and Gloom Fog is enabled


---
## 0.4.1-beta

<img src="assets/versions/0.4.1-beta.png">

**Fixes**
- Fix issue with emissivity for Booflo Adolescent and Booflo Baby shaders
- Add missing Russian translations to Fabric version

**Additions**
- Add full Enderscape support for NeoForge
- Add new setting `ENDERSCAPE_ATMOSPHERE` which enables the revamped Enderscape atmosphere even when Enderscape is not installed

## 0.4.0-beta

<img src="assets/versions/0.4.0-beta.png">

**Fixes**
- Fixed issues with voxelization for translucent blocks
- Fixed issues with mod name not displaying properly on NeoForge 1.21.1

**Additions**
- Added support for the following mods
    - Biomes O Plenty
    - Enderscape (including custom skybox 👀)
- Add ability to add custom textures from resource-packs into the shaderpack
- Add ability to add custom skyboxes
- Add new option `dividers` for dividers in settings, to control the amount of whitespace occupied by the divider
- Add new option `activation` for boolean settings that are not used in any `#ifdef` or `#ifndef` statements within the shaderpack
- Add new uniforms `enderscapeNebulaColor`, `enderscapeNebulaAlpha` for the color and opacity of the Enderscape Nebula within the biome the player is currently in
- Add new constants for biomes in Biomes O Plenty and Enderscape
- Added Russian translations thanks to @**[mpustovoi](https://github.com/mpustovoi)**

**Changes**
- Updated to *Complementary Shaders 5.5.1 + Euphoria Patches 1.6.4*
- Built-in shaders have been moved to a built-in resourcepack that can be disabled (Fabric-only)
- Improvements to shaders for
    - Lumisene (Supplementaries)
    - Poise Cluster (Endergetic Expansion)

---
## 0.3.0-beta

<img src="assets/versions/0.3.0-beta.png">

**Fixes**
- Fixed shader compilation error when settings such as `COATED_TEXTURES` are enabled
- Fix some issues with block waving for various foliage
- Fix issues with tints working correctly
- Ensure that Iris / Oculus loads the shaderpack only *after* the list of mods is available

**Additions**
- Added support for the following mods
    - Jaden's Nether Expansion
    - My Nether's Delight
    - Pigsteel
    - Soulful Nether
- Added edge effect for Oreganized's Molten Lead and JNE's Ectoplasm
- Added new particle shaders for several particles such as
    - Hollering Souls (Doom & Gloom)
    - Poise Bubble (Endergetic Expansion)
    - Ancient Souls (Wetland Whimsy)
- Add new `block_size` parameter for material shaders, which allows the same GLSL code to be applied across more than 4 material IDs
- Add new uniform `betrayed` for Betrayal effect when Treacherous Candle is activated
- Add new constants for the biomes in Soulful Nether

**Changes**
- Updated to *Complementary Shaders 5.5.1 + Euphoria Patches 1.6.1*
- Optimize how different shaders are applied to particles
- Improvements to shaders for
    - Crystal Glass (Oreganized)
    - Corundum Cluster (Quark)

---
## 0.2.0-beta

<img src="assets/versions/0.2.0-beta.png">

**Fixes**
- Fixed crash on Fabric 1.21.4
- Fixed shaders for sonar waves for Upgrade Aquatic
- Fixed fade-out effect when Doom & Gloom's fog effect ends
- Fixed rendering of Holler from Doom & Gloom
- Fixed haunt uniforms for Trailier Tales
- Fixed rendering of item shaders within Supplementaries pedestals, item shelves, etc.
- Fixed issues with indentation when using shader mixins

**Additions**
- Added support for the following mods
    - Endergetic Expansion
    - Buzzier Bees
    - Rodspawn
    - Nears
    - Gipples Galore
    - Frostiful
    - Scorchful
- Added the uniform `scorchfulSandstorm` to identify where Scorchful's sandstorms take place
- Add experimental volumetric atmospheric effects features, which will continue to be fleshed out in future updates

**Changes**
- Changed uniforms `sandstorm` and `sandstormWindSpeed` to `yungSandstorm` and `yungSandstormWindSpeed`

---
## 0.1.0-beta

<img src="assets/versions/0.1.0-beta.png">

**Fixes**
- Fixed missing Thrasher tails from Upgrade Aquatic
- Fixed fog effect from Doom & Gloom
- Fixed sandstorm effect within Lost Caves from YUNG's Cave Biomes

**Additions**
- Added support for the following mods
    - Quark
    - Supplementaries
    - Twigs
    - Dye Depot
    - Galosphere
    - Upgrade Aquatic
    - Caverns & Chasms
    - Savage & Ravage
    - Oreganized
    - Doom & Gloom
    - Wetland Whimsy
    - YUNG's Cave Biomes
    - Friends & Foes
    - Enderman Overhaul
    - Farmer's Delight
    - Pearfection
    - Trailier Tales
- Added features to add custom shaders for
    - Blocks & Block Entities
    - Entities
    - Items
    - Particles
    - Fog
- Allow definition of custom ACL colors and tints
- Allow creation of custom waving motion for blocks / block entities
- Add ability to add custom uniforms and settings
- Add shader mixins to directly modify Euphoria Patches code through a resource-pack