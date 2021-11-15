// ==UserScript==
// @name         AO3SearchStats2
// @namespace    http://tampermonkey.net/
// @version      2.0
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
    let THRESHOLD_WORD_COUNT = 2000;
    let THRESHOLD_MIN_HITS = 1000;

    let fics = document.querySelectorAll("dl.stats");
    fics.forEach(element => {
        let words = parseInt(element.querySelector("dd.words").innerText.replace(",", ""));
        let chapters_temp = element.querySelector("dd.chapters");
        let kudos = parseInt(element.querySelector("dd.kudos").innerText);
        let hits = parseInt(element.querySelector("dd.hits").innerText);

        words = isNaN(words) ? 0 : words;
        kudos = isNaN(kudos) ? 0 : kudos;
        hits = isNaN(hits) ? 0 : hits;

        let chapter_regex = /(\d+)\/(?:\?|\d+)/;
        let chapters = parseInt(chapter_regex.exec(chapters_temp.innerText)[1]);
        chapters = isNaN(chapters) ? 0 : chapters;

        // console.log(`${words} words, ${chapters} chapters, ${comments} comments, ${kudos} kudos, ${bookmarks} bookmarks, ${hits} hits`);

        let words_per_chapter = Math.round(words / chapters);
        let kudos_percents = kudos / hits * 100;
        kudos_percents = Math.round(kudos_percents * 100) / 100;

        let elem_chapters = element.querySelector("dt.chapters");
        elem_chapters.title = `${words_per_chapter} words per chapter`;
        elem_chapters.style.fontWeight = "bold";
        elem_chapters.style.color = words_per_chapter < THRESHOLD_WORD_COUNT ? "#900" : "#38ad2d";

        let elem_kudos = element.querySelector("dt.kudos");
        elem_kudos.title = `${kudos_percents}%  of hits left kudos`;
        elem_kudos.style.fontWeight = "bold";
        elem_kudos.style.color = kudos_percents < THRESHOLD_BAD_FICS ? "#900" : kudos_percents < THRESHOLD_OKAY_FICS ? "#e0b60b" : kudos_percents > THRESHOLD_GOOD_FICS && hits > THRESHOLD_MIN_HITS ? "#0bde98" : "#38ad2d";

    });
})();
