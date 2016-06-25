<?php

/**
 * Sidebar template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 */

defined( 'ABSPATH' ) or die(); ?>

<div class="tailor">
    <div class="tailor-sidebar">
        <div class="tailor-sidebar__header">

	        <?php
	        $post = get_post();
	        $tailor_layout = get_post_meta( $post->ID, '_tailor_layout', true );
	        $saved_content = get_post_meta( $post->ID, '_tailor_saved_content', true );

	        if ( false == $tailor_layout || wpautop( $post->post_content ) != wpautop( $saved_content ) ) {
		        echo '<button class="button button-primary save" id="tailor-save">' . __( 'Save & Publish', 'tailor' ) . '</button>';
	        }
	        else {
		        echo '<button class="button button-primary save" id="tailor-save" disabled >' . __( 'Saved', 'tailor' ) . '</button>';
	        } ?>

	        <span class="spinner"></span>

	        <a class="tailor-sidebar__control" href="<?php echo esc_url_raw( get_edit_post_link() ); ?>" tabindex="0">
		        <?php echo tailor_screen_reader_text( __( 'Close', 'tailor' ) ); ?>
	        </a>
        </div>

        <div class="tailor-sidebar__content" id="tailor-sidebar-content"></div>

	    <div class="tailor-sidebar__footer">

		    <?php
		    $device_sizes = tailor_get_previewable_devices();

		    if ( ! empty( $device_sizes ) ) {

			    echo '<div class="devices">';

			    $format = '<button type="button" class="preview-%1$s" aria-pressed="false" data-device="%1$s">' .
			                '<span class="screen-reader-text">%1$s</span>' .
			              '</button>';

			    foreach ( $device_sizes as $device_name => $device ) {
					printf( $format, $device_name, $device['label'] );
			    }

			    echo '</div>';
		    }
		    ?>
		    
		    <button type="button" class="collapse-sidebar" id="tailor-collapse" aria-expanded="true" aria-label="<?php _e( 'Collapse Sidebar', 'tailor' ); ?>">
			    <span class="collapse-sidebar-arrow"></span>
			    <span class="collapse-sidebar-label"><?php _e( 'Collapse', 'tailor' ); ?></span>
		    </button>

	    </div>
    </div>

    <div class="tailor-preview">
        <div class="tailor-preview__viewport">

            <?php
            $query_args = array( 'canvas' => 1 );
            $permalink = get_permalink( $post->ID );
            $preview_url = add_query_arg( $query_args, $permalink );

            /**
             * Filters the preview url.
             *
             * @since 1.0.0
             *
             * @param string $preview_url
             * @param string $permalink
             * @param array $query_args
             */
            $preview_url = apply_filters( 'tailor_preview_url', $preview_url, $permalink, $query_args ); ?>

            <iframe src="<?php echo $preview_url; ?>" frameborder="0" id="tailor-sidebar-preview"></iframe>

        </div>
    </div>
</div>