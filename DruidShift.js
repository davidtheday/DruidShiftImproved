/**************************************** Druid Shift Improved ****************************************

This Roll20 API script allows for easy Wild Shape and Shapeshifting. 

It is an improved version of the original DruidShift script by Bastlifa (https://github.com/Bastlifa) 
and provides more functionality, as well as compatibility with the new Updated Dynamic Lighting (UDL) system.

Improvements made by davidtheday (https://github.com/davidtheday)

Please refer to the README file for instructions and other script info.

******************************************************************************************************/


on("ready", function() {
    
    /************************************ CONFIGURATION **********************************************/

    // Enter your character's name and darkvision stats here
    var druidCharName = "Gaius Stillwater";
    var druidDarkvision = 60; 

    // This appends the name of the shifted form to the end of a character's nameplate
    // e.g. "Gaius Stillwater (Brown Bear)"
    // Set this as true if you want the shifted form's name appended to the end of the nameplate
    // Set this as false if you just want the character's name
    var druidFormAppend = true;

    // Use the Legacy Dynamic Lighting darkvision trick of setting the "dim start" value to -5 
    // Change this to false if you don't want to use it
    var druidLDLtrick = true;
    var druidUDL = true;

    // This sets whether or not the light from "Emits Light" settings is visible to others when 
    // using Legacy Dynamic Lighting.
    // Set this as false if you don't want other players to see what the Druid sees
    // Set this to true if you want others to see what the Druid sees
    var druidOtherPlayersLight = false;

    // This is the prefix for your custom Wild Shape creature characters.
    // When creating creature characters as described in the instructions above,
    // make sure they begin with the prefix below.
    // Default is "Druid", but can be changed to suit your organizational needs
    var druidPrefix = "Druid"; 

    // This enables/disables the shifted creature's Int, Wis, and Cha stats to change to the druid's, per 5E Rules.
    // There will be stat conflicts if you have multiple druids trying to shift into the same creature.
    // See instructions above for more details and how to avoid conflicts.
    // Set to true if you want the shifted creature's stats to change
    // Set to false if you do not want the shifted creature's stats to change
    var druidStatsChange = true; 

    // When a custom creature is used, this determines whether or not this script creates a macro for
    // Wild Shaping into the custom creature. This can be handy so players don't need to 
    // type the custom creature API call (e.g. !DSCustom,Camel,Large,0) every time they want to Wild Shape
    // into that creature. 
    // Set druidMacro to true to create a macro for custom creatures.
    // Set druidMacro to false to disable macro creation.
    // Set druidMacroTokenAction to true if you want to make it available as a token action, otherwise set to false
    var druidMacro = true;
    var druidMacroTokenAction = true; 

    // Below in the druidObject are the creatures that the Druid(s) can Wild Shape into.
    // You can add creatures to this block, by using the following format:
    //
    // "!DSCreatureName": ['Creature Name', 'Size', darkvision range in ft.] 
    //
    // Examples:
    //
    // "!DSCaveBear": ['Cave Bear', 'Large', 60],
    // "!DSBlinkDog": ['Blink Dog', 'Normal', 0],
    //
    // For 'Size', use 'Normal' for medium creatures and below.
    // Other size options include 'Large', 'Huge', and 'Gargantuan'
    //
    // !! MULTIPLE DRUIDS / SHAPESHIFTERS !!
    //
    // If you wish for multiple Druid characters to use this script, 
    // you must add a new !DSBaseChar entry to the druidObject block below,
    // and use a number as a suffix, e.g.:
    //
    // "!DSBaseChar2": ['Other Character A', 'Normal', 0],
    // "!DSBaseChar3": ['Other Character B', 'Normal', 60],
    // 
    // An additional example is commented out in the druidObject so you can see its placement
    //
    // Be sure to use !DSBaseChar + number suffix (no spaces), otherwise this script will search
    // for a character with the druidPrefix, for example:
    // "Druid Treehugger John" instead of just "Treehugger John")
    //
    // Do not edit the original !DSBaseChar entry that is already included below
    // It is linked to the configuration options that are set above.

    const druidObject = {
        // Wild Shape player characters
        "!DSBaseChar":              [druidCharName, 'Normal', druidDarkvision],
        //"!DSBaseChar2":           ["Joey Naturelover", 'Normal', 30],

        // Wild Shape creatures
        // CR 0:
        "!DSBaboon":                ['Baboon', 'Normal', 0],
        "!DSBadger":                ['Baboon', 'Normal', 30],
        "!DSBat":                   ['Bat', 'Normal', 60],
        "!DSCat":                   ['Cat', 'Normal', 0],
        "!DSCrab":                  ['Crab', 'Normal', 30],
        "!DSDeer":                  ['Deer', 'Normal', 0],
        "!DSEagle":                 ['Eagle', 'Normal', 0],
        "!DSFrog":                  ['Frog', 'Normal', 30],
        "!DSGiantFireBeetle":       ['Giant Fire Beetle', 'Normal', 30],
        "!DSGoat":                  ['Goat', 'Normal', 0],
        "!DSHawk":                  ['Hawk', 'Normal', 0],
        "!DSHyena":                 ['Hyena', 'Normal', 0],
        "!DSJackal":                ['Jackal', 'Normal', 0],
        "!DSLizard":                ['Lizard', 'Normal', 30],
        "!DSOctopus":               ['Octopus', 'Normal', 30],
        "!DSOwl":                   ['Owl', 'Normal', 120],
        "!DSQuipper":               ['Quipper', 'Normal', 60],
        "!DSRat":                   ['Rat', 'Normal', 30],
        "!DSRaven":                 ['Raven', 'Normal', 0],
        "!DSScorpion":              ['Scorpion', 'Normal', 10],
        "!DSSeaHorse":              ['Sea Horse', 'Normal', 0],
        "!DSSpider":                ['Spider', 'Normal', 30],
        "!DSVulture":               ['Vulture', 'Normal', 0],
        "!DSWeasel":                ['Weasel', 'Normal', 0],
        // CR 1/8:
        "!DSBloodHawk":             ['Blood Hawk', 'Normal', 0],
        "!DSCamel":                 ['Camel', 'Normal', 0],
        "!DSFlyingSnake":           ['Flying Snake', 'Normal', 10],
        "!DSGiantCrab":             ['Giant Crab', 'Normal', 30],
        "!DSGiantRat":              ['Giant Rat', 'Normal', 60],
        "!DSGiantWeasel":           ['Giant Weasel', 'Normal', 60],
        "!DSMastiff":               ['Mastiff', 'Normal', 0],
        "!DSMule":                  ['Mule', 'Normal', 0],
        "!DSPoisonousSnake":        ['Poisonous Snake', 'Normal', 10],
        "!DSPony":                  ['Pony', 'Normal', 0],
        "!DSStirge":                ['Stirge', 'Normal', 60],
        // CR 1/4:
        "!DSAxeBeak":               ['Axe Beak', 'Large', 0],
        "!DSBoar":                  ['Bat', 'Normal', 0],
        "!DSConstrictorSnake":      ['Constrictor Snake', 'Large', 10],
        "!DSDraftHorse":            ['Draft Horse', 'Large', 0],
        "!DSElk":                   ['Elk', 'Large', 0],
        "!DSGiantBadger":           ['Giant Badger', 'Normal', 30],
        "!DSGiantBat":              ['Giant Bat', 'Large', 60],
        "!DSGiantCentipede":        ['Giant Centipede', 'Normal', 30],
        "!DSGiantFrog":             ['Giant Frog', 'Normal', 30],
        "!DSGiantLizard":           ['Giant Lizard', 'Large', 30],
        "!DSGiantOwl":              ['Giant Owl', 'Large', 120],
        "!DSGiantPoisonousSnake":   ['Giant Poisonous Snake', 'Normal', 10],
        "!DSGiantWolfSpider":       ['Giant Wolf Spider', 'Normal', 60],
        "!DSPanther":               ['Panther', 'Normal', 0],
        "!DSRidingHorse":           ['Riding Horse', 'Large', 0],
        "!DSWolf":                  ['Wolf', 'Normal', 0],
        // CR 1/2:
        "!DSApe":                   ['Ape', 'Normal', 0],
        "!DSBlackBear":             ['Black Bear', 'Normal', 0],
        "!DSCrocodile":             ['Crocodile', 'Large', 0],
        "!DSGiantGoat":             ['Giant Goat', 'Large', 0],
        "!DSGiantSeaHorse":         ['Giant Sea Horse', 'Large', 0],
        "!DSGiantWasp":             ['Giant Wasp', 'Normal', 0],
        "!DSReefShark":             ['Reef Shark', 'Normal', 30],
        "!DSWarhorse":              ['Warhorse', 'Large', 0],
        // CR 1:
        "!DSBrownBear":             ['Brown Bear', 'Large', 0],
        "!DSDireWolf":              ['Dire Wolf', 'Large', 0],
        "!DSGiantEagle":            ['Giant Eagle', 'Large', 0],
        "!DSGiantHyena":            ['Giant Hyena', 'Large', 0],
        "!DSGiantOctopus":          ['Giant Octopus', 'Large', 60],
        "!DSGiantSpider":           ['Giant Spider', 'Large', 60],
        "!DSGiantToad":             ['Giant Toad', 'Large', 30],
        "!DSGiantVulture":          ['Giant Vulture', 'Large', 0],
        "!DSLion":                  ['Lion', 'Large', 0],
        "!DSTiger":                 ['Tiger', 'Large', 60],
        // CR 2:
        "!DSGiantBoar":             ['Giant Boar', 'Large', 0],
        "!DSGiantConstrictorSnake": ['Giant Constrictor Snake', 'Huge', 10],
        "!DSGiantElk":              ['Giant Elk', 'Huge', 0],
        "!DSHunterShark":           ['Hunter Shark', 'Large', 30],
        "!DSPlesiosaurus":          ['Plesiosaurus', 'Large', 0],
        "!DSPolarBear":             ['Polar Bear', 'Large', 0],
        "!DSRhinoceros":            ['Rhinoceros', 'Large', 0],
        "!DSSaberToothedTiger":     ['Saber-Toothed Tiger', 'Large', 0],
        // CR 3:
        "!DSGiantScorpion":         ['Giant Scorpion', 'Large', 60],
        "!DSKillerWhale":           ['Killer Whale', 'Huge', 120],
        // CR 4:
        "!DSElephant":              ['Elephant', 'Huge', 0],
        // CR 5:
        "!DSGiantCrocodile":        ['Giant Crocodile', 'Huge', 0],
        "!DSGiantShark":            ['Giant Shark', 'Huge', 60],
        "!DSTriceratops":           ['Triceratops', 'Huge', 0],
        // CR 6:
        "!DSMammoth":               ['Mammoth', 'Huge', 0],
        // CR 7:
        "!DSGiantApe":              ['Giant Ape', 'Huge', 0],
        // CR 8:
        "!DSTyrannosaurusRex":      ['Tyrannosaurus Rex', 'Huge', 0]
    }

    /******************************************* END CONFIG ******************************************
    
    An ominous cackle emanates from the depths of your computer screen.
    
    It warns, "Edit below at your own peril!"

    ...

    Just kidding! But seriously, unless you're customizing this script, don't touch below.

    *******************************************************************************************/
    
    var getCleanImgsrc = function (imgsrc) {
        var parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    };
    
    on("chat:message", function (msg) {
        
        var druidDimStart = 0;

        // Checks to make sure it's an API chat message, that it's NOT requesting a custom creature, and that it's a creature that DOES exist in druidObject
        if(msg.type === "api" && msg.content.split(',')[0] !== "!DSCustom" && druidObject.hasOwnProperty(msg.content)){
            
            // If GM wants to use the legacy Dynamic Lighting trick for darkvision
            if (druidObject[msg.content][2] > 0 && druidLDLtrick == true) {
                druidDimStart = -5;
            } else {
                druidDimStart = 0;
            }

            // Checks to see if it's a Player character as defined in the druidObject
            // If not, it assigns the custom druidPrefix string to the beginning
            if (msg.content.includes("!DSBaseChar")) {
                CharacterGet(druidObject[msg.content][0], msg, druidObject[msg.content][1], druidObject[msg.content][2], druidDimStart, druidOtherPlayersLight, druidStatsChange, druidUDL, druidFormAppend);
            } else {
                CharacterGet(druidPrefix + ' ' + druidObject[msg.content][0], msg, druidObject[msg.content][1], druidObject[msg.content][2], druidDimStart, druidOtherPlayersLight, druidStatsChange, druidUDL, druidFormAppend);
            }
        }

        // Checks to make sure it's an API chat message and that it's requesting a custom creature
        if (msg.type === "api" && msg.content.split(',')[0] === "!DSCustom")  {
            let parts = msg.content.split(',')
            let creatureName = parts[1]
            let creatureSize = parts[2]
            let creatureDV = parts[3]

            // If GM wants to use the Legacy Dynamic Lighting trick for darkvision
            if(Number(creatureDV) > 0 && druidLDLtrick == true){
                druidDimStart = -5;
            } else {
                druidDimStart = 0;
            }

            // Grab a character from the parsed custom data
            CharacterGet(druidPrefix + ` ` + `${creatureName}`, msg, `${creatureSize}`, Number(creatureDV), druidDimStart, druidOtherPlayersLight, druidStatsChange, druidUDL, druidFormAppend)
            
            // Check to see if Macro feature is enabled
            if (druidMacro == true) {
                // Check to see if there is already a macro for this custom creature
                if (!findObjs({_type: 'macro', _playerid: msg.playerid, name: creatureName})[0])
                {
                    // Create a custom macro for creature
                    createObj('macro', {
                        name: creatureName,
                        playerid: msg.playerid,
                        istokenaction: druidMacroTokenAction,
                        visibleto: "",
                        action: msg.content
                    });
                }
            }
        }
    }); 

    // Sets the size of the token once the Wild Shape shift has occurred.
    // Todo: error handling or a default value if one of these options isn't used. 
    // Not really a priority since the current token size will be used and can be resized
    // manually during a game session. 
    function Size(charSize, msg)
    {
        if (charSize === "Normal"){
            _.each(msg.selected,function (o) {
                getObj(o._type,o._id).set("height", 70);
                getObj(o._type,o._id).set("width", 70);
                
            });}
            
            if (charSize === "Large"){
            _.each(msg.selected,function (o) {
                getObj(o._type,o._id).set("height", 140);
                getObj(o._type,o._id).set("width", 140);
                
            });}
            
            if (charSize === "Huge"){
            _.each(msg.selected,function (o) {
                getObj(o._type,o._id).set("height", 210);
                getObj(o._type,o._id).set("width", 210);
                
            });}
            
            if (charSize === "Gargantuan"){
            _.each(msg.selected,function (o) {
                getObj(o._type,o._id).set("height", 280);
                getObj(o._type,o._id).set("width", 280);
                
            });}
    }

    function CharacterGet(characterName, msg, charSize, darkvision, darkvisionDim, otherPlayersLight, druidStatsChange, druidUDL, druidFormAppend)
    {
        if (!msg.selected || !getObj(msg.selected[0]._type,msg.selected[0]._id).get('represents'))
        {
            sendChat('Druid Shift Script', 'Please select a representative token to shift');
            return;
        }

        // This is the character we're shifting into
        var ShiftCharacter = findObjs({_type: 'character', name: characterName })[0];

        if (!ShiftCharacter)
        {
            sendChat('Druid Shift API', `No character found: ${characterName}`);
            return;
        }

        // If the stats change feature is enabled, grab all of the relevant stats
        if (druidStatsChange == true) {
            
            // This is the character we're shifting from
            var ShiftCharacterFrom = getObj('character', getObj(msg.selected[0]._type,msg.selected[0]._id).get('represents'));

            // Grab the creature's/character's stats that we're shifting FROM, so we can place them into the shifted character
            var shiftFromInt = findObjs({_type: 'attribute', name: 'intelligence', _characterid: ShiftCharacterFrom.id}, {caseInsensitive: true})[0];
            var shiftFromWis = findObjs({_type: 'attribute', name: 'wisdom', _characterid: ShiftCharacterFrom.id}, {caseInsensitive: true})[0];
            var shiftFromCha = findObjs({_type: 'attribute', name: 'charisma', _characterid: ShiftCharacterFrom.id}, {caseInsensitive: true})[0];
            var shiftFromIntMod = findObjs({_type: 'attribute', name: 'intelligence_mod', _characterid: ShiftCharacterFrom.id}, {caseInsensitive: true})[0];
            var shiftFromWisMod = findObjs({_type: 'attribute', name: 'wisdom_mod', _characterid: ShiftCharacterFrom.id}, {caseInsensitive: true})[0];
            var shiftFromChaMod = findObjs({_type: 'attribute', name: 'charisma_mod', _characterid: ShiftCharacterFrom.id}, {caseInsensitive: true})[0];
            
            // Grab the creature's/character's stats that we're shifting TO, so we can manipulate them
            var shiftToInt = findObjs({_type: 'attribute', name: 'intelligence', _characterid: ShiftCharacter.id}, {caseInsensitive: true})[0];
            var shiftToWis = findObjs({_type: 'attribute', name: 'wisdom', _characterid: ShiftCharacter.id}, {caseInsensitive: true})[0];
            var shiftToCha = findObjs({_type: 'attribute', name: 'charisma', _characterid: ShiftCharacter.id}, {caseInsensitive: true})[0];
            var shiftToIntMod = findObjs({_type: 'attribute', name: 'intelligence_mod', _characterid: ShiftCharacter.id}, {caseInsensitive: true})[0];
            var shiftToWisMod = findObjs({_type: 'attribute', name: 'wisdom_mod', _characterid: ShiftCharacter.id}, {caseInsensitive: true})[0];
            var shiftToChaMod = findObjs({_type: 'attribute', name: 'charisma_mod', _characterid: ShiftCharacter.id}, {caseInsensitive: true})[0];
            
            // Create a "backup" for the original stats of the creature so we can return it back to normal after the druid ends Wild Shape
            // But first, we want to select the NPC for the backup
            if(getAttrByName(ShiftCharacter.id, 'npc', 'current') == 1) {
                backupId = ShiftCharacter.id;
            } else {
                backupId = ShiftCharacterFrom.id;
            }

            // Todo: use a loop and var object to get all these and cut down on code (maybe?)
            // Intelligence Backup
            if (!findObjs({_type: 'attribute', name: 'ds_backup_int', _characterid: backupId}, {caseInsensitive: true})[0]) {
                var statBackupInt = createObj("attribute", {name: "ds_backup_int", current: shiftToInt.get('current'), _characterid: backupId});
                //sendChat('', 'created backup'); // some debugging stuff
            } else {
                var statBackupInt = findObjs({_type: 'attribute', name: 'ds_backup_int', _characterid: backupId}, {caseInsensitive: true})[0];
                //sendChat('', 'backup already exists'); // some debugging stuff
            }
            
            // Intelligence Modifier Backup
            if (!findObjs({_type: 'attribute', name: 'ds_backup_int_mod', _characterid: backupId}, {caseInsensitive: true})[0]) {
                var statBackupIntMod = createObj("attribute", {name: "ds_backup_int_mod", current: shiftToIntMod.get('current'), _characterid: backupId});
            } else {
                var statBackupIntMod = findObjs({_type: 'attribute', name: 'ds_backup_int_mod', _characterid: backupId}, {caseInsensitive: true})[0];
            }

            // Wisdom Backup
            if (!findObjs({_type: 'attribute', name: 'ds_backup_wis', _characterid: backupId}, {caseInsensitive: true})[0]) {
                var statBackupWis = createObj("attribute", {name: "ds_backup_wis", current: shiftToWis.get('current'), _characterid: backupId});
            } else {
                var statBackupWis = findObjs({_type: 'attribute', name: 'ds_backup_wis', _characterid: backupId}, {caseInsensitive: true})[0];
            }

            // Wisdom Modifier Backup
            if (!findObjs({_type: 'attribute', name: 'ds_backup_wis_mod', _characterid: backupId}, {caseInsensitive: true})[0]) {
                var statBackupWisMod = createObj("attribute", {name: "ds_backup_wis_mod", current: shiftToWisMod.get('current'), _characterid: backupId});
            } else {
                var statBackupWisMod = findObjs({_type: 'attribute', name: 'ds_backup_wis_mod', _characterid: backupId}, {caseInsensitive: true})[0];
            }

            // Charisma Backup
            if (!findObjs({_type: 'attribute', name: 'ds_backup_cha', _characterid: backupId}, {caseInsensitive: true})[0]) {
                var statBackupCha = createObj("attribute", {name: "ds_backup_cha", current: shiftToCha.get('current'), _characterid: backupId});
            } else {
                var statBackupCha = findObjs({_type: 'attribute', name: 'ds_backup_cha', _characterid: backupId}, {caseInsensitive: true})[0];
            }

            // Charisma Mod Backup
            if (!findObjs({_type: 'attribute', name: 'ds_backup_cha_mod', _characterid: backupId}, {caseInsensitive: true})[0]) {
                var statBackupChaMod = createObj("attribute", {name: "ds_backup_cha_mod", current: shiftToChaMod.get('current'), _characterid: backupId});
            } else {
                var statBackupChaMod = findObjs({_type: 'attribute', name: 'ds_backup_cha_mod', _characterid: backupId}, {caseInsensitive: true})[0];
            }
        }
        
        // Setup the darkvision variables for the Updated Dynamic Lighting System
        if(druidUDL) {
            if(darkvision > 0) {
                var udlDark = true;
            } else {
                var udlDark = false;
            }
        } else {
            var udlDark = false;
        }

        // If we're shifting TO an NPC/Beast/Not a PC
        if(getAttrByName(ShiftCharacter.id, 'npc', 'current') == 1)
        {
            // Check to see if we're appending the druid form to the end of the char name
            if(druidFormAppend) {
                // Strip "Druid" from the creature name for use below
                var shiftedNamePos = characterName.indexOf(" ");
                shiftedName = characterName.substring(shiftedNamePos+1);

                var druidFormName = getObj("character", ShiftCharacterFrom.id).get("name") + ' (' + shiftedName + ')';
            } else {
                var druidFormName = getObj("character", ShiftCharacterFrom.id).get("name");
            }
            //sendChat("", "NPC thing happened"); // some debugging stuff
            _.each(msg.selected,function (o) {
                getObj(o._type,o._id).set({
                    imgsrc: getCleanImgsrc(ShiftCharacter.get('avatar')),
                    bar1_link: 'None',
                    represents: ShiftCharacter.id,
                    bar1_value: getAttrByName(ShiftCharacter.id, 'hp', 'max'),
                    bar1_max: getAttrByName(ShiftCharacter.id, 'hp', 'max'),
                    bar2_link: 'None',
                    bar2_value: getAttrByName(ShiftCharacter.id, 'npc_ac', 'current'),
                    light_radius: darkvision,
                    light_dimradius: darkvisionDim,
                    light_otherplayers: otherPlayersLight,
                    has_bright_light_vision: druidUDL,
                    has_night_vision: udlDark,
                    night_vision_distance: darkvision,
                    name: druidFormName
                });
            });

            if (druidStatsChange == true) {
                // Set the Wild Shape creature to absorb some of the Druid's stats per 5E Rules:
                //
                /* "Your game Statistics are replaced by the statistics⁠ of the beast, 
                    but you retain your Alignment, personality, and Intelligence, Wisdom, and Charisma scores. 
                    You also retain all of your skill and saving throw Proficiencies, in addition to gaining those of the creature.
                    If the creature has the same proficiency as you and the bonus in its stat block is higher than yours, 
                    use the creature’s bonus instead of yours." 
                */
                //
                // For now, we just are updating the Int, Wis, and Cha
                // Might add the other parts later...
                shiftToInt.set("current", shiftFromInt.get("current"));
                shiftToWis.set("current", shiftFromWis.get("current"));
                shiftToCha.set("current", shiftFromCha.get("current"));
                shiftToIntMod.set("current", shiftFromIntMod.get("current"));
                shiftToWisMod.set("current", shiftFromWisMod.get("current"));
                shiftToChaMod.set("current", shiftFromChaMod.get("current"));
            }
        }
        else
        {   
            var druidFormName = getObj("character", ShiftCharacter.id).get("name");
            //sendChat("", "PC thing happened"); // some debugging stuff
            _.each(msg.selected,function (o) {
                getObj(o._type,o._id).set({
                    imgsrc: getCleanImgsrc(ShiftCharacter.get('avatar')),
                    represents: ShiftCharacter.id,
                    bar1_value: getAttrByName(ShiftCharacter.id, "hp", 'current'),
                    bar1_max: getAttrByName(ShiftCharacter.id, "hp", 'max'),
                    bar1_link: findObjs({type: "attribute", characterid: ShiftCharacter.id, name: 'hp'})[0].id,
                    bar2_value: getAttrByName(ShiftCharacter.id, 'ac', 'current'),
                    bar2_link: findObjs({type: "attribute", characterid: ShiftCharacter.id, name: 'ac'})[0].id,
                    light_radius: darkvision,
                    light_dimradius: darkvisionDim,
                    light_otherplayers: otherPlayersLight,
                    has_bright_light_vision: druidUDL,
                    has_night_vision: udlDark,
                    night_vision_distance: darkvision,
                    name: druidFormName
                });
            });
            
            if (druidStatsChange == true) {
                // Set the Wild Shape creature's original stats back in case they need to be referenced
                shiftFromInt.set("current", statBackupInt.get("current"));
                shiftFromWis.set("current", statBackupWis.get("current"));
                shiftFromCha.set("current", statBackupCha.get("current"));
                shiftFromIntMod.set("current", statBackupIntMod.get("current"));
                shiftFromWisMod.set("current", statBackupWisMod.get("current"));
                shiftFromChaMod.set("current", statBackupChaMod.get("current"));
            }
        }
        
    
        Size(charSize, msg);
    }
});