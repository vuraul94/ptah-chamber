<?php 

if (!defined('ABSPATH')) {
    exit;
}

function ptah_chamber_remove_thumbnail_dimensions( $html, $post_id, $post_thumbnail_id, $size, $attr ) {
    $html = preg_replace('/(width|height)="\d*"\s/', "", $html);
    return $html;
}
add_filter('post_thumbnail_html', 'ptah_chamber_remove_thumbnail_dimensions', 10, 5);
