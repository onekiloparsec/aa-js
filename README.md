<h3 align="center">
<img src="http://onekiloparsec.dev/wp-content/uploads/2020/10/1kpcAstroComponents.png" width="50%" />
</h3>
<p align="center">
<a href="https://github.com/onekiloparsec/SwiftAA">SwiftAA</a> &bull;
<b>aa-js</b> &bull;
<a href="https://github.com/onekiloparsec/QLFits">QLFits</a> &bull;
<a href="https://github.com/onekiloparsec/FITSImporter">FITSImporter</a> &bull;
<a href="https://github.com/onekiloparsec/ObjCFITSIO">ObjCFITSIO</a>
</p>
<p align="center">
<a href="https://www.patreon.com/onekiloparsec" target="_blank">
<img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patreon">
</a>
</p>

aa-js
============

[![Build Status](https://travis-ci.org/onekiloparsec/aa-js.svg?branch=master)](https://travis-ci.org/onekiloparsec/aa-js)

Astronomical Algorithms in JavaScript.

Other
implementations: [Swift (SwiftAA)](https://github.com/onekiloparsec/SwiftAA)
, [C# (AASharp)](https://github.com/jsauve/AASharp).

aa-js is the port in javascript of the C++ implementation of Astronomical
Algorithms by J.P. Naughter, called [AA+](http://www.naughter.com/aa.html),
based on the reference text book by Jean Meeus. It is written in TypeScript, and
covered as much as possible with tests validating the correctness
of the algorithms. Tests are inspired from Jean Meeus' book and those written in
SwiftAA, and are much more extended than what is available
in AA+.

aa-js is the backbone of scientific algorithms used
in [arcsecond.io](https://www.arcsecond.io).

I am the author of the Swift version too. It's
called [SwiftAA](https://github.com/onekiloparsec/SwiftAA).

Available Modules
================

* Planets: all the (static and dynamic) details, coordinates, quantities about
  `Mercury`, `Venus`, `Mars`, `Jupiter`, `Saturn`, `Neptune` and of
  course `Pluto`: planet constants, aphelion, perihelion, phase angle,
  illuminated fraction, magnitude, semi-diameters.
* In addition, for `Mars`: the planetocentric declination of the Sun and the
  Earth
* In addition, for `Jupiter`: the planetocentric declination of the Sun and the
  Earth
* In addition for `Saturn`: the details of the rings system
* `Earth` & `Moon`: all the coordinates, and many details about the Moon
* `Sun`: mean & true anomaly, coordinates
* `juliandays`: creation, transformation, local mean sidereal time.
* `cosmology`: the cosmology calculator from Ned Wright's, but re-implemented
* `distances`: all the conversions of distances
* `nutation`: in longitude, for obliquity, true & mean obliquity of the ecliptic
* `precession`: all the precession functions between epochs for coordinates
* `sexagesimal`: utilities for manipulating sexagesimals
* `transits`: get rise, transit and set hours, dates, julian days, as well
  as altitude.

Installation
================

`npm install aa-js`


Usage
================

```
import { juliandays, Earth } from 'aa-js'

const jd = juliandays.getJulianDay(new Date())
const coords = Earth.Moon.getEquatorialCoordinates(jd)
```

Documentation
================

See inside the code. Almost every method is documented (quite sparingly
sometimes). A good knowledge of basic astronomy helps very much.
A copy of the Astronomical Algorithms textbook, by Jean Meeus
([amazon](https://www.amazon.fr/Astronomical-Algorithms-J-Meeus/dp/0943396352/ref=sr_1_6?qid=1654447735&refinements=p_27%3AJean+Meeus&s=books&sr=1-6))
would also help, since many methods refer to it.

