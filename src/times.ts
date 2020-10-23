import * as dates from './dates'
import { JulianDay } from "./constants";

// Note: Javascript Implementation of the Astronomical Algorithms found in the
// C++ reference implementation called AA+, by J.P. Naughter.
// Implementation will be validated by unit tests extracted from Jean Meus'
// textbook.


const gDeltaTValues =
  [
// All the initial values are observed values from 1 February 1973 to 1 June 2017 as taken from http:// maia.usno.navy.mil/ser7/deltat.data
  { JD: 2441714.5, DeltaT: 43.4724 },
  { JD: 2441742.5, DeltaT: 43.5648 },
  { JD: 2441773.5, DeltaT: 43.6737 },
  { JD: 2441803.5, DeltaT: 43.7782 },
  { JD: 2441834.5, DeltaT: 43.8763 },
  { JD: 2441864.5, DeltaT: 43.9562 },
  { JD: 2441895.5, DeltaT: 44.0315 },
  { JD: 2441926.5, DeltaT: 44.1132 },
  { JD: 2441956.5, DeltaT: 44.1982 },
  { JD: 2441987.5, DeltaT: 44.2952 },
  { JD: 2442017.5, DeltaT: 44.3936 },
  { JD: 2442048.5, DeltaT: 44.4841 },
  { JD: 2442079.5, DeltaT: 44.5646 },
  { JD: 2442107.5, DeltaT: 44.6425 },
  { JD: 2442138.5, DeltaT: 44.7386 },
  { JD: 2442168.5, DeltaT: 44.8370 },
  { JD: 2442199.5, DeltaT: 44.9302 },
  { JD: 2442229.5, DeltaT: 44.9986 },
  { JD: 2442260.5, DeltaT: 45.0584 },
  { JD: 2442291.5, DeltaT: 45.1284 },
  { JD: 2442321.5, DeltaT: 45.2064 },
  { JD: 2442352.5, DeltaT: 45.2980 },
  { JD: 2442382.5, DeltaT: 45.3897 },
  { JD: 2442413.5, DeltaT: 45.4761 },
  { JD: 2442444.5, DeltaT: 45.5633 },
  { JD: 2442472.5, DeltaT: 45.6450 },
  { JD: 2442503.5, DeltaT: 45.7375 },
  { JD: 2442533.5, DeltaT: 45.8284 },
  { JD: 2442564.5, DeltaT: 45.9133 },
  { JD: 2442594.5, DeltaT: 45.9820 },
  { JD: 2442625.5, DeltaT: 46.0408 },
  { JD: 2442656.5, DeltaT: 46.1067 },
  { JD: 2442686.5, DeltaT: 46.1825 },
  { JD: 2442717.5, DeltaT: 46.2789 },
  { JD: 2442747.5, DeltaT: 46.3713 },
  { JD: 2442778.5, DeltaT: 46.4567 },
  { JD: 2442809.5, DeltaT: 46.5445 },
  { JD: 2442838.5, DeltaT: 46.6311 },
  { JD: 2442869.5, DeltaT: 46.7302 },
  { JD: 2442899.5, DeltaT: 46.8284 },
  { JD: 2442930.5, DeltaT: 46.9247 },
  { JD: 2442960.5, DeltaT: 46.9970 },
  { JD: 2442991.5, DeltaT: 47.0709 },
  { JD: 2443022.5, DeltaT: 47.1451 },
  { JD: 2443052.5, DeltaT: 47.2362 },
  { JD: 2443083.5, DeltaT: 47.3413 },
  { JD: 2443113.5, DeltaT: 47.4319 },
  { JD: 2443144.5, DeltaT: 47.5214 },
  { JD: 2443175.5, DeltaT: 47.6049 },
  { JD: 2443203.5, DeltaT: 47.6837 },
  { JD: 2443234.5, DeltaT: 47.7781 },
  { JD: 2443264.5, DeltaT: 47.8771 },
  { JD: 2443295.5, DeltaT: 47.9687 },
  { JD: 2443325.5, DeltaT: 48.0348 },
  { JD: 2443356.5, DeltaT: 48.0942 },
  { JD: 2443387.5, DeltaT: 48.1608 },
  { JD: 2443417.5, DeltaT: 48.2460 },
  { JD: 2443448.5, DeltaT: 48.3439 },
  { JD: 2443478.5, DeltaT: 48.4355 },
  { JD: 2443509.5, DeltaT: 48.5344 },
  { JD: 2443540.5, DeltaT: 48.6325 },
  { JD: 2443568.5, DeltaT: 48.7294 },
  { JD: 2443599.5, DeltaT: 48.8365 },
  { JD: 2443629.5, DeltaT: 48.9353 },
  { JD: 2443660.5, DeltaT: 49.0319 },
  { JD: 2443690.5, DeltaT: 49.1013 },
  { JD: 2443721.5, DeltaT: 49.1591 },
  { JD: 2443752.5, DeltaT: 49.2286 },
  { JD: 2443782.5, DeltaT: 49.3070 },
  { JD: 2443813.5, DeltaT: 49.4018 },
  { JD: 2443843.5, DeltaT: 49.4945 },
  { JD: 2443874.5, DeltaT: 49.5862 },
  { JD: 2443905.5, DeltaT: 49.6805 },
  { JD: 2443933.5, DeltaT: 49.7602 },
  { JD: 2443964.5, DeltaT: 49.8556 },
  { JD: 2443994.5, DeltaT: 49.9489 },
  { JD: 2444025.5, DeltaT: 50.0347 },
  { JD: 2444055.5, DeltaT: 50.1019 },
  { JD: 2444086.5, DeltaT: 50.1622 },
  { JD: 2444117.5, DeltaT: 50.2260 },
  { JD: 2444147.5, DeltaT: 50.2968 },
  { JD: 2444178.5, DeltaT: 50.3831 },
  { JD: 2444208.5, DeltaT: 50.4599 },
  { JD: 2444239.5, DeltaT: 50.5387 },
  { JD: 2444270.5, DeltaT: 50.6161 },
  { JD: 2444299.5, DeltaT: 50.6866 },
  { JD: 2444330.5, DeltaT: 50.7658 },
  { JD: 2444360.5, DeltaT: 50.8454 },
  { JD: 2444391.5, DeltaT: 50.9187 },
  { JD: 2444421.5, DeltaT: 50.9761 },
  { JD: 2444452.5, DeltaT: 51.0278 },
  { JD: 2444483.5, DeltaT: 51.0843 },
  { JD: 2444513.5, DeltaT: 51.1538 },
  { JD: 2444544.5, DeltaT: 51.2319 },
  { JD: 2444574.5, DeltaT: 51.3063 },
  { JD: 2444605.5, DeltaT: 51.3808 },
  { JD: 2444636.5, DeltaT: 51.4526 },
  { JD: 2444664.5, DeltaT: 51.5160 },
  { JD: 2444695.5, DeltaT: 51.5985 },
  { JD: 2444725.5, DeltaT: 51.6809 },
  { JD: 2444756.5, DeltaT: 51.7573 },
  { JD: 2444786.5, DeltaT: 51.8133 },
  { JD: 2444817.5, DeltaT: 51.8532 },
  { JD: 2444848.5, DeltaT: 51.9014 },
  { JD: 2444878.5, DeltaT: 51.9603 },
  { JD: 2444909.5, DeltaT: 52.0328 },
  { JD: 2444939.5, DeltaT: 52.0985 },
  { JD: 2444970.5, DeltaT: 52.1668 },
  { JD: 2445001.5, DeltaT: 52.2316 },
  { JD: 2445029.5, DeltaT: 52.2938 },
  { JD: 2445060.5, DeltaT: 52.3680 },
  { JD: 2445090.5, DeltaT: 52.4465 },
  { JD: 2445121.5, DeltaT: 52.5180 },
  { JD: 2445151.5, DeltaT: 52.5752 },
  { JD: 2445182.5, DeltaT: 52.6178 },
  { JD: 2445213.5, DeltaT: 52.6668 },
  { JD: 2445243.5, DeltaT: 52.7340 },
  { JD: 2445274.5, DeltaT: 52.8056 },
  { JD: 2445304.5, DeltaT: 52.8792 },
  { JD: 2445335.5, DeltaT: 52.9565 },
  { JD: 2445366.5, DeltaT: 53.0445 },
  { JD: 2445394.5, DeltaT: 53.1268 },
  { JD: 2445425.5, DeltaT: 53.2197 },
  { JD: 2445455.5, DeltaT: 53.3024 },
  { JD: 2445486.5, DeltaT: 53.3747 },
  { JD: 2445516.5, DeltaT: 53.4335 },
  { JD: 2445547.5, DeltaT: 53.4778 },
  { JD: 2445578.5, DeltaT: 53.5300 },
  { JD: 2445608.5, DeltaT: 53.5845 },
  { JD: 2445639.5, DeltaT: 53.6523 },
  { JD: 2445669.5, DeltaT: 53.7256 },
  { JD: 2445700.5, DeltaT: 53.7882 },
  { JD: 2445731.5, DeltaT: 53.8367 },
  { JD: 2445760.5, DeltaT: 53.8830 },
  { JD: 2445791.5, DeltaT: 53.9443 },
  { JD: 2445821.5, DeltaT: 54.0042 },
  { JD: 2445852.5, DeltaT: 54.0536 },
  { JD: 2445882.5, DeltaT: 54.0856 },
  { JD: 2445913.5, DeltaT: 54.1084 },
  { JD: 2445944.5, DeltaT: 54.1463 },
  { JD: 2445974.5, DeltaT: 54.1914 },
  { JD: 2446005.5, DeltaT: 54.2452 },
  { JD: 2446035.5, DeltaT: 54.2958 },
  { JD: 2446066.5, DeltaT: 54.3427 },
  { JD: 2446097.5, DeltaT: 54.3911 },
  { JD: 2446125.5, DeltaT: 54.4320 },
  { JD: 2446156.5, DeltaT: 54.4898 },
  { JD: 2446186.5, DeltaT: 54.5456 },
  { JD: 2446217.5, DeltaT: 54.5977 },
  { JD: 2446247.5, DeltaT: 54.6355 },
  { JD: 2446278.5, DeltaT: 54.6532 },
  { JD: 2446309.5, DeltaT: 54.6776 },
  { JD: 2446339.5, DeltaT: 54.7174 },
  { JD: 2446370.5, DeltaT: 54.7741 },
  { JD: 2446400.5, DeltaT: 54.8253 },
  { JD: 2446431.5, DeltaT: 54.8713 },
  { JD: 2446462.5, DeltaT: 54.9161 },
  { JD: 2446490.5, DeltaT: 54.9581 },
  { JD: 2446521.5, DeltaT: 54.9997 },
  { JD: 2446551.5, DeltaT: 55.0476 },
  { JD: 2446582.5, DeltaT: 55.0912 },
  { JD: 2446612.5, DeltaT: 55.1132 },
  { JD: 2446643.5, DeltaT: 55.1328 },
  { JD: 2446674.5, DeltaT: 55.1532 },
  { JD: 2446704.5, DeltaT: 55.1898 },
  { JD: 2446735.5, DeltaT: 55.2416 },
  { JD: 2446765.5, DeltaT: 55.2838 },
  { JD: 2446796.5, DeltaT: 55.3222 },
  { JD: 2446827.5, DeltaT: 55.3613 },
  { JD: 2446855.5, DeltaT: 55.4063 },
  { JD: 2446886.5, DeltaT: 55.4629 },
  { JD: 2446916.5, DeltaT: 55.5111 },
  { JD: 2446947.5, DeltaT: 55.5524 },
  { JD: 2446977.5, DeltaT: 55.5812 },
  { JD: 2447008.5, DeltaT: 55.6004 },
  { JD: 2447039.5, DeltaT: 55.6262 },
  { JD: 2447069.5, DeltaT: 55.6656 },
  { JD: 2447100.5, DeltaT: 55.7168 },
  { JD: 2447130.5, DeltaT: 55.7698 },
  { JD: 2447161.5, DeltaT: 55.8197 },
  { JD: 2447192.5, DeltaT: 55.8615 },
  { JD: 2447221.5, DeltaT: 55.9130 },
  { JD: 2447252.5, DeltaT: 55.9663 },
  { JD: 2447282.5, DeltaT: 56.0220 },
  { JD: 2447313.5, DeltaT: 56.0700 },
  { JD: 2447343.5, DeltaT: 56.0939 },
  { JD: 2447374.5, DeltaT: 56.1105 },
  { JD: 2447405.5, DeltaT: 56.1314 },
  { JD: 2447435.5, DeltaT: 56.1611 },
  { JD: 2447466.5, DeltaT: 56.2068 },
  { JD: 2447496.5, DeltaT: 56.2583 },
  { JD: 2447527.5, DeltaT: 56.3000 },
  { JD: 2447558.5, DeltaT: 56.3399 },
  { JD: 2447586.5, DeltaT: 56.3790 },
  { JD: 2447617.5, DeltaT: 56.4283 },
  { JD: 2447647.5, DeltaT: 56.4804 },
  { JD: 2447678.5, DeltaT: 56.5352 },
  { JD: 2447708.5, DeltaT: 56.5697 },
  { JD: 2447739.5, DeltaT: 56.5983 },
  { JD: 2447770.5, DeltaT: 56.6328 },
  { JD: 2447800.5, DeltaT: 56.6739 },
  { JD: 2447831.5, DeltaT: 56.7332 },
  { JD: 2447861.5, DeltaT: 56.7972 },
  { JD: 2447892.5, DeltaT: 56.8553 },
  { JD: 2447923.5, DeltaT: 56.9111 },
  { JD: 2447951.5, DeltaT: 56.9755 },
  { JD: 2447982.5, DeltaT: 57.0471 },
  { JD: 2448012.5, DeltaT: 57.1136 },
  { JD: 2448043.5, DeltaT: 57.1738 },
  { JD: 2448073.5, DeltaT: 57.2226 },
  { JD: 2448104.5, DeltaT: 57.2597 },
  { JD: 2448135.5, DeltaT: 57.3073 },
  { JD: 2448165.5, DeltaT: 57.3643 },
  { JD: 2448196.5, DeltaT: 57.4334 },
  { JD: 2448226.5, DeltaT: 57.5016 },
  { JD: 2448257.5, DeltaT: 57.5653 },
  { JD: 2448288.5, DeltaT: 57.6333 },
  { JD: 2448316.5, DeltaT: 57.6973 },
  { JD: 2448347.5, DeltaT: 57.7711 },
  { JD: 2448377.5, DeltaT: 57.8407 },
  { JD: 2448408.5, DeltaT: 57.9058 },
  { JD: 2448438.5, DeltaT: 57.9576 },
  { JD: 2448469.5, DeltaT: 57.9975 },
  { JD: 2448500.5, DeltaT: 58.0426 },
  { JD: 2448530.5, DeltaT: 58.1043 },
  { JD: 2448561.5, DeltaT: 58.1679 },
  { JD: 2448591.5, DeltaT: 58.2389 },
  { JD: 2448622.5, DeltaT: 58.3092 },
  { JD: 2448653.5, DeltaT: 58.3833 },
  { JD: 2448682.5, DeltaT: 58.4537 },
  { JD: 2448713.5, DeltaT: 58.5401 },
  { JD: 2448743.5, DeltaT: 58.6228 },
  { JD: 2448774.5, DeltaT: 58.6917 },
  { JD: 2448804.5, DeltaT: 58.7410 },
  { JD: 2448835.5, DeltaT: 58.7836 },
  { JD: 2448866.5, DeltaT: 58.8406 },
  { JD: 2448896.5, DeltaT: 58.8986 },
  { JD: 2448927.5, DeltaT: 58.9714 },
  { JD: 2448957.5, DeltaT: 59.0438 },
  { JD: 2448988.5, DeltaT: 59.1218 },
  { JD: 2449019.5, DeltaT: 59.2003 },
  { JD: 2449047.5, DeltaT: 59.2747 },
  { JD: 2449078.5, DeltaT: 59.3574 },
  { JD: 2449108.5, DeltaT: 59.4434 },
  { JD: 2449139.5, DeltaT: 59.5242 },
  { JD: 2449169.5, DeltaT: 59.5850 },
  { JD: 2449200.5, DeltaT: 59.6344 },
  { JD: 2449231.5, DeltaT: 59.6928 },
  { JD: 2449261.5, DeltaT: 59.7588 },
  { JD: 2449292.5, DeltaT: 59.8386 },
  { JD: 2449322.5, DeltaT: 59.9111 },
  { JD: 2449353.5, DeltaT: 59.9845 },
  { JD: 2449384.5, DeltaT: 60.0564 },
  { JD: 2449412.5, DeltaT: 60.1231 },
  { JD: 2449443.5, DeltaT: 60.2042 },
  { JD: 2449473.5, DeltaT: 60.2804 },
  { JD: 2449504.5, DeltaT: 60.3530 },
  { JD: 2449534.5, DeltaT: 60.4012 },
  { JD: 2449565.5, DeltaT: 60.4440 },
  { JD: 2449596.5, DeltaT: 60.4900 },
  { JD: 2449626.5, DeltaT: 60.5578 },
  { JD: 2449657.5, DeltaT: 60.6324 },
  { JD: 2449687.5, DeltaT: 60.7059 },
  { JD: 2449718.5, DeltaT: 60.7853 },
  { JD: 2449749.5, DeltaT: 60.8664 },
  { JD: 2449777.5, DeltaT: 60.9387 },
  { JD: 2449808.5, DeltaT: 61.0277 },
  { JD: 2449838.5, DeltaT: 61.1103 },
  { JD: 2449869.5, DeltaT: 61.1870 },
  { JD: 2449899.5, DeltaT: 61.2454 },
  { JD: 2449930.5, DeltaT: 61.2881 },
  { JD: 2449961.5, DeltaT: 61.3378 },
  { JD: 2449991.5, DeltaT: 61.4036 },
  { JD: 2450022.5, DeltaT: 61.4760 },
  { JD: 2450052.5, DeltaT: 61.5525 },
  { JD: 2450083.5, DeltaT: 61.6287 },
  { JD: 2450114.5, DeltaT: 61.6846 },
  { JD: 2450143.5, DeltaT: 61.7433 },
  { JD: 2450174.5, DeltaT: 61.8132 },
  { JD: 2450204.5, DeltaT: 61.8823 },
  { JD: 2450235.5, DeltaT: 61.9497 },
  { JD: 2450265.5, DeltaT: 61.9969 },
  { JD: 2450296.5, DeltaT: 62.0343 },
  { JD: 2450327.5, DeltaT: 62.0714 },
  { JD: 2450357.5, DeltaT: 62.1202 },
  { JD: 2450388.5, DeltaT: 62.1810 },
  { JD: 2450418.5, DeltaT: 62.2382 },
  { JD: 2450449.5, DeltaT: 62.2950 },
  { JD: 2450480.5, DeltaT: 62.3506 },
  { JD: 2450508.5, DeltaT: 62.3995 },
  { JD: 2450539.5, DeltaT: 62.4754 },
  { JD: 2450569.5, DeltaT: 62.5463 },
  { JD: 2450600.5, DeltaT: 62.6136 },
  { JD: 2450630.5, DeltaT: 62.6571 },
  { JD: 2450661.5, DeltaT: 62.6942 },
  { JD: 2450692.5, DeltaT: 62.7383 },
  { JD: 2450722.5, DeltaT: 62.7926 },
  { JD: 2450753.5, DeltaT: 62.8567 },
  { JD: 2450783.5, DeltaT: 62.9146 },
  { JD: 2450814.5, DeltaT: 62.9659 },
  { JD: 2450845.5, DeltaT: 63.0217 },
  { JD: 2450873.5, DeltaT: 63.0807 },
  { JD: 2450904.5, DeltaT: 63.1462 },
  { JD: 2450934.5, DeltaT: 63.2053 },
  { JD: 2450965.5, DeltaT: 63.2599 },
  { JD: 2450995.5, DeltaT: 63.2844 },
  { JD: 2451026.5, DeltaT: 63.2961 },
  { JD: 2451057.5, DeltaT: 63.3126 },
  { JD: 2451087.5, DeltaT: 63.3422 },
  { JD: 2451118.5, DeltaT: 63.3871 },
  { JD: 2451148.5, DeltaT: 63.4339 },
  { JD: 2451179.5, DeltaT: 63.4673 },
  { JD: 2451210.5, DeltaT: 63.4979 },
  { JD: 2451238.5, DeltaT: 63.5319 },
  { JD: 2451269.5, DeltaT: 63.5679 },
  { JD: 2451299.5, DeltaT: 63.6104 },
  { JD: 2451330.5, DeltaT: 63.6444 },
  { JD: 2451360.5, DeltaT: 63.6642 },
  { JD: 2451391.5, DeltaT: 63.6739 },
  { JD: 2451422.5, DeltaT: 63.6926 },
  { JD: 2451452.5, DeltaT: 63.7147 },
  { JD: 2451483.5, DeltaT: 63.7518 },
  { JD: 2451513.5, DeltaT: 63.7927 },
  { JD: 2451544.5, DeltaT: 63.8285 },
  { JD: 2451575.5, DeltaT: 63.8557 },
  { JD: 2451604.5, DeltaT: 63.8804 },
  { JD: 2451635.5, DeltaT: 63.9075 },
  { JD: 2451665.5, DeltaT: 63.9393 },
  { JD: 2451696.5, DeltaT: 63.9691 },
  { JD: 2451726.5, DeltaT: 63.9799 },
  { JD: 2451757.5, DeltaT: 63.9833 },
  { JD: 2451788.5, DeltaT: 63.9938 },
  { JD: 2451818.5, DeltaT: 64.0093 },
  { JD: 2451849.5, DeltaT: 64.0400 },
  { JD: 2451879.5, DeltaT: 64.0670 },
  { JD: 2451910.5, DeltaT: 64.0908 },
  { JD: 2451941.5, DeltaT: 64.1068 },
  { JD: 2451969.5, DeltaT: 64.1282 },
  { JD: 2452000.5, DeltaT: 64.1584 },
  { JD: 2452030.5, DeltaT: 64.1833 },
  { JD: 2452061.5, DeltaT: 64.2094 },
  { JD: 2452091.5, DeltaT: 64.2117 },
  { JD: 2452122.5, DeltaT: 64.2073 },
  { JD: 2452153.5, DeltaT: 64.2116 },
  { JD: 2452183.5, DeltaT: 64.2223 },
  { JD: 2452214.5, DeltaT: 64.2500 },
  { JD: 2452244.5, DeltaT: 64.2761 },
  { JD: 2452275.5, DeltaT: 64.2998 },
  { JD: 2452306.5, DeltaT: 64.3192 },
  { JD: 2452334.5, DeltaT: 64.3450 },
  { JD: 2452365.5, DeltaT: 64.3735 },
  { JD: 2452395.5, DeltaT: 64.3943 },
  { JD: 2452426.5, DeltaT: 64.4151 },
  { JD: 2452456.5, DeltaT: 64.4132 },
  { JD: 2452487.5, DeltaT: 64.4118 },
  { JD: 2452518.5, DeltaT: 64.4097 },
  { JD: 2452548.5, DeltaT: 64.4168 },
  { JD: 2452579.5, DeltaT: 64.4329 },
  { JD: 2452609.5, DeltaT: 64.4511 },
  { JD: 2452640.5, DeltaT: 64.4734 },
  { JD: 2452671.5, DeltaT: 64.4893 },
  { JD: 2452699.5, DeltaT: 64.5053 },
  { JD: 2452730.5, DeltaT: 64.5269 },
  { JD: 2452760.5, DeltaT: 64.5471 },
  { JD: 2452791.5, DeltaT: 64.5597 },
  { JD: 2452821.5, DeltaT: 64.5512 },
  { JD: 2452852.5, DeltaT: 64.5371 },
  { JD: 2452883.5, DeltaT: 64.5359 },
  { JD: 2452913.5, DeltaT: 64.5415 },
  { JD: 2452944.5, DeltaT: 64.5544 },
  { JD: 2452974.5, DeltaT: 64.5654 },
  { JD: 2453005.5, DeltaT: 64.5736 },
  { JD: 2453036.5, DeltaT: 64.5891 },
  { JD: 2453065.5, DeltaT: 64.6015 },
  { JD: 2453096.5, DeltaT: 64.6176 },
  { JD: 2453126.5, DeltaT: 64.6374 },
  { JD: 2453157.5, DeltaT: 64.6549 },
  { JD: 2453187.5, DeltaT: 64.6530 },
  { JD: 2453218.5, DeltaT: 64.6379 },
  { JD: 2453249.5, DeltaT: 64.6372 },
  { JD: 2453279.5, DeltaT: 64.6400 },
  { JD: 2453310.5, DeltaT: 64.6543 },
  { JD: 2453340.5, DeltaT: 64.6723 },
  { JD: 2453371.5, DeltaT: 64.6876 },
  { JD: 2453402.5, DeltaT: 64.7052 },
  { JD: 2453430.5, DeltaT: 64.7313 },
  { JD: 2453461.5, DeltaT: 64.7575 },
  { JD: 2453491.5, DeltaT: 64.7811 },
  { JD: 2453522.5, DeltaT: 64.8001 },
  { JD: 2453552.5, DeltaT: 64.7995 },
  { JD: 2453583.5, DeltaT: 64.7876 },
  { JD: 2453614.5, DeltaT: 64.7831 },
  { JD: 2453644.5, DeltaT: 64.7921 },
  { JD: 2453675.5, DeltaT: 64.8096 },
  { JD: 2453705.5, DeltaT: 64.8311 },
  { JD: 2453736.5, DeltaT: 64.8452 },
  { JD: 2453767.5, DeltaT: 64.8597 },
  { JD: 2453795.5, DeltaT: 64.8850 },
  { JD: 2453826.5, DeltaT: 64.9175 },
  { JD: 2453856.5, DeltaT: 64.9480 },
  { JD: 2453887.5, DeltaT: 64.9794 },
  { JD: 2453917.5, DeltaT: 64.9895 },
  { JD: 2453948.5, DeltaT: 65.0028 },
  { JD: 2453979.5, DeltaT: 65.0138 },
  { JD: 2454009.5, DeltaT: 65.0371 },
  { JD: 2454040.5, DeltaT: 65.0773 },
  { JD: 2454070.5, DeltaT: 65.1122 },
  { JD: 2454101.5, DeltaT: 65.1464 },
  { JD: 2454132.5, DeltaT: 65.1833 },
  { JD: 2454160.5, DeltaT: 65.2145 },
  { JD: 2454191.5, DeltaT: 65.2494 },
  { JD: 2454221.5, DeltaT: 65.2921 },
  { JD: 2454252.5, DeltaT: 65.3279 },
  { JD: 2454282.5, DeltaT: 65.3413 },
  { JD: 2454313.5, DeltaT: 65.3452 },
  { JD: 2454344.5, DeltaT: 65.3496 },
  { JD: 2454374.5, DeltaT: 65.3711 },
  { JD: 2454405.5, DeltaT: 65.3972 },
  { JD: 2454435.5, DeltaT: 65.4296 },
  { JD: 2454466.5, DeltaT: 65.4573 },
  { JD: 2454497.5, DeltaT: 65.4868 },
  { JD: 2454526.5, DeltaT: 65.5152 },
  { JD: 2454557.5, DeltaT: 65.5450 },
  { JD: 2454587.5, DeltaT: 65.5781 },
  { JD: 2454618.5, DeltaT: 65.6127 },
  { JD: 2454648.5, DeltaT: 65.6288 },
  { JD: 2454679.5, DeltaT: 65.6370 },
  { JD: 2454710.5, DeltaT: 65.6493 },
  { JD: 2454740.5, DeltaT: 65.6760 },
  { JD: 2454771.5, DeltaT: 65.7097 },
  { JD: 2454801.5, DeltaT: 65.7461 },
  { JD: 2454832.5, DeltaT: 65.7768 },
  { JD: 2454863.5, DeltaT: 65.8025 },
  { JD: 2454891.5, DeltaT: 65.8237 },
  { JD: 2454922.5, DeltaT: 65.8595 },
  { JD: 2454952.5, DeltaT: 65.8973 },
  { JD: 2454983.5, DeltaT: 65.9323 },
  { JD: 2455013.5, DeltaT: 65.9509 },
  { JD: 2455044.5, DeltaT: 65.9534 },
  { JD: 2455075.5, DeltaT: 65.9628 },
  { JD: 2455105.5, DeltaT: 65.9839 },
  { JD: 2455136.5, DeltaT: 66.0147 },
  { JD: 2455166.5, DeltaT: 66.0420 },
  { JD: 2455197.5, DeltaT: 66.0699 },
  { JD: 2455228.5, DeltaT: 66.0961 },
  { JD: 2455256.5, DeltaT: 66.1310 },
  { JD: 2455287.5, DeltaT: 66.1683 },
  { JD: 2455317.5, DeltaT: 66.2072 },
  { JD: 2455348.5, DeltaT: 66.2356 },
  { JD: 2455378.5, DeltaT: 66.2409 },
  { JD: 2455409.5, DeltaT: 66.2335 },
  { JD: 2455440.5, DeltaT: 66.2349 },
  { JD: 2455470.5, DeltaT: 66.2441 },
  { JD: 2455501.5, DeltaT: 66.2751 },
  { JD: 2455531.5, DeltaT: 66.3054 },
  { JD: 2455562.5, DeltaT: 66.3246 },
  { JD: 2455593.5, DeltaT: 66.3406 },
  { JD: 2455621.5, DeltaT: 66.3624 },
  { JD: 2455652.5, DeltaT: 66.3957 },
  { JD: 2455682.5, DeltaT: 66.4289 },
  { JD: 2455713.5, DeltaT: 66.4619 },
  { JD: 2455743.5, DeltaT: 66.4749 },
  { JD: 2455774.5, DeltaT: 66.4751 },
  { JD: 2455805.5, DeltaT: 66.4829 },
  { JD: 2455835.5, DeltaT: 66.5056 },
  { JD: 2455866.5, DeltaT: 66.5383 },
  { JD: 2455896.5, DeltaT: 66.5706 },
  { JD: 2455927.5, DeltaT: 66.6030 },
  { JD: 2455958.5, DeltaT: 66.6340 },
  { JD: 2455987.5, DeltaT: 66.6569 },
  { JD: 2456018.5, DeltaT: 66.6925 }, // 1 April 2012
  { JD: 2456048.5, DeltaT: 66.7289 },
  { JD: 2456079.5, DeltaT: 66.7579 },
  { JD: 2456109.5, DeltaT: 66.7708 },
  { JD: 2456140.5, DeltaT: 66.7740 },
  { JD: 2456171.5, DeltaT: 66.7846 },
  { JD: 2456201.5, DeltaT: 66.8103 },
  { JD: 2456232.5, DeltaT: 66.8400 },
  { JD: 2456262.5, DeltaT: 66.8779 },
  { JD: 2456293.5, DeltaT: 66.9069 }, // 1 January 2013
  { JD: 2456324.5, DeltaT: 66.9443 }, // 1 Februrary 2013
  { JD: 2456352.5, DeltaT: 66.9763 }, // 1 March 2013
  { JD: 2456383.5, DeltaT: 67.0258 }, // 1 April 2013
  { JD: 2456413.5, DeltaT: 67.0716 }, // 1 May 2013
  { JD: 2456444.5, DeltaT: 67.1100 }, // 1 June 2013
  { JD: 2456474.5, DeltaT: 67.1266 }, // 1 July 2013
  { JD: 2456505.5, DeltaT: 67.1331 }, // 1 August 2013
  { JD: 2456536.5, DeltaT: 67.1458 }, // 1 September 2013
  { JD: 2456566.5, DeltaT: 67.1717 }, // 1 October 2013
  { JD: 2456597.5, DeltaT: 67.2091 }, // 1 November 2013
  { JD: 2456627.5, DeltaT: 67.2460 }, // 1 December 2013
  { JD: 2456658.5, DeltaT: 67.2810 }, // 1 January 2014
  { JD: 2456689.5, DeltaT: 67.3136 }, // 1 February 2014
  { JD: 2456717.5, DeltaT: 67.3457 }, // 1 March 2014
  { JD: 2456748.5, DeltaT: 67.3890 }, // 1 April 2014
  { JD: 2456778.5, DeltaT: 67.4318 }, // 1 May 2014
  { JD: 2456809.5, DeltaT: 67.4666 }, // 1 June 2014
  { JD: 2456839.5, DeltaT: 67.4858 }, // 1 July 2014
  { JD: 2456870.5, DeltaT: 67.4989 }, // 1 August 2014
  { JD: 2456901.5, DeltaT: 67.5111 }, // 1 September 2014
  { JD: 2456931.5, DeltaT: 67.5353 }, // 1 October 2014
  { JD: 2456962.5, DeltaT: 67.5711 }, // 1 November 2014
  { JD: 2456992.5, DeltaT: 67.6070 }, // 1 December 2014
  { JD: 2457023.5, DeltaT: 67.6439 }, // 1 January 2015
  { JD: 2457054.5, DeltaT: 67.6765 }, // 1 February 2015
  { JD: 2457082.5, DeltaT: 67.7117 }, // 1 March 2015
  { JD: 2457113.5, DeltaT: 67.7591 }, // 1 April 2015
  { JD: 2457143.5, DeltaT: 67.8012 }, // 1 May 2015
  { JD: 2457174.5, DeltaT: 67.8402 }, // 1 June 2015
  { JD: 2457204.5, DeltaT: 67.8606 }, // 1 July 2015
  { JD: 2457235.5, DeltaT: 67.8822 }, // 1 August 2015
  { JD: 2457266.5, DeltaT: 67.9120 }, // 1 September 2015
  { JD: 2457296.5, DeltaT: 67.9546 }, // 1 October 2015
  { JD: 2457327.5, DeltaT: 68.0055 }, // 1 November 2015
  { JD: 2457357.5, DeltaT: 68.0514 }, // 1 December 2015
  { JD: 2457388.5, DeltaT: 68.1024 }, // 1 January 2016
  { JD: 2457419.5, DeltaT: 68.1577 }, // 1 February 2016
  { JD: 2457448.5, DeltaT: 68.2044 }, // 1 March 2016
  { JD: 2457479.5, DeltaT: 68.2665 }, // 1 April 2016
  { JD: 2457509.5, DeltaT: 68.3188 }, // 1 May 2016
  { JD: 2457540.5, DeltaT: 68.3703 }, // 1 June 2016
  { JD: 2457570.5, DeltaT: 68.3964 }, // 1 July 2016
  { JD: 2457601.5, DeltaT: 68.4094 }, // 1 August 2016
  { JD: 2457632.5, DeltaT: 68.4305 }, // 1 September 2016
  { JD: 2457662.5, DeltaT: 68.4630 }, // 1 October 2016
  { JD: 2457693.5, DeltaT: 68.5078 }, // 1 November 2016
  { JD: 2457723.5, DeltaT: 68.5537 }, // 1 December 2016
  { JD: 2457754.5, DeltaT: 68.5928 }, // 1 January 2017
  { JD: 2457785.5, DeltaT: 68.6298 }, // 1 February 2017
  { JD: 2457813.5, DeltaT: 68.6671 }, // 1 March 2017
  { JD: 2457844.5, DeltaT: 68.7135 }, // 1 April 2017
  { JD: 2457874.5, DeltaT: 68.7623 }, // 1 May 2017
  { JD: 2457905.5, DeltaT: 68.8033 }, // 1 June 2017

// All these final values are predicted values from Year 2017.5 to Year 2026.0 are taken from http:// maia.usno.navy.mil/ser7/deltat.preds
  { JD: 2457937.0, DeltaT: 68.81 }, // 2017.5
  { JD: 2458028.25, DeltaT: 68.86 }, // 2017.75
  { JD: 2458119.5, DeltaT: 68.99 }, // 2018.0
  { JD: 2458210.75, DeltaT: 69.14 }, // 2018.25
  { JD: 2458302.0, DeltaT: 69.3 }, // 2018.5
  { JD: 2458484.5, DeltaT: 69.5 }, // 2019.0
  { JD: 2458575.75, DeltaT: 69.6 }, // 2019.25
  { JD: 2458667.0, DeltaT: 69.7 }, // 2019.5
  { JD: 2458758.25, DeltaT: 69.8 }, // 2019.75
  { JD: 2458849.5, DeltaT: 69.9 }, // 2020.0
  { JD: 2458941.0, DeltaT: 70 }, // 2020.25
  { JD: 2459763.0, DeltaT: 71 }, // 2022.5
  { JD: 2461041.5, DeltaT: 72 } // 2026.0
// Note as currently coded there is a single discontinuity of c. 2.074 seconds on 1 January 2026. At this point http:// maia.usno.navy.mil/ser7/deltat.preds indicates an error value for DeltaT of about 5 seconds anyway.
  ]

