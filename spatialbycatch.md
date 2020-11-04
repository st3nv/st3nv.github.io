---
layout: page
title: Spatial bycatch prediction
bigimg:
  - "/img/big-img/DBRK_byyear_lowres.png"
---

Catch of non-targeted species (bycatch) is a significant concern in many fisheries, and the first step in evaluating these impacts is to estimate how much bycatch occurs. Together with researchers at the NWFSC (Eric Ward, Jim Thorson, Jason Jannot) and SWFSC (Tomo Eguchi), I compared how well different spatiotemporal model frameworks predict bycatch:
  - GLM
  - GAM 
  - GMRF (INLA-SPDE)
  - Random forests

### Spatial models versus the status quo ratio estimator

Quantifying effects of fishing on non-targeted (bycatch) species is an important management and conservation issue. Annual bycatch estimates are typically calculated using data collected by on-board observers, but observer programs are costly and therefore often only cover a small percentage of the fishery. The challenge is then to estimate bycatch for the unobserved fishing activity. The status quo for most fisheries is to assume the ratio of bycatch to effort is constant and multiply this ratio by the effort in the unobserved activity (ratio estimator). We used a dataset with 100% observer coverage, 35 440 hauls from the US west coast groundfish trawl fishery, to evaluate the ratio estimator against methods that utilize fine-scale spatial information: generalized additive models (GAMs) and random forests. We found that random forests performed best (lower root mean square error) for all 15 species considered, across a range of bycatch rates. Random forests were slightly biased (overpredicting total bycatch), however, so the choice of bycatch estimation method involves a tradeoff between bias and precision.

**Stock BC**, Ward EJ, Thorson JT, Jannot JE, and Semmens BX. 2019. The utility of spatial model-based estimators of unobserved bycatch. ICES Journal of Marine Science. [link](https://academic.oup.com/icesjms/advance-article/doi/10.1093/icesjms/fsy153/5144592?guestAccessKey=881112b1-1e93-4059-841f-d23dcaf89857)

### Spatial models for dynamic management

"Dynamic management" is a recently proposed approach to reduce bycatch, where maps of bycatch risk hotspots are updated at high frequency (real-time, daily, weekly, etc.). However, which spatiotemporal model framework to use for generating these predictions is unclear. We evaluated several "species distribution models" ability to predict bycatch of six species with a broad range of movement patterns and bycatch rates. Random forests had the best interpolation performance but were more sensitive when predicting data at the edge of the fishery (i.e. spatial extrapolation). Using random forests to identify and remove the 5% highest bycatch risk fishing events reduced the bycatch-to-target species catch ratio by 34% on average. All models considerably reduced the bycatch-to-target ratio, demonstrating the clear potential of species distribution models to support spatial fishery management.

**Stock BC**, Ward EJ, Eguchi T, Jannot JE, Thorson JT, Feist BE, and Semmens BX. 2020. Comparing predictions of fisheries bycatch using multiple spatiotemporal species distribution model frameworks. Canadian Journal of Fisheries and Aquatic Sciences. [CJFAS](https://www.nrcresearchpress.com/doi/abs/10.1139/cjfas-2018-0281), [author's copy](/pdf/Stock-2019-comparing-SDMs-spatial-bycatch.pdf)

We presented an overview and additional related work at:

[Can we use random forests for spatiotemporal CPUE modeling?](/pdf/Stock_randomforests_030118_final_small.pdf) Stock BC, Ward EJ, and Semmens BX. CAPAM Spatiotemporal Modeling workshop, La Jolla, CA, Feb 2018.
