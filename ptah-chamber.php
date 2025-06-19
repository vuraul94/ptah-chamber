<?php

/**
 * Plugin Name: Ptah cahmber
 * Description: Un plugin personalizado para agregar widgets a Elementor.
 * Version: 1.0.0
 * Author: Raúl Venegas 
 */


if (!defined('ABSPATH')) {
    exit;
}

add_action('wp_enqueue_scripts', 'ptah_chamber_register_scripts');
add_action('elementor/editor/after_enqueue_scripts', 'ptah_chamber_register_scripts');

// //utils
require_once plugin_dir_path(__FILE__) . '/utils/add-elementor-categories.php';
require_once plugin_dir_path(__FILE__) . '/utils/remove-thumbnail-dimensions.php';

// use Elementor\Widget_Base;
//widgets
require_once plugin_dir_path(__FILE__) . '/widgets/age-approve/age-approve.php';
require_once plugin_dir_path(__FILE__) . '/widgets/promo-grid/promo-grid.php';
require_once plugin_dir_path(__FILE__) . '/widgets/animated-carousel/animated-carousel.php';