const gLeapSecondCoefficients = //  Cumulative leap second values from 1 Jan 1961 to 1 January 2017 as taken from http:// maia.usno.navy.mil/ser7/tai-utc.dat
  [
    { JD: 2437300.5, LeapSeconds: 1.4228180, BaseMJD: 37300, Coefficient: 0.001296 },
    { JD: 2437512.5, LeapSeconds: 1.3728180, BaseMJD: 37300, Coefficient: 0.001296 },
    { JD: 2437665.5, LeapSeconds: 1.8458580, BaseMJD: 37665, Coefficient: 0.0011232 },
    { JD: 2438334.5, LeapSeconds: 1.9458580, BaseMJD: 37665, Coefficient: 0.0011232 },
    { JD: 2438395.5, LeapSeconds: 3.2401300, BaseMJD: 38761, Coefficient: 0.001296 },
    { JD: 2438486.5, LeapSeconds: 3.3401300, BaseMJD: 38761, Coefficient: 0.001296 },
    { JD: 2438639.5, LeapSeconds: 3.4401300, BaseMJD: 38761, Coefficient: 0.001296 },
    { JD: 2438761.5, LeapSeconds: 3.5401300, BaseMJD: 38761, Coefficient: 0.001296 },
    { JD: 2438820.5, LeapSeconds: 3.6401300, BaseMJD: 38761, Coefficient: 0.001296 },
    { JD: 2438942.5, LeapSeconds: 3.7401300, BaseMJD: 38761, Coefficient: 0.001296 },
    { JD: 2439004.5, LeapSeconds: 3.8401300, BaseMJD: 38761, Coefficient: 0.001296 },
    { JD: 2439126.5, LeapSeconds: 4.3131700, BaseMJD: 39126, Coefficient: 0.002592 },
    { JD: 2439887.5, LeapSeconds: 4.2131700, BaseMJD: 39126, Coefficient: 0.002592 },
    { JD: 2441317.5, LeapSeconds: 10.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2441499.5, LeapSeconds: 11.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2441683.5, LeapSeconds: 12.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2442048.5, LeapSeconds: 13.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2442413.5, LeapSeconds: 14.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2442778.5, LeapSeconds: 15.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2443144.5, LeapSeconds: 16.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2443509.5, LeapSeconds: 17.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2443874.5, LeapSeconds: 18.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2444239.5, LeapSeconds: 19.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2444786.5, LeapSeconds: 20.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2445151.5, LeapSeconds: 21.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2445516.5, LeapSeconds: 22.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2446247.5, LeapSeconds: 23.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2447161.5, LeapSeconds: 24.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2447892.5, LeapSeconds: 25.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2448257.5, LeapSeconds: 26.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2448804.5, LeapSeconds: 27.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2449169.5, LeapSeconds: 28.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2449534.5, LeapSeconds: 29.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2450083.5, LeapSeconds: 30.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2450630.5, LeapSeconds: 31.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2451179.5, LeapSeconds: 32.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2453736.5, LeapSeconds: 33.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2454832.5, LeapSeconds: 34.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2456109.5, LeapSeconds: 35.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2457204.5, LeapSeconds: 36.0, BaseMJD: 41317, Coefficient: 0.0 },
    { JD: 2457754.5, LeapSeconds: 37.0, BaseMJD: 41317, Coefficient: 0.0 }
  ]

