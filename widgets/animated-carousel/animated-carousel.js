document.addEventListener('DOMContentLoaded', function() {
    const swiperEl = document.querySelector('.animated-carousel');
    if (!swiperEl) {
        return; // Si no hay elemento, salir de la función
    }
    if (swiperEl.getAttribute('data-slides')<=1){
        const nextBtn = swiperEl.querySelector('.swiper-button-next');
        const prevBtn = swiperEl.querySelector('.swiper-button-prev');
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }

    const animatedCarousel = new Swiper('.animated-carousel .swiper', {
        slidesPerView: 1,
        spaceBetween: 15,
        loop: true,
        speed: 1000,
        // autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false 
        // },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
           
        },
        breakpoints: {
            768: {
                slidesPerView: 1,
            }
        }
    });

    animatedCarousel.update();
});
