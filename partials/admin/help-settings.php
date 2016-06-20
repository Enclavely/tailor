<?php

/**
 * Settings page help template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<p><?php _e( 'This page allows you to configure global settings for the Tailor plugin.', 'tailor' ) ?></p>
<p>
	<?php
	echo preg_replace(
		array(
			'/1\{ *(.*?) *\}/',
			'/2\{ *(.*?) *\}/',
		),
		array(
			'<a href="http://documentation.gettailor.com/" target="_blank">$1</a>',
			'<a href="http://forum.gettailor.com/" target="_blank">$1</a>',
		),
		__( '1{Documentation} can be found on the Tailor website and you can ask questions on the 2{community forum} if you get stuck.', 'tailor' )
	);
	?>
</p>