---
layout: page
title: Woods Hole Stock Assessment Model (WHAM)
bigimg:
  - "/img/big-img/seakeeper_wide.jpg"
---

Dr. Tim Miller and I are developing the Woods Hole Assessment Model ([WHAM](https://timjmiller.github.io/wham/)), an R/TMB package to run state-space age-structured stock assessment models. The state-space framework is attractive because it can estimate observation and process error, as well as naturally propagate random effect parameters in stock projections.

- Designed to include environmental effects on population processes (recruitment, M)
- Random effects with 2D autocorrelation (recruitment / numbers at age, selectivity, M)

Miller TJ and **Stock BC**. The Woods Hole Assessment Model (WHAM), version 1.0. https://timjmiller.github.io/wham/.

Many marine ecosystems that support fisheries are rapidly changing, and this poses a challenge to stock assessment and management that typically assumes productivity is constant in time. In single-species assessments, two main approaches have been used to account for productivity changes: allowing biological parameters to vary stochastically over time (empirical), or explicitly linking population processes such as recruitment or natural mortality to environmental covariates (mechanistic). 

WHAM combines these two approaches and can estimate time- and age-varying random effects on annual transitions in numbers at age, natural mortality, and selectivity, as well as fit environmental time-series with process and observation errors, missing data, and nonlinear links to recruitment and natural mortality. WHAM can also be configured as a traditional statistical catch-at-age model in order to easily bridge from status quo models and test them against models with state-space and environmental effects, all within a single framework.

