jQuery Pattern Input Plug-in
=============================

jQuery plug-in to create input panel using Android Pattern Lock Style. This plug-in requires no dependency (apart from jQuery) and no image is used, just JavaScript and CSS.

<img src="https://dl.dropbox.com/u/9868650/patternInput/screenshot.png">

See <a href="http://panitw.github.io/patternInput/sample.html">Live Demo here</a>.

Browser Support
===============

This plug-in uses HTML5 canvas, so sorry for IE6-8. Anyway this plug-in is targeted for using with touch devices which are mobile phones and tablets and most of them are HTML5 compatible so I didn't worry much about old versions of IE. This plug-in has been tested with
- IE9, IE10
- Chrome
- Firefox

Usage Guide
===========

To instantiate the input panel, you need an empty div as a placeholder

<pre>
&lt;div id="patternPanel" /&gt;
</pre>

Then in JavaScript

<pre>
$("#patternPanel").patternInput();
</pre>

The code above will create an input panel with default settings, (3x3 dots and 300x300 pixels for Width and Height).
To specify some options, you can do like below.

<pre>
$("#patternPanel").patternInput({
    verticalDots: 4,
    horizontalDots: 4,
    width: 400,
    height: 400,
    autoClear: false
});
</pre>

There are 2 events that you can listen to whcih are <b>onChange</b> and <b>onFinish</b>.
<b>onChange</b> event will be fired at each dot that the finger (or mouse) dragged across.
<b>onFinish</b> event will be fired at the time user lift the finger off the panel. 
To listen to these events, you have to pass callback functions at the creation option object along with the other options.
Parameter of each event is the array of dot index sequence. <b>Dot index sequence runs from left to right, top to bottom.
The first index is 0.</b>

<pre>
$("#patternPanel").patternInput({
    onChange: function(value) {
        alert("Change: "+value.join(",");
    },
    onFinish: function(value) {
        alert("Finish: "+value.join(",");
    }
});
</pre>

And finally, to call a method of this component.

<pre>
//Clear the current input sequence
$("#patternPanel").patternInput("clear");

//Get the current input sequence
var sequence = $("#patternPanel").patternInput("getLastSequence");
</pre>

Full list of options/events/methods can be seen in the API document section. 

API Document
============

<h2>Possible Options</h2>
Here's the list of possible options that can be specified at the panel creation time.

<b>autoClear</b> : boolean
<blockquote>
If autoClear=true, when user lift the finger off the screen, the finger trace will automatically be cleared immediately. 
If false, the trace will be remain and can be cleared using the method <b>"clear"</b>
</blockquote>

<b>width</b> : number
<blockquote>
The width of the panel. This will override the style set by the markup.
</blockquote>

<b>height</b> : number
<blockquote>
The height of the panel. This will override the style set by the markup.
</blockquote>

<b>border</b> : number
<blockquote>
The size of gap between the edge of the panel and the dots.
</blockquote>

<b>verticalDots</b> : number
<blockquote>
Number of dot columns.
</blockquote>

<b>horizontalDots</b> : number
<blockquote>
Number of dot rows.
</blockquote>

<b>dotSize</b> : number
<blockquote>
The size of the dots.
</blockquote>

<b>innerDotSize</b> : number
<blockquote>
The size of the small inner dots.
</blockquote>

<b>pathSize</b> : number
<blockquote>
The width of the finger trace.
</blockquote>

<b>pathColor</b> : string
<blockquote>
The color of the finger trace.
</blockquote>

<h2>Events</h2>
Here's the list of possible events that the patternInput component fires.

<b>onChange(value)</b>
<blockquote>
This event will be fired at each dot that the finger (or mouse) dragged across. <b>value</b> is the current input sequence.
</blockquote>

<b>onFinish</b>
<blockquote>
This event will be fired when user lift the finger off the panel (or mouse up). <b>value</b> is the current input sequence.
</blockquote>

<h2>Methods</h2>

<b>clear()</b> : void
<blockquote>
This method will clear the input sequence. Mostly use with option autoClear=false.
</blockquote>

<b>getLastSequence()</b> : array
<blockquote>
The method will return the last input sequence.
</blockquote>
