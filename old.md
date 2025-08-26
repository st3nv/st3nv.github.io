---
layout: page
title: Tengyu Song
use-site-title: true
bigimg:
  - "../img/big-img/IMG_7260.JPG" : "Aug 20 2021, Shanghai"
  - "../img/big-img/IMG_7440.png" : "Sep 9 2021, New York"
  - "../img/big-img/IMG_7451.png" : "Sep 11 2021, New York"
  - "../img/big-img/sufe.png" : "2019, Shanghai"
---

 My name is Tengyu Song. I'm a PhD student at George Mason University. My research interests range from interpretable machine learning, robust statistics and differential privacy. Please check out my portfolio below, or visit my <a href="https://st3nv.github.io/blogs.html"><b>Blogs</b></a> or <a href="https://github.com/st3nv"><b>Github</b></a>. If you want to shoot a message, please email me at <a href=""><b>songtengyu33@gmail.com</b></a>.



<div class="project-card-wrapper">
    <!-- title -->
    <div class="project-title">
        Selected Projects
    </div>
    <div class="card-container">
        <div class="single-project-card">
            <article class="group relative aspect-video h-80 w-full sm:w-[26rem] cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-2xl m-2">
                <img class="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 ease-out group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-300" src="https://upload.wikimedia.org/wikipedia/commons/9/95/R179_C_train_at_West_4th_Street.jpg" alt="">
                <div class="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent to-90% text-white transition-all duration-300 group-hover:bg-gradient-to-t group-hover:from-black/60 group-hover:transition-all group-hover:duration-500">
                    <h2 class="absolute bottom-4 left-4 m-0 font-extrabold uppercase text-lg transition-all delay-300 duration-100 ease-out group-hover:bottom-1/2 group-hover:delay-0 group-hover:duration-300">
                        Dynamic Pricing for NYC Subway
                    </h2>
                    <p class="absolute left-4 top-1/2 line-clamp-3 max-w-[80%] pt-2 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-hover:delay-500 group-hover:duration-300">
                        Utilizing the MTA turnstile data, we built a dynamic pricing model based on ridership prediction and demand elasticity.
                    </p>
                    <a class="absolute bottom-4 left-4 max-w-[80%] rounded-lg border px-2 py-1 uppercase opacity-0 transition-opacity ease-out group-hover:opacity-100 group-hover:transition-opacity group-hover:delay-500 group-hover:duration-300" href="./pdf/CDSS Hackathon HRT.pdf" target="_blank">Learn more</a>
                </div>
            </article>
        </div>
        <!-- Repeat other cards here -->
        
    </div>
</div>

<style>
/* General styles */
.project-card-wrapper {
    padding: 1rem;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}

.single-project-card {
    flex: 1 1 calc(100% - 2rem); /* Default to full width */
    max-width: 26rem; /* Limit max width */
}

/* Responsive styles */
@media (min-width: 640px) {
    .single-project-card {
        flex: 1 1 calc(50% - 2rem); /* Two cards per row on medium screens */
    }
}

@media (min-width: 1024px) {
    .single-project-card {
        flex: 1 1 calc(33.333% - 2rem); /* Three cards per row on large screens */
    }
}
</style>


