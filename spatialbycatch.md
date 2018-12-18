---
layout: page
title: Spatial bycatch prediction
bigimg:
  - "/img/big-img/DBRK_byyear_lowres.png"
---

Catch of non-targeted species (bycatch) is a significant concern in many fisheries, and the first step in evaluating these impacts is to estimate how much bycatch occurs. Together with researchers at the NWFSC (Eric Ward, Jim Thorson, Jason Jannot) and SWFSC (Tomo Eguchi), I have been testing how well different "species distribution models" predict bycatch:
  - GLM
  - GAM 
  - GMRF (INLA-SPDE)
  - Random forests

### Spatial models versus the status quo ratio estimator

Quantifying effects of fishing on non-targeted (bycatch) species is an important management and conservation issue. Annual bycatch estimates are typically calculated using data collected by on-board observers, but observer programs are costly and therefore often only cover a small percentage of the fishery. The challenge is then to estimate bycatch for the unobserved fishing activity. The status quo for most fisheries is to assume the ratio of bycatch to effort is constant and multiply this ratio by the effort in the unobserved activity (ratio estimator). We used a dataset with 100% observer coverage, 35 440 hauls from the US west coast groundfish trawl fishery, to evaluate the ratio estimator against methods that utilize fine-scale spatial information: generalized additive models (GAMs) and random forests. We found that random forests performed best (lower root mean square error) for all 15 species considered, across a range of bycatch rates. Random forests were slightly biased (overpredicting total bycatch), however, so the choice of bycatch estimation method involves a tradeoff between bias and precision.

**Stock BC**, Ward EJ, Thorson JT, Jannot JE, and Semmens BX. 2018. The utility of spatial model-based estimators of unobserved bycatch. ICES Journal of Marine Science. [link](https://academic.oup.com/icesjms/advance-article/doi/10.1093/icesjms/fsy153/5144592?guestAccessKey=881112b1-1e93-4059-841f-d23dcaf89857)

### Spatial models for dynamic management

"Dynamic management" is a recently proposed approach to reduce bycatch, where maps of bycatch risk hotspots are updated at high frequency (real-time, daily, weekly, etc.). However, which spatiotemporal model framework to use for generating these predictions is unclear. We evaluated several "species distribution models" ability to predict bycatch of six species with a broad range of movement patterns and bycatch rates. Random forests had the best interpolation performance but were more sensitive when predicting data at the edge of the fishery (i.e. spatial extrapolation). Using random forests to identify and remove the 5% highest bycatch risk fishing events reduced the bycatch-to-target species catch ratio by 34% on average. All models considerably reduced the bycatch-to-target ratio, demonstrating the clear potential of species distribution models to support spatial fishery management.

This work is still in progress, but I have presented preliminary findings at:

[Can we use random forests for spatiotemporal CPUE modeling?](/pdf/Stock_randomforests_030118_final_small.pdf) - CAPAM Spatiotemporal Modeling workshop - Feb 2018

[What spatial statistical model is best for predicting fisheries bycatch risk?](/pdf/Stock_bycatch_091117.pdf) - Applied math seminar - Claremont Colleges - Sept 2017

[Predicting fisheries bycatch risk for dynamic spatial management](/pdf/PSAW_011917_SpatialBycatch_Stock.pdf) - National Protected Species Assessment Workshop - AFSC - Jan 2017
