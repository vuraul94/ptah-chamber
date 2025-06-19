<?php
if (!defined('ABSPATH')) {
    exit;
}


function register_age_approve_scripts()
{
    wp_register_script('age-approve-script', plugins_url('../dist/js/age-approve-script.js', dirname(__FILE__)), ['jquery'], '1.0.0', true);
    wp_register_style('age-approve-style', plugins_url('../dist/css/age-approve-style.css', dirname(__FILE__)), [], '1.0.0', 'all');
}

add_action('wp_enqueue_scripts', 'register_age_approve_scripts');
add_action('elementor/editor/after_enqueue_scripts', 'register_age_approve_scripts');

add_action('elementor/init', function () {
    class Age_Approve_Widget extends \Elementor\Widget_Base
    {
        public function get_name()
        {
            return 'age-approve';
        }

        public function get_title()
        {
            return __('Age approve', 'ptah-chamber');
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
            return ['age-approve-script'];
        }

        public function get_style_depends()
        {
            return ['age-approve-style'];
        }

        protected function _register_controls()
        {
            // Sección de configuración de productos
            $this->start_controls_section(
                'content_section_preapproved',
                ['label' => __('Contenido preaprovado', 'ptah-chamber')]
            );

            $this->add_control(
                'header_content_preapproved',
                [
                    'label' => __('Header', 'ptah-chamber'),
                    'type' => \Elementor\Controls_Manager::WYSIWYG,
                ]
            );

            $this->add_control(
                'title_preapproved',
                [
                    'label' => __('Titulo', 'ptah-chamber'),
                    'type' => \Elementor\Controls_Manager::WYSIWYG,
                ]
            );

            $this->add_control(
                'foot_preapproved',
                [
                    'label' => __('Footer', 'ptah-chamber'),
                    'type' => \Elementor\Controls_Manager::WYSIWYG,
                ]
            );


            $this->end_controls_section();

            $this->start_controls_section(
                'content_section_approved',
                ['label' => __('Contenido aprovado', 'ptah-chamber')]
            );

            $this->add_control(
                'header_content_approved',
                [
                    'label' => __('Header', 'ptah-chamber'),
                    'type' => \Elementor\Controls_Manager::WYSIWYG,
                ]
            );

            $this->add_control(
                'title_approved',
                [
                    'label' => __('Titulo', 'ptah-chamber'),
                    'type' => \Elementor\Controls_Manager::WYSIWYG,
                ]
            );

            $this->add_control(
                'foot_approved',
                [
                    'label' => __('Footer', 'ptah-chamber'),
                    'type' => \Elementor\Controls_Manager::WYSIWYG,
                ]
            );


            $this->end_controls_section();

                $this->start_controls_section(
                'content_section_rejected',
                ['label' => __('Contenido rechazado', 'ptah-chamber')]
            );

             $this->add_control(
                'title_rejected',
                [
                    'label' => __('Titulo', 'ptah-chamber'),
                    'type' => \Elementor\Controls_Manager::WYSIWYG,
                ]
            );
            

            $this->end_controls_section();
        }


        protected function render()
        {
            $settings = $this->get_settings_for_display();
            // $example_text = $settings['example_text'];

?>
            <div class="age-approve">
                <div class="age-approve__header">
                    <?php if (!empty($settings['header_content_preapproved'])): ?>
                        <div class="age-approve__text age-approve__text--pre"><?php echo $settings['header_content_preapproved']; ?></div>
                        <div class="age-approve__text age-approve__text--ap"><?php echo $settings['header_content_approved']; ?></div>
                    <?php endif; ?>
                </div>
                <div class="age-approve__body">
                    <?php if (!empty($settings['header_content_preapproved'])): ?>
                        <h2 class="age-approve__title age-approve__title--pre"><?php echo $settings['title_preapproved']; ?></h2>
                        <h2 class="age-approve__title age-approve__title--ap"><?php echo $settings['title_approved']; ?></h2>
                        <h2 class="age-approve__title age-approve__title--rej"><?php echo $settings['title_rejected']; ?></h2>
                    <?php endif; ?>
                    <div class="age-approve__buttons">
                        <span class="age-approve__button age-approve__button--yes">
                            <?php echo file_get_contents(plugin_dir_path(__FILE__) . '../../assets/images/Cap Yes.svg'); ?>
                            <?php echo file_get_contents(plugin_dir_path(__FILE__) . '../../assets/images/Botella Yes.svg'); ?>
                            <p class="age-approve__btn-text">SÍ</p>
                        </span>
                        <span class="age-approve__button age-approve__button--no">
                            <?php echo file_get_contents(plugin_dir_path(__FILE__) . '../../assets/images/Cap No.svg'); ?>
                            <?php echo file_get_contents(plugin_dir_path(__FILE__) . '../../assets/images/Botella No.svg'); ?>
                            <p class="age-approve__btn-text">NO</p>
                        </span>
                    </div>
                </div>
                <div class="age-approve__footer">
                    <div class="age-approve__text age-approve__text--pre"><?php echo $settings['foot_preapproved']; ?></div>
                    <div class="age-approve__text age-approve__text--ap"><?php echo $settings['foot_approved']; ?></div>
                </div>
            </div>
<?php
        }
    }

    add_action('elementor/widgets/widgets_registered', function () {
        \Elementor\Plugin::instance()->widgets_manager->register(new Age_Approve_Widget());
    });
});