// // // // // // // // // // // // // // // // //  Implementation // // // // // // // // // // // // // // /

export function getDeltaT (jd: JulianDay): number {
  // What will be the return value from the method
  let Delta = 0

  // Determine if we can use the lookup table
  const nLookupElements = gDeltaTValues.length
  if ((jd >= gDeltaTValues[0].JD) && (jd < gDeltaTValues[nLookupElements - 1].JD)) {
    // Find the index in the lookup table which contains the JD value closest to the JD input parameter
    let bFound = false
    let nFoundIndex = 0
    while (!bFound) {
      // assert(nFoundIndex < nLookupElements)
      bFound = (gDeltaTValues[nFoundIndex].JD > jd)

      // Prepare for the next loop
      if (!bFound) {
        ++nFoundIndex
      } else {
        // Now do a simple linear interpolation of the DeltaT values from the lookup table
        Delta = (jd - gDeltaTValues[nFoundIndex - 1].JD) / (gDeltaTValues[nFoundIndex].JD - gDeltaTValues[nFoundIndex - 1].JD) * (gDeltaTValues[nFoundIndex].DeltaT - gDeltaTValues[nFoundIndex - 1].DeltaT) + gDeltaTValues[nFoundIndex - 1].DeltaT
      }
    }
  } else {
    const y = dates.fractionalYear(jd)

    // Use the polynomial expressions from Espenak & Meeus 2006. References: http:// eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html and
    // http:// www.staff.science.uu.nl/~gent0113/deltat/deltat_old.htm (Espenak & Meeus 2006 section)
    if (y < -500) {
      const u = (y - 1820) / 100.0
      const u2 = u * u
      Delta = -20 + (32 * u2)
    } else if (y < 500) {
      const u = y / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      const u6 = u5 * u
      Delta = 10583.6 + (-1014.41 * u) + (33.78311 * u2) + (-5.952053 * u3) + (-0.1798452 * u4) + (0.022174192 * u5) + (0.0090316521 * u6)
    } else if (y < 1600) {
      const u = (y - 1000) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      const u6 = u5 * u
      Delta = 1574.2 + (-556.01 * u) + (71.23472 * u2) + (0.319781 * u3) + (-0.8503463 * u4) + (-0.005050998 * u5) + (0.0083572073 * u6)
    } else if (y < 1700) {
      const u = (y - 1600) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      Delta = 120 + (-98.08 * u) + (-153.2 * u2) + (u3 / 0.007129)
    } else if (y < 1800) {
      const u = (y - 1700) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      Delta = 8.83 + (16.03 * u) + (-59.285 * u2) + (133.36 * u3) + (-u4 / 0.01174)
    } else if (y < 1860) {
      const u = (y - 1800) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      const u6 = u5 * u
      const u7 = u6 * u
      Delta = 13.72 + (-33.2447 * u) + (68.612 * u2) + (4111.6 * u3) + (-37436 * u4) + (121272 * u5) + (-169900 * u6) + (87500 * u7)
    } else if (y < 1900) {
      const u = (y - 1860) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      Delta = 7.62 + (57.37 * u) + (-2517.54 * u2) + (16806.68 * u3) + (-44736.24 * u4) + (u5 / 0.0000233174)
    } else if (y < 1920) {
      const u = (y - 1900) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      Delta = -2.79 + (149.4119 * u) + (-598.939 * u2) + (6196.6 * u3) + (-19700 * u4)
    } else if (y < 1941) {
      const u = (y - 1920) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      Delta = 21.20 + (84.493 * u) + (-761.00 * u2) + (2093.6 * u3)
    } else if (y < 1961) {
      const u = (y - 1950) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      Delta = 29.07 + (40.7 * u) + (-u2 / 0.0233) + (u3 / 0.002547)
    } else if (y < 1986) {
      const u = (y - 1975) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      Delta = 45.45 + 106.7 * u - u2 / 0.026 - u3 / 0.000718
    } else if (y < 2005) {
      const u = (y - 2000) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      Delta = 63.86 + (33.45 * u) + (-603.74 * u2) + (1727.5 * u3) + (65181.4 * u4) + (237359.9 * u5)
    } else if (y < 2050) {
      const u = (y - 2000) / 100.0
      const u2 = u * u
      Delta = 62.92 + (32.217 * u) + (55.89 * u2)
    } else if (y < 2150) {
      const u = (y - 1820) / 100.0
      const u2 = u * u
      Delta = -205.72 + (56.28 * u) + (32 * u2)
    } else {
      const u = (y - 1820) / 100.0
      const u2 = u * u
      Delta = -20 + (32 * u2)
    }
  }

  return Delta
}

