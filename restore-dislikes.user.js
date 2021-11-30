// ==UserScript==
// @name         YouTube Restore Dislike Counters
// @version      1.0.0
// @description  A userscript to restore the dislike counts on YouTube. Not 100% accurate all the time, but stil pretty accurate.
// @author       syndiate
// @match        *://www.youtube.com/*
// @run_at       document_start
// ==/UserScript==

async function waitForElm(s) {
    while (!document.querySelector(s)) {
        await new Promise(r => requestAnimationFrame(r))
    }
    return;
}

function FormatNumber(value) {
    const nf = new Intl.NumberFormat('en-US', {notation: 'compact'});
    return nf.format(value);
}

async function init() {
    var data = document.querySelector("ytd-app").data;
    var c = data.response.contents.twoColumnWatchNextResults.results.results.contents;
    var vidroot;
    for (var p = 0; p < c.length && typeof (vidroot = c[p]).videoPrimaryInfoRenderer == 'undefined'; p++);
    var ratio = data.playerResponse.videoDetails.averageRating;
    var likes = Number(vidroot.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons[0].toggleButtonRenderer.toggledText.accessibility.accessibilityData.label.replace(/[^0-9]/g,'')) - 1;
    var dislikes = Math.round(likes * ((5 - ratio) / (ratio - 1)));
    var percent = ratio * 20;

    var bts = document.querySelectorAll("yt-formatted-string#text.ytd-toggle-button-renderer");
    bts[0].innerHTML = FormatNumber(likes);
    bts[1].innerHTML = FormatNumber(dislikes);
    //vvv Show precentage in SHARE button vvv
    //document.querySelector("yt-formatted-string#text.ytd-button-renderer").innerHTML = percent.toFixed(2).toString() + " %";
    document.querySelector("ytd-sentiment-bar-renderer").removeAttribute("hidden");
    document.getElementById("like-bar").style.width = parseInt(percent) + "%;";
    document.getElementById("sentiment").style.width = (bts[0].parentElement.getBoundingClientRect().width + bts[1].parentElement.getBoundingClientRect().width + 12) + "px;";
}

waitForElm("yt-formatted-string#text.ytd-toggle-button-renderer").then(() => init());
window.addEventListener('yt-page-data-updated', init, false);



