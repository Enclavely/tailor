<?php

/**
 * Category meta template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

echo '<span class="entry__category">' . get_the_category_list( ', ' ) . '</span>';