export function getCumulativeLeapSeconds (jd: JulianDay): number {
  // What will be the return value from the method
  let LeapSeconds = 0

  const nLookupElements = gLeapSecondCoefficients.length
  if (jd >= gLeapSecondCoefficients[0].JD) {
    // Find the index in the lookup table which contains the JD value closest to the JD input parameter
    let bContinue = true
    let nIndex = 1
    while (bContinue) {
      if (nIndex >= nLookupElements) {
        LeapSeconds = gLeapSecondCoefficients[nLookupElements - 1].LeapSeconds + (jd - 2400000.5 - gLeapSecondCoefficients[nLookupElements - 1].BaseMJD) * gLeapSecondCoefficients[nLookupElements - 1].Coefficient
        bContinue = false
      } else if (jd < gLeapSecondCoefficients[nIndex].JD) {
        LeapSeconds = gLeapSecondCoefficients[nIndex - 1].LeapSeconds + (jd - 2400000.5 - gLeapSecondCoefficients[nIndex - 1].BaseMJD) * gLeapSecondCoefficients[nIndex - 1].Coefficient
        bContinue = false
      }

      // Prepare for the next loop
      if (bContinue) {
        ++nIndex
      }
    }
  }

  return LeapSeconds
}

export function transformTT2UTC (jd: JulianDay): number {
  // Outside of the range 1 January 1961 to 500 days after the last leap second,
  // we implement TT2UTC as TT2UT1
  const nLookupElements = gLeapSecondCoefficients.length
  if ((jd < gLeapSecondCoefficients[0].JD) || (jd > (gLeapSecondCoefficients[nLookupElements - 1].JD + 500))) {
    return transformTT2UT1(jd)
  }

  const DT = getDeltaT(jd)
  const UT1 = jd - (DT / 86400.0)
  const LeapSeconds = getCumulativeLeapSeconds(jd)
  return ((DT - LeapSeconds - 32.184) / 86400.0) + UT1
}

