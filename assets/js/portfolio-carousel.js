(function ($) {
    const initPortfolioCarousel = ($scope) => {
        const $carousel = $scope.find('.portfolio-carousel');
        const settings = $carousel.data('settings') || {};
        const config = {
            slidesPerView: settings.slidesPerView || 3,
            spaceBetween: settings.spaceBetween || 20,
            loop: false,
            freeMode: true,
            grabCursor: true,
            breakpoints: {
                1024: { // Desktop
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                768: { // Tablet
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                480: { // Mobile
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
            },
        }
        console.log(config);
        new Swiper($carousel[0], config);
    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/portfolio-carousel.default',
            initPortfolioCarousel
        );
    });
})(jQuery);
