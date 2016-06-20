<?php

/**
 * Pagination template.
 *
 * @package Tailor
 * @subpackage Templates
 * @since 1.0.0
 *
 * @var WP_Query $q The WP_Query object.
 */

if ( $q->max_num_pages > 1 ) {

	$pagination_args = array(
		'mid_size'              =>  1,
		'prev_text'             =>  _x( 'Previous', 'previous post', 'tailor' ),
		'next_text'             =>  _x( 'Next', 'next post', 'tailor' ),
		'current'			    =>	$q->get( 'paged' ) ? absint( $q->get( 'paged' ) ) : 1,
		'total'				    =>	$q->max_num_pages
	);

	if ( $links = paginate_links( $pagination_args ) ) { ?>

		<nav class="entry-pagination" role="navigation" itemscope itemtype="http://schema.org/SiteNavigationElement">
			<h3 class="screen-reader-text"><?php _e( 'Posts pagination', 'tailor' ); ?></h3>
			<div class="entry-pagination__links">
				<?php echo $links; ?>
			</div>
		</nav>

		<?php
	}
}