export function transformUTC2TT (jd: JulianDay): number {
  // Outside of the range 1 January 1961 to 500 days after the last leap second,
  // we implement TT2UTC as TT2UT1
  const nLookupElements = gLeapSecondCoefficients.length
  if ((jd < gLeapSecondCoefficients[0].JD) || (jd > (gLeapSecondCoefficients[nLookupElements - 1].JD + 500))) {
    return transformUT12TT(jd)
  }

  const DT = getDeltaT(jd)
  const LeapSeconds = getCumulativeLeapSeconds(jd)
  const UT1 = jd - ((DT - LeapSeconds - 32.184) / 86400.0)
  return UT1 + (DT / 86400.0)
}

export function transformTT2TAI (jd: JulianDay): number {
  return jd - (32.184 / 86400.0)
}

export function transformTAI2TT (jd: JulianDay): number {
  return jd + (32.184 / 86400.0)
}

export function transformTT2UT1 (jd: JulianDay): number {
  return jd - (getDeltaT(jd) / 86400.0)
}

export function transformUT12TT (jd: JulianDay): number {
  return jd + (getDeltaT(jd) / 86400.0)
}

export function transformUT1MinusUTC (jd: JulianDay): number {
  const JDUTC = jd + ((getDeltaT(jd) - getCumulativeLeapSeconds(jd) - 32.184) / 86400)
  return (jd - JDUTC) * 86400
}

