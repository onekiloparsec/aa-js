<h3 align="center">
<img src="http://onekiloparsec.dev/wp-content/uploads/2020/10/1kpcAstroComponents.png" width="50%" />
</h3>
<p align="center">
<a href="https://github.com/onekiloparsec/SwiftAA">SwiftAA</a> &bull;
<b>AA.js</b> &bull;
<a href="https://github.com/onekiloparsec/QLFits">QLFits</a> &bull;
<a href="https://github.com/onekiloparsec/FITSImporter">FITSImporter</a> &bull; 
<a href="https://github.com/onekiloparsec/ObjCFITSIO">ObjCFITSIO</a> 
</p>
<p align="center">
<a href="https://www.patreon.com/onekiloparsec" target="_blank">
<img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patreon">
</a>
</p>

AA.js
============

[![Build Status](https://travis-ci.org/onekiloparsec/AA.js.svg?branch=master)](https://travis-ci.org/onekiloparsec/AA.js)

Astronomical Algorithms in JavaScript.

Other implementations: [Swift (SwiftAA)](https://github.com/onekiloparsec/SwiftAA), [C# (AASharp)](https://github.com/jsauve/AASharp).

AA.js is the port in javascript of the C++ implementation of Astronomical Algorithms by J.P. Naughter, called [AA+](http://www.naughter.com/aa.html),
based on the reference text book by Jean Meeus. It is written in TypeScript, and covered as much as possible with tests validating the correctness
of the algorithms. Tests are inspired from Jean Meeus' book and those written in SwiftAA, and are much more extended than what is available
in AA+.

AA.js is the backbone of scientific algorithms used in [arcsecond.io](https://www.arcsecond.io).

I am the author of the Swift version too. It's called [SwiftAA](https://github.com/onekiloparsec/SwiftAA).

Installation 
================

`npm install astronomical-algorithms`


Usage 
================

```
import aa from 'astronomical-algorithms'

...

const jd = aa.julianday.getJulianDay(new Date()),
const coords = aa.moon.equatorialCoordinates(jd)
```

Documentation 
================

Very much in progress for now, sorry.
