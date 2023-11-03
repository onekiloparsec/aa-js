aa-js
============

![build and test](https://github.com/onekiloparsec/aa-js/actions/workflows/nodejs.yml/badge.svg?branch=master) [![codecov](https://codecov.io/gh/onekiloparsec/aa-js/graph/badge.svg?token=EfRJpZ4OTu)](https://codecov.io/gh/onekiloparsec/aa-js)

The most comprehensive collection of accurate astronomical algorithms in JavaScript (TypeScript).

**The new v3 uses arbitrary-precision computations, thanks
to [decimal.js](https://github.com/MikeMcl/decimal.js).**

Other
implementations: [Swift (SwiftAA)](https://github.com/onekiloparsec/SwiftAA)
, [C# (AASharp)](https://github.com/jsauve/AASharp).

At the beginning, `aa-js` is the port in javascript of the C++ implementation of Astronomical
Algorithms by J.P. Naughter, called [AA+](http://www.naughter.com/aa.html),
based on the reference text book by Jean Meeus. It is written in TypeScript, and
covered as much as possible with tests validating the correctness
of the algorithms. Tests are inspired from Jean Meeus' book and those written in
SwiftAA, and are much more extended than what is available
in AA+.

`aa-js` is the backbone of scientific algorithms used
in [Arcsecond.io](https://www.arcsecond.io).

I am the author of the Swift version too. It's
called [SwiftAA](https://github.com/onekiloparsec/SwiftAA).

Main Changes in V3
================

- **All algorithms based on arbitrary-precision operations thanks
  to [decimal.js](https://github.com/MikeMcl/decimal.js).**
- `nutation` and `aberration` modules moved inside the `earth` module.
- Moved all (non-Earth) planets modules inside a `planets` folder.
- **Addition of numerous orbital getters for planets** (mean longitude, semi-major axis, inclination, eccentricity...)
- Much easier and cleaner distinction between *heliocentric* and *geocentric* coordinates of planets.
- Added easy accessor for apparent geocentric equatorial coordinates of planets.
- Added a transformation from equatorial to *topocentric* coordinates.
- Important bugfix on `getPositionAngle` and `getPhaseAngle` in the `Moon` module.
- Added easy accessors for rise, transit and set times for every planet.
- Numerous bugfixes, and added methods for dates, julian days

Available Modules
================

* Planets: all the (static and dynamic) details, coordinates, quantities about
  `Mercury`, `Venus`, `Mars`, `Jupiter`, `Saturn`, `Neptune` and of course `Pluto`: planet constants, aphelion,
  perihelion, phase angle, illuminated fraction, magnitude, semi-diameters, heliocentric & geocentric coordinates,
  distance from earth, velocities, orbital details etc.
* In addition, for `Mars`: the planetocentric declination of the Sun and the
  Earth.
* In addition, for `Jupiter`: the planetocentric declination of the Sun and the
  Earth.
* In addition, for `Saturn`: the details of the rings system.
* `Sun`: mean & true anomaly, coordinates.
* `Earth`: all the coordinates, mean anomaly, radius vector (distance) etc.
* Inside `Earth` module: `nutation`: in longitude, for obliquity, true & mean obliquity of the ecliptic.
* Inside `Earth` module: `aberration`: ecliptic and equatorial.
* `Earth.Moon`: phases, age, apparent coordinates etc.
* `juliandays`: creation, transformation, local mean sidereal time.
* `times`: transformation between UTC, TT, AI, UT1...
* `cosmology`: the cosmology calculator from Ned Wright's, but re-implemented, and tested.
* `distances`: all the conversions of small and extra-galactic distances.
* `precession`: all the precession functions between epochs for coordinates.
* `sexagesimal`: utilities for transforming values between decimal and sexagesimal.
* `risetransitset`: get rise, transit and set hours, dates, julian days, as well
  as altitude.
* `exoplanets`: **WIP** module to hold exoplanet transit details calculations.
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

Almost every method is documented (quite sparingly
sometimes). A good knowledge of basic astronomy helps very much.
A copy of the Astronomical Algorithms textbook, by Jean Meeus
([amazon](https://www.amazon.fr/Astronomical-Algorithms-J-Meeus/dp/0943396352/ref=sr_1_6?qid=1654447735&refinements=p_27%3AJean+Meeus&s=books&sr=1-6)) would also help, since many methods refer to it.
