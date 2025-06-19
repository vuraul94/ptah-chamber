<?php

if (!defined('ABSPATH')) {
    exit;
}


function register_animated_carousel_scripts()
{
    wp_register_script('animated-carousel-script', plugins_url('../dist/js/animated-carousel-script.js', dirname(__FILE__)), ['jquery'], '1.0.0', true);
    wp_register_style('animated-carousel-style', plugins_url('../dist/css/animated-carousel-style.css', dirname(__FILE__)), [], '1.0.0', 'all');
}

add_action('wp_enqueue_scripts', 'register_animated_carousel_scripts');
add_action('elementor/editor/after_enqueue_scripts', 'register_animated_carousel_scripts');


// Registrar el widget en Elementor
function register_animated_carousel_widget($widgets_manager)
{
    class Animated_Carousel_Widget extends \Elementor\Widget_Base
    {
        public function get_name()
        {
            return 'animated-carousel';
        }

        public function get_title()
        {
            return __('Animated Carousel', 'text-domain');
        }

        public function get_icon()
        {
            return 'eicon-slider-full-screen';
        }

        public function get_categories()
        {
            return ['text-domain'];
        }

        public function get_script_depends()
        {
            return ['animated-carousel-script', 'swiper-script'];
        }

        public function get_style_depends()
        {
            return ['animated-carousel-styles', 'swiper-styles'];
        }

        protected function _register_controls()
        {
            $this->start_controls_section(
                'section_content',
                [
                    'label' => __('Contenido del carrusel', 'text-domain'),
                    'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
                ]
            );

            $this->add_control(
                'carousel_items',
                [
                    'label' => __('Elementos del carrusel', 'text-domain'),
                    'type'  => \Elementor\Controls_Manager::REPEATER,
                    'fields' => [
                        [
                            'name'        => 'image',
                            'label'       => __('Imagen', 'text-domain'),
                            'type'        => \Elementor\Controls_Manager::MEDIA,
                            'default'     => [
                                'url' => \Elementor\Utils::get_placeholder_image_src(),
                            ],
                        ],
                    ],
                    'title_field' => '{{{ image.url }}}',
                ]
            );

            $this->end_controls_section();
        }

        protected function render()
        {
            $settings = $this->get_settings_for_display();
            if (!empty($settings['carousel_items'])):
?>

                <div class="animated-carousel-container">
                    
                    <div class="animated-carousel" data-slides="<?php echo count($settings['carousel_items']);?>">
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper">
                            <div class="swiper-wrapper">
                                <?php foreach ($settings['carousel_items'] as $item): ?>
                                    <div class="swiper-slide">
                                        <div class="animated-item">
                                            <div class="item-separator">
                                                <img src="<?php echo esc_url($item['image']['url']); ?>" alt="Imagen">
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>

                
                        
                    
                    </div>
                     
                        <div class="pagination-container">
                             <div class="swiper-pagination"></div>
                        </div>

                </div>
<?php
            endif;
        }
    }

    $widgets_manager->register(new Animated_Carousel_Widget());
}

add_action('elementor/widgets/register', 'register_animated_carousel_widget');
