<?php
if (!defined('ABSPATH')) {
    exit;
}


function register_promo_grid_scripts()
{
    // wp_register_script('promo-grid-script', plugins_url('../dist/js/promo-grid-script.js', dirname(__FILE__)), ['jquery'], '1.0.0', true);
    wp_register_style('promo-grid-styles', plugins_url('../dist/css/promo-grid-style.css', dirname(__FILE__)), [], '1.0.0', 'all');
}

add_action('wp_enqueue_scripts', 'register_promo_grid_scripts');
add_action('elementor/editor/after_enqueue_scripts', 'register_promo_grid_scripts');

add_action('elementor/init', function () {
    class Promo_Grid_Widget extends \Elementor\Widget_Base
    {
        public function get_name()
        {
            return 'example';
        }

        public function get_title()
        {
            return __('Promo Grid', 'ptah-chamber');
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
            // return ['promo-grid-script'];
            return [];
        }

        public function get_style_depends()
        {
            return ['promo-grid-styles'];
        }

        protected function _register_controls()
        {
            // Sección de configuración de productos
            $this->start_controls_section(
                'content_section',
                ['label' => __('Opciones', 'ptah-chamber')]
            );

            $this->end_controls_section();
        }
        /**
         * Get promos from the 'promo' post type.
         *
         * @return array
         */
        private function get_promos()
        {
            $query = new WP_Query([
                'post_type' => 'promo',
                'posts_per_page' => -1,
            ]);
            $promos = [];
            if ($query->have_posts()) {
                while ($query->have_posts()) {
                    $query->the_post();
                    $promos[] = [
                        'title' => get_the_title(),
                        'link' => get_permalink(),
                        'image' => get_the_post_thumbnail_url(get_the_ID(), 'full'),
                    ];
                }
                wp_reset_postdata();
            }
            return $promos;
        }


        protected function render()
        {
            $settings = $this->get_settings_for_display();

?>
            <div class="promo-grid-widget">
                <div class="promo-grid">
                    <?php
                    $promos = $this->get_promos();
                    if (!empty($promos)) {
                        foreach ($promos as $promo) {
                    ?>
                            <div class="promo-item">
                                <a href="<?php echo esc_url($promo['link']); ?>">
                                    <div class="promo-item__image">
                                        <?php if ($promo['image']) : ?>
                                            <img src="<?php echo esc_url($promo['image']); ?>" alt="<?php echo esc_attr($promo['title']); ?>">
                                        <?php endif; ?>
                                    </div>
                                    <p class="promo-item__title">
                                        Promotion <br />
                                        <span class="promo-item__name"><?php echo esc_html($promo['title']); ?></span>
                                    </p>
                                </a>
                            </div>
        <?php
                        }
                    }
                }
            }
            add_action('elementor/widgets/widgets_registered', function () {
                \Elementor\Plugin::instance()->widgets_manager->register(new Promo_Grid_Widget());
            });
        });
