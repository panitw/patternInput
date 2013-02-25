jQuery Pattern Input
====================

jQuery plug-in to create input panel using Android Pattern Lock Style. This plug-in requires no dependency (apart from jQuery) and no image is used, just JavaScript and CSS.

<img src="https://dl.dropbox.com/u/9868650/patternInput/screenshot.png">

Browser Support
===============

This plug-in uses HTML5 canvas, so sorry for IE6-8. Anyway this plug-in is targeted for using with touch devices which are mobile phones and tablets and most of them are HTML5 compatible so I didn't worry much about old versions of IE. This plug-in has been tested with
- IE9, IE10
- Chrome
- Firefox

Usage Guide
===========

To instantiate the input panel, you need an empty div as a placeholder

<blockquote>
<div id="patternPanel" />
</blockquote>

Then in JavaScript

<blockquote>
$("#patternPanel").patternInput();
</blockquote>

The code above will create the input panel with default settings, (3x3 dots and 300x300 pixels for Width and Height. To specify some options, you can do like below.

<blockquote>
$("#patternPanel").patternInput({
    verticalDots: 4,
    horizontalDots: 4,
    width: 400,
    height: 400,
    autoClear: false
});
</blockquote>

Full list of options can be seen in the API document section.

API Document
============
To be added tonight.
