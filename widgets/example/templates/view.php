<?php
/**
 * Plantilla de vista para el widget Example.
 *
 * @var array  $settings     Las configuraciones del widget.
 * @var string $example_text El texto a mostrar.
 */

if (!defined('ABSPATH')) {
    exit; // Salir si se accede directamente.
}
?>
<p class="example">
    <?php echo esc_html($example_text); ?>
</p>