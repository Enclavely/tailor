<?php

/**
 * Date meta template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die();

echo '<span class="entry__date">' . get_the_date() . '</span>';