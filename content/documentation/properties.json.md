---
title: "*.properties.json"
---

In order to add modded blocks, entities and items to IDs from Euphoria Patches within your resource-pack, make use of `*.properties.json`. These are placed within the `euphoria/` folder.

There are 3 files within this category:
- `block.properties.json`
- `entity.properties.json`
- `item.properties.json`

## JSON Format

The following are the parameters specified in the JSON.

`remove` - IDs that should be removed from any ID within Euphoria Patches' `block.properties`, `entity.properties` and `item.properties`. It must match the exact blockstate (for blocks). Regex is allowed.

`<type>.<id>` - The type here is either `block`, `entity` or `item` and the ID is the ID the object should be added to. This key should correspond to a list of stuff to add to that ID. The IDs can be found within Euphoria Patches' `block.properties`, `entity.properties` and `item.properties`

`layer.<layer>` - This is only applicable for `block.properties.json`. It changes which render-layer the block is placed under. This is useful for blocks like glass, which may not be rendered as translucent. See Euphoria Patches' `block.properties` for more information.