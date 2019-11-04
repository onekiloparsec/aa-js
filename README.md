<h3 align="center">
	<img src="http://onekilopars.ec/wp-content/uploads/2018/07/1kpcProComponents.002.png" width="100%" />
</h3>
<p align="center">
<a href="https://github.com/onekiloparsec/SwiftAA">SwiftAA</a> &bull;
<b>AA.js</b> &bull;
<a href="https://github.com/onekiloparsec/QLFits">QLFits</a> &bull;
<a href="https://github.com/onekiloparsec/FITSImporter">FITSImporter</a> &bull; 
<a href="https://github.com/onekiloparsec/ObjCFITSIO">ObjCFITSIO</a> 
</p>
<p align="center">
<a href="https://www.patreon.com/bePatron?u=2743110" data-patreon-widget-type="become-patron-button">Become a Patron!</a><!-- <script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script> -->
</p>

AA.js
============

[![Build Status](https://travis-ci.org/onekiloparsec/AA.js.svg?branch=master)](https://travis-ci.org/onekiloparsec/AA.js)

Astronomical Algorithms in JavaScript.

Other implementations: [Swift (SwiftAA)](https://github.com/onekiloparsec/SwiftAA), [C# (AASharp)](https://github.com/jsauve/AASharp).

AA.js is the port in javascript of the C++ implementation of Astronomical Algorithms by J.P. Naughter, called [AA+](http://www.naughter.com/aa.html), based on the reference text book by Jean Meeus.

AA.js is the backbone of scientific algorithms used in [arcsecond.io](https://www.arcsecond.io).

I am the author of the Swift version too. It's called [SwiftAA](https://github.com/onekiloparsec/SwiftAA).


Installation 
================

`npm install astronomical-algorithms`


Usage 
================

```
import { julianday, moon } from 'astronomical-algorithms'

...

const jd = julianday.getJulianDay(new Date()),
const moonObject = new moon.Moon(jd)
const coords = moonObject.equatorialCoordinates()
```
