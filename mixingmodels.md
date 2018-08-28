---
layout: page
title: Bayesian mixing models
bigimg:
  - "/img/big-img/mixing_models.jpg"
---

Mixing models are statistical tools that use biotracers to estimate contributions of sources to a mixture, for example:
  - Diet in ecology (sources = prey, mixture = consumers)
  - Movement in ecology (sources = regions, mixture = animals that can move between regions)
  - Sediments in river systems (sources = upstream land uses, mixture = downstream sediment)

In addition to developing open-source software to construct and run mixing models ([MixSIAR](https://brianstock.github.io/mixsiar)), I have worked on the following projects:

### MixSIAR model description

In this paper we provide guidance to mixing model users and describe the main improvements of MixSIAR over previously existing software (MixSIR, SIAR):
  1. Better error structures
  2. Constructing informative priors
  3. Options for incorporating source uncertainty (fit source data within model, i.e. admit the *sample mean* is not the truth)
  4. Options for incorporating consumer diet variability via covariate effects, calculate relative support for multiple models via WAIC or LOOic

**Stock BC**, Jackson AL, Ward EJ, Parnell AC, Phillips DL, and Semmens BX. 2018. Analyzing mixing systems using a new generation of Bayesian tracer mixing models. *PeerJ* 6:e5096. [https://doi.org/10.7717/peerj.5096](https://doi.org/10.7717/peerj.5096)

### An improved mixing model error structure

In the course of developing MixSIAR, Brice Semmens and I realized that the ecological assumptions of existing mixing models--as encoded in their error structures--were unrealistic. We came up with a new error parameterization based on more realistic assumptions about the predation process--how biotracer values in prey should relate to biotracer values in consumers. We showed that this new error structure outperformed existing models, as well as implicitly providing an estimate of consumption. This "multiplicative error" term is included as an option in [MixSIAR](https://brianstock.github.io/mixsiar).

**Stock BC** and Semmens BX. 2016. Unifying error structures in commonly used biotracer mixing models. *Ecology* 97(10): 2562-2569. [pdf](/pdf/Stock_Semmens_2016_unifying_error_structures.pdf)

### "Smasher" mantis shrimp: generalist diet despite specialized morphology

Smashing mantis shrimp have a hammer-like club (modified mouthparts) that delivers one of the fastest and most powerful strikes in the animal kingdom. This specialized morphology allows them to break open hard-shelled prey like clams and snails. Through feeding trials and stable isotope mixing models, we found that smashing mantis shrimp eat a generalist diet including fish--despite being physically specialized for consuming hard-shelled prey. One neat aspect of this study is that we showed that this result was robust across several alternative priors in the Bayesian mixing model (i.e. alternative a priori expectations).

deVries MS, **Stock BC**, Christy JH, Goldsmith GR, and Dawson TE. 2016. Specialized morphology corresponds to a generalist diet: linking form and function in smashing mantis shrimp crustaceans. *Oecologia* 128(2): 429–442. [pdf](/pdf/deVries_2016_mantis_shrimp.pdf)

### Applying MixSIAR to sediment fingerprinting

Bayesian mixing models were originally developed to calculate animal diets in ecology, but they are also commonly applied to sediments in river systems. In this case, the sources are upstream land uses (e.g. forest, agricultural fields) and the mixture is downstream sediment. In this paper we translate the mixing model terminology from ecology to soil science (e.g. consumer/prey stable isotope values vary by body size --> source/sediment fatty acid values vary by rainfall intensity) and provide recommendations for applying mixing models in soil science.

Upadhayay HR, Bodé S, Griepentrog M, Huygens D, Bajracharya RM, Blake WH, Dercon G, Mabit L, Gibbs M, Semmens BX, and **Stock BC**. 2017. Methodological perspectives on the application of compound-specific stable isotope fingerprinting for sediment source apportionment. *Journal of Soils and Sediments* 17(6):1537-1553. [pdf](/pdf/Upadhayay_2017_cssi_sediment_fingerprinting.pdf)

### Presentations

[Bayesian (stable isotope) mixing models: MixSIAR](/pdf/mixsiar_sioSIgroup_052217.pdf) - May 2017
  1. Consumer variability via covariate effects (i.e. allow consumers to not all have the same diet)
  2. Source uncertainty (fits source data within model, i.e. admit the *sample mean* is not the truth)
  3. Better error structures ([Stock and Semmens 2016](/pdf/Stock_Semmens_2016_unifying_error_structures.pdf))
  4. Construct informative priors
  5. Graphical User Interface (GUI) and script versions

[What do mantis shrimp eat?](/pdf/mantis_shrimp_diet.pdf) - Birch Aquarium + local dive shop - Dec 2015
  - How stable isotopes work (general public audience)
  - Mantis shrimp study results (deVries et al. 2016)

[Use and abuse of mixing models](/pdf/Brian_Stock_MixSIAR_ESA_2015.pdf) - ESA - Aug 2015
  - Bayesian mixing models are not biased, they have priors
  - Constructing informative priors
  - Application to biotracers besides stable isotopes
  - Error structures in MixSIR vs. SIAR vs. MixSIAR

[The guts of MixSIAR](/pdf/MixSIAR_guts_BrianStock_NWFSC_Aug_29_2014.pdf) - NWFSC - Aug 2014
  - Technical details for ecologists

[MixSIAR: Advanced stable isotope mixing models in R](/pdf/MixSIAR_BrianStock_ESA_2014.pdf) - ESA - Aug 2014
  - Overview for ecologists
  - Why use *Bayesian* mixing models?
  - Why use MixSIAR?
