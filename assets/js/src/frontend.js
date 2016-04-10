( function( $ ) {

    'use strict';

    require( './components/tabs' );
    require( './components/toggles' );
    require( './components/map' );
    require( './components/lightbox' );
    require( './components/slideshow' );
    require( './components/frontend/carousel' );

    $( document ).ready( function() {

	    /**
	     * Tabs.
	     */
	    $( '.tailor-tabs' ).tailorTabs();

	    /**
	     * Toggles.
	     */
	    $( '.tailor-toggles' ).tailorToggles();

	    /**
	     * Maps.
	     */
	    $( '.tailor-map' ).tailorGoogleMap();

	    /**
	     * Carousels.
	     */
	    $( '.tailor-carousel' ).each( function() {
		    var $el = $( this );
		    var $data = $el.data();

		    $el.tailorCarousel( {
			    slidesToShow : $data.slides || 1,
			    fade : ( $data.fade && 1 == $data.slides ),
			    infinite : this.classList.contains( 'tailor-posts' ) || this.classList.contains( 'tailor-gallery' )
		    } );
	    } );

	    /**
	     * Masonry layouts.
	     */
	    $( '.tailor-grid--masonry' ).each( function() {
		    var $el = $( this );

		    $el.imagesLoaded( function() {
			    $el.shuffle( {
				    itemSelector: '.tailor-grid__item'
			    } );
		    } );
	    } );

	    /**
	     * Slideshow galleries.
	     */
	    $( '.tailor-slideshow--gallery' ).each( function() {
		    var $el = $( this );
		    var $data = $el.data() || {};
		    var options = {
			    autoplay : $data.autoplay || false,
			    arrows : $data.arrows || false,
			    draggable : true
		    };

		    if ( '1' == $data.thumbnails ) {
			    options.customPaging = function( slider, i ) {
				    var thumb = $( slider.$slides[ i ] ).data( 'thumb' );
				    return '<img class="slick-thumbnail" src="' + thumb + '">';
			    };
			    options.dots = true;
		    }

		    $el.tailorSlideshow( options );
	    } );

	    /**
	     * Lightbox galleries.
	     */
	    $( '.is-lightbox-gallery' ).tailorLightbox();

    } );
} ) ( jQuery );