var $ = window.jQuery;

window.Tailor = window.Tailor || {};

// Include polyfills
require( '../shared/utility/polyfills/classlist' );
require( '../shared/utility/polyfills/raf' );
require( '../shared/utility/polyfills/transitions' );

// Include shared components
require( '../shared/components/ui/tabs' );
require( '../shared/components/ui/toggles' );
require( '../shared/components/ui/map' );
require( '../shared/components/ui/lightbox' );
require( '../shared/components/ui/slideshow' );
require( '../shared/components/ui/parallax' );

// Include frontend-only components
require( './components/ui/carousel' );

window.Tailor.initElements = function() {

	// Parallax sections
	$( '.tailor-section[data-ratio]' ).each( function() {
		var $el = $( this );
		$el.tailorParallax( { ratio: $el.data( 'ratio' ) } );
	} );

	// Tabs
	$( '.tailor-tabs' ).tailorTabs();

	// Toggles
	$( '.tailor-toggles' ).tailorToggles();

	// Google Maps
	$( '.tailor-map' ).tailorGoogleMap();

	// Carousels
	$( '.tailor-carousel' ).each( function() {
		var $el = $( this );
		var $data = $el.data();

		$el.tailorCarousel( {
			slidesToShow : $data.slides || 1,
			fade : ( $data.fade && 1 == $data.slides ),
			infinite : this.classList.contains( 'tailor-posts' ) || this.classList.contains( 'tailor-gallery' )
		} );
	} );

	// Masonry layouts
	$( '.tailor-grid--masonry' ).each( function() {
		var $el = $( this );

		$el.imagesLoaded( function() {
			$el.shuffle( {
				itemSelector: '.tailor-grid__item'
			} );
		} );
	} );

	// Slideshows
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

	// Lightboxes
	$( '.is-lightbox-gallery' ).tailorLightbox();
};

// Initialize elements when the document is ready
$( document ).ready( function() {
	window.Tailor.initElements();
} );