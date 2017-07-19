var $ = window.jQuery;

// Include polyfills
require( './shared/utility/polyfills/classlist' );
require( './shared/utility/polyfills/raf' );
require( './shared/utility/polyfills/transitions' );

// Create the Tailor object
var abstractComponent = require( './shared/components/ui/abstract' );
window.Tailor = {
	
	Components:     {

		/**
		 * Creates a new component.
		 *
		 * @since 1.7.5
		 *
		 * @param prototype
		 * @returns {component}
		 */
		create: function( prototype )  {
			var originalPrototype = prototype;
			var component = function( el, options, callbacks ) {
				abstractComponent.call( this, el, options, callbacks );
			};
			component.prototype = Object.create( abstractComponent.prototype );
			for ( var key in originalPrototype )  {
				component.prototype[ key ] = originalPrototype[ key ];
			}

			Object.defineProperty( component.prototype, 'constructor', {
				enumerable: false,
				value: component
			} );

			return component;
		}
	},

	/**
	 * Initializes all frontend elements.
	 * 
	 * Available for reuse when content is added to the page using AJAX.
	 * 
	 * @since 1.5.6
	 */
	initElements : function() {
		
		// Parallax sections
		$( '.tailor-section[data-ratio]' ).tailorParallax();

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
				autoplaySpeed : $data.autoplaySpeed || 3000,
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
		$( '.is-lightbox-gallery' ).each( function() {
			var $el = $( this );
			if ( $el.hasClass( 'tailor-carousel' ) ) {
				$el.tailorLightbox( {
					delegate : '.slick-slide:not( .slick-cloned ) .is-lightbox-image'
				} );
			}
			else {
				$el.tailorLightbox();
			}
		} );

		$( '.is-lightbox-image' ).tailorLightbox( { delegate : false } );
	}
};

// Shared components
window.Tailor.Components.Abstract = abstractComponent;
window.Tailor.Components.Lightbox = require( './shared/components/ui/lightbox' );
window.Tailor.Components.Map = require( './shared/components/ui/map' );
window.Tailor.Components.Masonry = require( './shared/components/ui/masonry' );
window.Tailor.Components.Parallax = require( './shared/components/ui/parallax' );
window.Tailor.Components.Slideshow = require( './shared/components/ui/slideshow' );
window.Tailor.Components.Tabs = require( './shared/components/ui/tabs' );
window.Tailor.Components.Toggles = require( './shared/components/ui/toggles' );

// Frontend components
require( './frontend/components/ui/carousel' );

// Initialize elements when the document is ready
$( function() {
	window.Tailor.initElements();
} );