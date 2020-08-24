# DruidShift Improved v1.0
> This Roll20 API script allows for easy Wild Shape and Shapeshifting. 

It is an improved version of the original DruidShift script by [**Bastlifa**](https://github.com/Bastlifa) and provides more functionality, as well as compatibility with the new Updated Dynamic Lighting system.

Improvements and script update by [**davidtheday**](https://github.com/davidtheday)

## Script Info

So how does this script work? It updates a selected character token with a chosen creature, changing its appearance, token size, and character sheet stats.

This script builds off the amazing script written by Bastlifa.

While it is possible to use this script with simple chat commands, it is recommended to use one
of the macros provided. There are options for rollable tables, as well as 
dropdown queries. If you modify the creature list, the macros will need to be edited to reflect
those changes. See more in [Section 2.2](#-22-edit-macros). 

### Original script info by Bastlifa:

This is for the 5E OGL sheet in Roll20. It will probably not work with any others without some modification. Also, I didn't do much in the way of error checking.

## Changelog
**Changes made as of 2020-08-19 (davidtheday)**:
- Updated instructions and moved them to this readme file
- Removed the if statements for each creature and replaced it with JSON object named `druidObject`. This:
  1. clears up the code for readability and ease of modification, and
  2. cuts down on the amount of checks being made to determine what creature to Wild Shape into
- Added the entire 5E SRD beast list to druidObject to start everyone off with a good number of creatures.
- Created six macros that contain a list of all 5E SRD beasts. Two are dropdown queries that are sorted by Challenge Rating or alphabetically. The other four are rollable tables and are sorted by Challenge Rating or alphabetically, with two different flavors (long or condensed). They still contain the cute emojis that Bastlifa included in their original macro ;-)
- Added a configuration section to the script for ease of modification, this includes options for:
  - Druid's name
  - Druid's darkvision stat
  - Enabling/disabling the Legacy Dynamic Lighting trick of dimming darkvision to -5
  - Enabling/disabling the "All Players See Light" option
  - Ability to create a custom prefix for the creature's character names
  - Ability to enable/disable the creation of a macro for custom creatures
  - Enabling/disabling the Shifted Creature stats change feature (see below)
- Added optional feature to updated the Shifted Creature's Int, Wis, and Cha stats with the druid's. When the druid changes back, the original stats are restored. This is useful if there's only one druid in the group, but if there are multiple, and they try to use the same creature, stats could be wrong. See [Section 1.9](#-19-multiple-druids) for more info.
- Various updates to the code allowing the above configuration options to work
- Some code cleanup

## Table of Contents
[How to Use / Instructions](#how-to-use--instructions)
- [1.0 Configuration of this Script](#10-configuration-of-this-script)
  - [1.1 Configuration of this Script](#11-druid-name)
  - [1.2 Druid Darkvision](#12-druid-darkvision)
  - [1.3 Dynamic Lighting Options](#13-dynamic-lighting-options)
  - [1.4 Character Prefix](#14-character-prefix)
  - [1.5 Stats Change](#15-stats-change)
  - [1.6 Shift Macro](#16-shift-macro)
  - [1.7 Shift Macro Token Action](#17-shift-macro-token-action)
  - [1.8 Adding Creatures to Script](#18-adding-creatures-to-script)
  - [1.9 Multiple Druids](#19-multiple-druids)
- [2.0 Creature Setup](#20-creature-setup)
  - [2.1 Adding Creatures to Journal](#21-adding-creatures-to-journal)
  - [2.2 Edit Macros](#22-edit-macros)
  - [2.3 Stats Change and Multiple Druids](#23-stats-change-and-multiple-druids)
- [3.0 Using Custom Creature Characters](#30-using-custom-creature-characters)
  - [3.1 Multiple Druids](#19-multiple-druids)
[Known Issues](#known-issues)
[Todo](#todo)


## How to Use / Instructions

### 1.0 Configuration of this Script

If you're comfortable with JavaScript or other scripting languages, this will be a breeze for you. With that said, these instructions are a little more detailed than they need to be for those of you who aren't as experienced and may need a little extra help.

### 1.1 Druid Name
Change the value of `druidCharName` to the player character's druid name, exactly as it is written in the journal.

*Example 1*: `var druidCharName = "Gaius Stillwater";`

*Example 2*: `var druidCharName = "Johnny Treehugger";`

### 1.2 Druid Darkvision
Change the value of `druidDarkvision` to the player character's darkvision stat in feet. If the player does not have darkvision, use `0`.

It's an integer, so don't use quotes.

*Example 1*: `var druidDarkvision = 60;`

*Example 2*: `var druidDarkvision = 0;` 

### 1.3 Dynamic Lighting Options

**1.3.1 Darkvision Trick**

Change the value of `druidDynamicLighting` to `true` if you're using Legacy Dynamic Lighting and you wish to use the "trick" of setting "dim_radius" to -5 for a more accurate representation. Otherwise, use `false`.

**1.3.2 All Players See Light**

Change the value of `druidOtherPlayersLight` to `true` if you're using Legacy Dynamic Lighting and you wish for all players to see what the druid can see. Otherwise, use `false`. 

*Suggested: If you run a relaxed game where your players can see what all player characters can see, set this option to `true`. If you run a strict game where your players can only see what their character can see, set this option to `false`.*

### 1.4 Character Prefix
Change the value of `druidPrefix` to the prefix you would like to use with the creature characters being shifted into. More info on this below in [Section 2.1](#-21-adding-creatures-to-journal).

*Example 1*: `var druidPrefix = "Druid";`

*Example 2*: `var druidPrefix = "Shapeshifter";`

### 1.5 Stats Change
Change the value of `druidStatsChange` to `true` if you want the druid character's *Int*, *Wis*, and *Cha* stats to transfer to the Shifted Creature's character sheet as per 5E SRD Rules. Otherwise, use `false`.
    
**Important**: *if you have multiple druid/shapeshifting characters, this feature can cause a conflict if they attempt to use the same creature. Solution is mentioned below in [Section 1.9](#-19-multiple-druids)*

### 1.6 Shift Macro
Change the value of `druidMacro` to `true` if you wish a macro to be created when a player uses the custom creature feature. Otherwise, use `false`.

### 1.7 Shift Macro Token Action
Change the value of `druidMacroTokenAction` to `true` if you wish the custom creature macro to be available as a token action to players. If you don't want all players to have access to this, you will have to specific which characters have access under the Macros section of the Collections tab.

### 1.8 Adding Creatures to Script
The entire list of beasts from the 5E SRD is included in this script, however, if you wish to add creatures for your players to shift into. Use the format:
    
`"!DSCreatureName": ['Creature Name', 'Size', darkvision range in ft.]`

*Example 1*: `"!DSCaveBear": ['Cave Bear', 'Large', 60],`

*Example 2*: `"!DSBlinkDog": ['Blink Dog', 'Normal', 0],`

For `'Size'`, use `'Normal'` for medium creatures and below. Other size options include `'Large'`, `'Huge'`, and `'Gargantuan'`

Enter the darkvision range in ft. without quotes.

**Important**: *Do not start the !DS tag of any creature (besides the druid player) with !DSBaseChar or it will not recognize the creature. The only exception is if you need multiple druid/shapeshifters to access this script. In that case, see [Section 1.9](#-19-multiple-druids) below for details.*

### 1.9 Multiple Druids
If you wish for multiple Druid characters to use this script, you must add a new `!DSBaseChar` entry to the druidObject block below, and use a number as a suffix, e.g.:
```
"!DSBaseChar2": ['Character ABC', 'Normal', 0],
"!DSBaseChar3": ['Character XYZ', 'Normal', 60],
```
    
An additional example is commented out in the `druidObject` so you can see its usage.
    
Be sure to use `!DSBaseChar` + number suffix (no spaces), otherwise this script will search for a character with the `druidPrefix`. For example it will search for "Druid Johnny Treehugger" instead of just "Johnny Treehugger".
    
**Important**: *Do not edit the default `!DSBaseChar` entry that is in `druidObject`. It is linked to configuration options, and modifying this could break the script.*

## 2.0 Creature Setup

This process involves creating creature characters in your journal.

### 2.1 Adding Creatures to Journal
Any creature that you wish a druid to shift into must be created by the GM as a character in the journal.

The name of this character must be prefixed with the `druidPrefix` that is set in the configuration.

For example, if you use the default prefix "Druid", any creature wanting to be used for this script should be named "Druid Creature Name Here". For example, the creatures above in [Section 1.8](#-18-adding-creatures-to-script) would need characters named:

*Example 1*: "Druid Cave Bear"

*Example 2*: "Druid Blink Dog"

**Suggestion**: If a given creature for shifting already exists, the GM should duplicate it, rename it using the `druidPrefix`, and assign it to the druid player.

**Important**: *Images used for characters and creatures must be from your uploaded library. Images directly from the compendiums will not work and will break the script due to how the API works. Read more: [imgsrc and avatar property restrictions](https://wiki.roll20.net/API:Objects#imgsrc_and_avatar_property_restrictions)*

If you wish to use the images from a compendium, however, simply open a creature from a compendium, then right-click the image and select "save as". Then upload the image to your library and use accordingly.

### 2.2 Edit Macros

The full 5E SRD beast list is included in the provided macros, which is a very long list. It is recommended you customize one of the macros to only include the creatures that your druid can shift into. This is especially true if you use a rollable table macro, since the entire 5E beast list fills up the chat window. 

**2.2.1 How to Edit Macros (Dropdown Query)**
    
For query drop down menus, the macro should start with `?{` followed by a title for the dropdown, then the drop down options, and finally ending with `}`
Example:
```
?{
Title here:
<options here>
}
```

For the query drop down options, put each option on its own line and use the following format:

`|Name Of Creature,!DSNameOfCreature`

1. Start with a `|` character
2. Followed by how you want the name to be displayed in the drop down
3. Then a comma, immediately (no spaces) followed by:
4. The `!DS` tag associated with the creature from the `druidObject` list

Make sure you include `!DSBaseChar` in any list, or your players won't be able to change back into their original form.

If you're modifying an example macro, it is recommended to leave the first option alone, as it contains additional code to display the name of the druid character assigned to that creature. 

*Example*: 
```
?{
Wildshape Forms:
|Druid Form (@{selected|token_name}),!DSBaseChar
|Cave Bear,!DSCaveBear
|Blink Dog,!DSBlinkDog
}
```

**2.2.2 How to Edit Macros (Rollable Table)**

For rollable tables, use the following macro (example assumes the druid's name is *Johnny Treehugger*):
```
/w "Johnny Treehugger" &{template:npcaction} {{name=Shift}} {{rname=Forms}} {{description=[Johnny Treehugger Form](!DSBaseChar)
[Cave Bear](!DSCaveBear)
[BlinkDog](!DSBlinkDog)
}}
```

You can use the format `[Creature Name](!DSCreatureName)` to add more creatures to this list.

Alternatively, you can use the following format to whisper the rollable table to a selected character. If you use this, make sure your player selects their token before using the macro.

```
/w @{selected|token_name} &{template:npcaction} {{name=Shift}} {{rname=Forms}} {{description=[@{selected|token_name} Form](!DSBaseChar)
[Cave Bear](!DSCaveBear)
[BlinkDog](!DSBlinkDog)
}}
```

### 2.3 Stats Change and Multiple Druids

If you're using the Stats Change feature AND you have multiple players that want to use this script you will need to create duplicate creatures for any creature forms that are common between the two players, as well as update the `druidObject` pointing to these duplicate creture characters.

If these steps aren't taken, the players will both be writing character stats to the same creature, but only the most recent shifted player's stats will show, since the previous player's stats have now been overwritten.

For example, if "Johnny Treehugger" and "Gaius Stillwater" both want to shift into a Cave Bear, make sure you have two entries in the `druidObject`, as well as create two separate Cave Bear creature characters in the journal.

For example, update the `druidObject` like so:
```
"!DSCaveBear": ['Cave Bear (Johnny)', 'Large', 60],
"!DSCaveBear2": ['Cave Bear (Gaius)', 'Large', 60],
```
Then create your creature characters in the journal:

*Example 1*: "Druid Cave Bear (Johnny)"

*Example 2*: "Druid Cave Bear (Gaius)"

Instruct your players to shift into the Cave Bear entry with their name.

## 3.0 Using Custom Creature Characters

### 3.1 Custom Creature Character How To

There may come a time during your sessions where you need to create a creature on the fly for a player. You can do so without the need to update the API script by using the custom creature chat command.

Create a creature character in your journal as you do for any other creature (using the correct creature name syntax as described in [Section 2.1](#-21-adding-creatures-to-journal)) and assign it to your druid character.

*Example*: "Druid Blink Dog"

Then have your druid player type `!DSCustom,Name of Creature (without the prefix),Size,Darkvision`

*Example 1*: `!DSCustom,Blink Dog,Normal,0`

*Example 2*: `!DSCustom,Cave Bear,Large,60`

**Important**: *Do not use spaces after the commas or the script will break. You may, however, use spaces in the creature's name (as long as they are not immediately after the comma).*

## Known Issues

- If you drop a compendium entry onto a creature's character sheet more than once, the stats feature does not work. This has something to do with the drop_data attribute and needs to be looked at further.

## Todo
1. Strip the custom creature string elements so spaces can be used without breaking the script.
2. Make this script character sheet agnostic so it can be used in any game system
   - Remove/replace any 5e OGL sheet direct references
   - Make stat change code dynamic so it can be used between game systems
3. Make compatible with Updated Dynamic Lighting