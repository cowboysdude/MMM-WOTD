# WWW-WOTD
Word of the day for MagicMirror2 

## Good-bye bottom_bar (Well, not really)

* Examples for either bottom bar or top left 
* CSS provided for coloring and sizing. Make it your own.

## Examples

Narrow using top left for position

![](examples/narrow.png)

## Installation and requirements

* `git clone https://github.com/cowboysdude/WWW-WOTD` into the `~/MagicMirror/modules` directory.

* NO API key is needed!

* No dependencies needed!

## Config.js entry and options

```
{
    disabled: false,
    module: "MMM-WOTD",
    position: "top left", 
    config: {
        word: 'white',     // word font color
        definition: 'white', // definition color
        say: 'white',    // pronunciation color
        wbackground: '#52523D',   //word background color -- left hand side
        dbackground: 'lightgray'  //definition, pronounciation etc color -- right hand side
        updateInterval: 5 * 60 * 1000 // update as often as you'd like or use the default -- 1 * 720 * 1000
    }
},
```

## Module assistance in the MagicMirror forum, not here. 

## Language support is not supported this is English only.  
