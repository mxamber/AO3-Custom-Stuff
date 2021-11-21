// ==UserScript==
// @name         AO3SearchStats2
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Additional information in AO3 search results
// @author       mxamber
// @match        https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?domain=archiveofourown.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // really nice colour: #51f542

    /*
    DEFAULT VALUES
    --------------
    judged by how many hits turned into kudos (kudos : hits, in %)
    less than 2.5% = bad ratio
    2.5 - 3.5% = okay ratio
    3.5 - 8.5% = good ratio
    above 8.5% = really good ratio
    ------------------------------
    must have more than 1000 hits to be consdered for "really good"
    since fics tend to start really good at lower hit counts
    but reach a more significant average later on
    ----------------------------------------------
    threshold for minimum words per chapter: 2,000
    */

    let THRESHOLD_BAD_FICS = 2.5;
    let THRESHOLD_OKAY_FICS = 3.5;
    let THRESHOLD_GOOD_FICS = 8.5;
    let THRESHOLD_WORDS_OKAY = 2000;
    let THRESHOLD_WORDS_BAD = 1250;
    let THRESHOLD_MIN_HITS = 1000;


    // define colours once and use variables throughout the rest

    let RED = "#990000";
    let YELLOW = "#e0b60b";
    let GREEN = "#38ad2d";
    let CYAN = "#0bde98";

    let fics = document.querySelectorAll("dl.stats");
    fics.forEach(element => {
        try {
            let title = element.parentNode.querySelector(".header h4 a").innerText;
            console.log(`[AO3SeachStatis2] now processing: "${title}"`);
        } catch (e) {
            let title = document.querySelector("h2.title").innerText;
            console.log(`[AO3SeachStatis2] current fic: "${title}"`);
        }

        // fetch word count. if for some reason NaN, substitute 0
        let words = parseInt(element.querySelector("dd.words").innerText.replace(",", ""));
        words = isNaN(words) ? 0 : words;

        // fetch amount of chapters (format e.g. "1/13 chapters") and extract number using regex
        // sanitise like words (re: NaN)
        let chapters_temp = element.querySelector("dd.chapters");
        let chapter_regex = /(\d+)\/(?:\?|\d+)/;
        let chapters = parseInt(chapter_regex.exec(chapters_temp.innerText)[1]);
        chapters = isNaN(chapters) ? 0 : chapters;

        // do the maths. round to whole numbers, one word more or less doesn't matter
        let words_per_chapter = Math.round(words / chapters);

        // display as tooltip and change colour accordingly
        let elem_chapters = element.querySelector("dt.chapters");
        elem_chapters.title = `${words_per_chapter} words per chapter`;
        elem_chapters.style.fontWeight = "bold";
        elem_chapters.style.color = words_per_chapter > THRESHOLD_WORDS_OKAY ? GREEN : words_per_chapter > THRESHOLD_WORDS_BAD ? YELLOW : RED;

        /*
        kudos and hits are a little more complicated, since both might be 0
        if kudos are 0, the element won't even exist (not sure about hits)
        if the element doesn't exist, then calculating the ratio is pointless, as it can't be displayed
        in that case, abort right away (since forEach runs a function, rather than a loop, it's "return", not "continue")
        */
        if(
            element.querySelector("dt.kudos") == undefined ||
            element.querySelector("dd.kudos") == undefined ||
            element.querySelector("dt.hits") == undefined ||
            element.querySelector("dd.hits") == undefined
        ) {
            return;
        }

        // element to later display the ratio on
        let elem_kudos = element.querySelector("dt.kudos");

        // fetch kudos and hits. sanitise like usual
        let kudos = parseInt(element.querySelector("dd.kudos").innerText);
        let hits = parseInt(element.querySelector("dd.hits").innerText);
        kudos = isNaN(kudos) ? 0 : kudos;
        hits = isNaN(hits) ? 0 : hits;

        // calculate kudos and round to one decimal digit
        let kudos_percents = kudos / hits * 100;
        kudos_percents = Math.round(kudos_percents * 10) / 10;

        // display as tooltip and change color accordingly
        elem_kudos.title = `${kudos_percents}%  of hits left kudos`;
        elem_kudos.style.fontWeight = "bold";
        elem_kudos.style.color = kudos_percents < THRESHOLD_BAD_FICS ? RED : kudos_percents < THRESHOLD_OKAY_FICS ? YELLOW : kudos_percents > THRESHOLD_GOOD_FICS && hits > THRESHOLD_MIN_HITS ? CYAN : GREEN;

    });
})();
