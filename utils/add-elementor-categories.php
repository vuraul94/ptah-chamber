<?php

function ptah_chamber_add_elementor_widget_categories($elements_manager)
{
    $elements_manager->add_category(
        'ptah-chamber',
        [
            'title' => esc_html__('Ptah Chamber', 'ptah-chamber'),
            'icon' => 'fa fa-plug',
        ]
    );

}
add_action('elementor/elements/categories_registered', 'ptah_chamber_add_elementor_widget_categories');