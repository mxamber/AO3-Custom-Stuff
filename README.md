# AO3 Capitalisation Fix
A userscript to fix the capitalisation of all-lowercase fanfictions on Archive Of Our Own (AO3).

## What it does do
* capitalise the first word in a sentence
* capitalise the names of all **tagged** characters

## What it does not do
* capitalise God, the Queen, city names, locations, or fandom-specific words
* capitalise the names of untagged characters

## What it can do
These are optional functions that can be enabled or disabled by editing two values in the script.
* remove empty paragraphs (for those fics where each line break measures 4")
* capitalise "I" in sentences

## How does it work?
Beginnings of sentences and paragraphs are detected via regular expressions. Character names are extracted from the tags, sanitised<sup>1</sup>, and any lowercase wrong spellings are search-and-replaced with the, hopefully correct<sup>2</sup>, spelling from the tags. Empty paragraphs are likewise detected via regex, and "I" is done with a simple search-and-replace.

## Known issues
* paragraphs beginning with, for whatever reason<sup>3</sup>, multiple nested bold and italics tags may not be detected
* if a character tag includes the fandom name, such as "Zeus (Percy Jackson)", the fandom name will be wrongly detected as a name and be capitalised in the fic

## How to options
If you edit the script, you will find the following, self-explanatory section at the top:

```    /*
    ** PLEASE READ CAREFULLY
    **
    ** this script is a work in progress and by no means perfect
    ** it might screw up formatting, spelling, etc etc etc
    ** site broken? disable script and reload
    **
    ** config options below
    */

    var REMOVE_EMPTY_PARAGRAPHS = true;
    var CORRECT_LOWERCASE_I = true;

    /*
    **
    ** config options end, actual script begins here
    ** don't edit anything after this
    ** (or if you do and mess it up don't blame me for it)
    **
    */
```

## Footnotes
1. `()|` and "the" are removed and the name is split along whitespaces to enable given name and surname to be detected without the other. Example: "Aang | The Avatar" will  register as names "Aang" and "Avatar", which will subsequently be capitalised in the text.
2. If the character tag says "aang the avatar", then all, even correct, occurences of "Aang" or "Avatar" will be falsely "corrected" to "aang" and "avatar" respectively.
3. May occur with text copy-pasted from writing software (Google Docs, Libre Office, etc) into AO3's rich text field.
