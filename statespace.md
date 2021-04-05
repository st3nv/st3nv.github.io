---
layout: page
title: State-space stock assessment
bigimg:
  - "/img/big-img/seakeeper_wide.jpg"
---

Many marine ecosystems that support fisheries are rapidly changing, and this poses a challenge to stock assessment and management that typically assumes productivity is constant in time. In single-species assessments, two main approaches have been used to account for productivity changes: 

- (empirical) allowing biological parameters to vary stochastically over time, or 
- (mechanistic) explicitly linking population processes such as recruitment or natural mortality to environmental covariates.

Dr. Tim Miller and I are developing the Woods Hole Assessment Model (WHAM) framework and [software package](https://timjmiller.github.io/wham/), which combines these two approaches. WHAM can estimate time- and age-varying random effects on annual transitions in numbers at age, natural mortality, and selectivity, as well as fit environmental time-series with process and observation errors, missing data, and nonlinear links to recruitment and natural mortality. WHAM can also be configured as a traditional statistical catch-at-age model in order to easily bridge from status quo models and test them against models with state-space and environmental effects, all within a single framework.

**Stock BC** and Miller TJ. The Woods Hole Assessment Model (WHAM): a general state-space assessment framework that incorporates time- and age-varying processes via random effects and links to environmental covariates. *Fisheries Research*. In press. [preprint](https://github.com/brianstock-NOAA/wham-sim/blob/master/paper/wham-sim-paper.pdf)

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/o8vJvbIaOdE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Random effects with 2D autocorrelation (age x year)

State-space assessment models can estimate stochastic deviations in survival, which represent variability in some ambiguous combination of natural mortality (*M*), fishing mortality (*F*), and migration. These survival deviations are generally treated as independent by age and year, even though many population processes can be autocorrelated and not accounting for autocorrelation can result in notable bias. We incorporated two-dimensional (2D, age and year) first-order autocorrelation in survival and *M* into the assessment for Southern New England-Mid Atlantic yellowtail flounder. Models with 2D autocorrelation fit the data better and had reduced retrospective pattern than models without autocorrelation.

**Stock BC**, Xu H, Miller TJ, Thorson JT, and Nye JA. 2021. Implementing two-dimensional autocorrelation in either survival or natural mortality improves a state-space assessment model for Southern New England-Mid Atlantic yellowtail flounder. *Fisheries Research*. [https://doi.org/10.1016/j.fishres.2021.105873](https://authors.elsevier.com/a/1cRwJbiU1rjjB)


