<?php
if (!defined('ABSPATH')) {
    exit;
}


function register_example_scripts()
{
    wp_register_script('example-script', plugins_url('../dist/js/example-script.js', dirname(__FILE__)), ['jquery'], '1.0.0', true);
    wp_register_style('example-styles', plugins_url('../dist/css/example-style.css', dirname(__FILE__)), [], '1.0.0', 'all');
}

add_action('wp_enqueue_scripts', 'register_example_scripts');
add_action('elementor/editor/after_enqueue_scripts', 'register_example_scripts');

add_action('elementor/init', function () {
    class Example_Widget extends \Elementor\Widget_Base
    {
        public function get_name()
        {
            return 'example';
        }

        public function get_title()
        {
            return __('Example', 'ptah-chamber');
        }

        public function get_icon()
        {
            return 'eicon-products';
        }

        public function get_categories()
        {
            return ['ptah-chamber'];
        }

        public function get_script_depends()
        {
            return ['swiper-script', 'example-script'];
        }

        public function get_style_depends()
        {
            return ['swiper-styles', 'example-styles'];
        }

        protected function _register_controls()
        {
            // Sección de configuración de productos
            $this->start_controls_section(
                'content_section',
                ['label' => __('Opciones', 'ptah-chamber')]
            );


            $this->add_control(
                'example_text',
                [
                    'label' => __('Texto de ejemplo', 'ptah-chamber'),
                    'type' => \Elementor\Controls_Manager::TEXT,
                    'default' => __('Texto de ejemplo', 'ptah-chamber'),
                    'placeholder' => __('Escribe tu texto aquí', 'ptah-chamber'),
                ]
            );


            $this->end_controls_section();
        }


        protected function render()
        {
            $settings = $this->get_settings_for_display();
            $example_text = $settings['example_text'];
          
?>
                <p class="example" >
                    <?php echo esc_html($example_text); ?> 
                </p>
<?php
        }
    }

    add_action('elementor/widgets/widgets_registered', function () {
        \Elementor\Plugin::instance()->widgets_manager->register(new WC_Carousel_Widget());
    });
});
