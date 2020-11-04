---
layout: page
title: The Woods Hole Stock Assessment (WHAM) model
bigimg:
  - "/img/big-img/seakeeper_wide.jpg"
---

Many marine ecosystems that support fisheries are rapidly changing, and this poses a challenge to stock assessment and management that typically assumes productivity is constant in time. In single-species assessments, two main approaches have been used to account for productivity changes: allowing biological parameters to vary stochastically over time (empirical), or explicitly linking population processes such as recruitment or natural mortality to environmental covariates (mechanistic). 

Dr. Tim Miller and I are developing the Woods Hole Assessment Model (WHAM) [framework](https://github.com/brianstock-NOAA/wham-sim/blob/master/paper/wham-sim-paper.pdf) and [software package](https://timjmiller.github.io/wham/), which combines these two approaches. WHAM can estimate time- and age-varying random effects on annual transitions in numbers at age, natural mortality, and selectivity, as well as fit environmental time-series with process and observation errors, missing data, and nonlinear links to recruitment and natural mortality. WHAM can also be configured as a traditional statistical catch-at-age model in order to easily bridge from status quo models and test them against models with state-space and environmental effects, all within a single framework.
