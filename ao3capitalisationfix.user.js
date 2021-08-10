// ==UserScript==
// @name         ao3capitalisationfix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix capitalisation on all-lowercase fics.
// @author       mxamber
// @match        https://archiveofourown.org/works/*
// @grant        none
// ==/UserScript==

(function() {
    /*
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

    var fictext = document.querySelector("div.userstuff[role='article']");

    // read all the character names from the tags, remove () and | and split by whitespace
    // example: "Anakin Skywalker | Darth Vader (Star Wars)" becomes "Anakin, Skywalker, Darth, Vader, Star, Wars"
    // trim and sort out empty strings, then push to array "names"
    var names = [];
    document.querySelectorAll("dd.character.tags > ul > li > a").forEach(function(element) {
        let parts = element.innerText.split(" ");
        for(element of parts) {
            element = element.replace(/[\(\)\|]*/gmi, "");
            element = element.trim();
            if(names.indexOf(element) == -1 && element.length > 0 && element != "the") {
                names.push(element);
            }
        }
    });
    /*
    Each of these names will be converted to lowercase (the incorrect spelling we seek to replace)
    searched for, and replaced with correct spelling.
    Example: "Nico di Angelo", misspelled as "nico di angelo", replaced with "Nico di Angelo"
    */
    names.forEach(function(element) {
        fictext.innerHTML = fictext.innerHTML.replaceAll(element.toLowerCase(), element);
    });

    // replace lowercase "I" in sentences.
    if(CORRECT_LOWERCASE_I) { fictext.innerHTML = fictext.innerHTML.replaceAll(" i ", " I "); }

    // remove empty paragraphs
    if(REMOVE_EMPTY_PARAGRAPHS) {
        // remove all p elements which might or might not contain nested but empty strong or em tags and nbsp whitespaces
        fictext.innerHTML = fictext.innerHTML.replaceAll(/<p>(<em>|<\/em>|<strong>|<\/strong>|\s*\n*|&nbsp;)*<\/p>/gmi, "");
    }

    // function used for replacing parts of the fic text via regex
    function rgx(expr) {
        let newtext = fictext.innerHTML;
        for(const match of fictext.innerHTML.matchAll(expr)) {
            newtext = newtext.substr(0, match.index) + match.toString().toUpperCase() + newtext.substr(match.index + match[0].length);
        }
        fictext.innerHTML = newtext;
    }

    // [“”""‘’''«»]? = any kind of quotation marks, 0 or 1 occurrences

    // beginning of sentence
    rgx(/[\.!?]\s[“”""‘’''«»]?\w/gmi);

    // after newline
    rgx(/\n[“”""‘’''«»]?\w/gmi);

    // beginning of paragraph
    // first \s* is for bad writing like "<p>  paragraphs begins here", and to account for indentation
    rgx(/<p>\s*[“”""‘’''«»]?\w/gmi);
    // account for italic paragraphs with indents and newlines between p and em tags
    rgx(/<p>\s*<em>\s*[“”""‘’''«»]?\w/gmi);
})();
