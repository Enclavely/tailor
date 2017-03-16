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
	        if ( false == get_post_meta( $post->ID, '_tailor_layout', true ) ) {
		        echo '<button class="button button-primary save" id="tailor-save">';
		        if ( 'publish' == get_post_status( $post->ID ) ) {
			        _e( 'Save & Publish', 'tailor' );
		        }
		        else {
			        _e( 'Save', 'tailor' );
		        }
		        echo '</button>';
	        }
	        else {
		        echo '<button class="button button-primary save" id="tailor-save" disabled >' . __( 'Saved', 'tailor' ) . '</button>';
	        } ?>

	        <span class="spinner"></span>
	        
	        <?php
	        
	        // Get the return link
	        $referer = wp_get_referer();
	        $excluded_referer_basenames = array( 'customize.php', 'wp-login.php' );
	        if ( $referer && ! in_array( basename( parse_url( $referer, PHP_URL_PATH ) ), $excluded_referer_basenames, true ) ) {
		        $return_url = $referer;
	        }
	        else {
		        $return_url = get_edit_post_link();
	        } ?>

	        <a class="tailor-sidebar__control" href="<?php echo esc_url_raw( $return_url ); ?>" tabindex="0">
		        <?php echo tailor_screen_reader_text( __( 'Close', 'tailor' ) ); ?>
	        </a>
        </div>

        <div class="tailor-sidebar__content" id="tailor-sidebar-content"></div>

	    <div class="tailor-sidebar__footer">

		    <?php
		    echo '<div class="devices">';
		    foreach ( tailor_get_media_queries() as $query_id => $query_label ) {
			    printf(
				    '<button type="button" class="preview-%1$s" aria-pressed="false" data-device="%1$s">%2$s</button>',
				    $query_id,
				    tailor_screen_reader_text( sprintf( __( 'Enter %s preview mode', 'tailor' ), $query_label ) )
			    );
		    }
		    echo '</div>';
		    
		    $collapse_label = __( 'Hide Controls', 'tailor' ); ?>
		    
		    <button type="button" class="collapse-sidebar" id="tailor-collapse" aria-expanded="true" aria-label="<?php esc_attr( $collapse_label ); ?>">
			    <span class="collapse-sidebar-arrow"></span>
			    <span class="collapse-sidebar-label"><?php esc_attr_e( $collapse_label ); ?></span>
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