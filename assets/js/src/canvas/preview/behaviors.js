( function( $, app, SettingAPI, ElementAPI ) {

	ElementAPI.onRender( 'tailor_carousel', function( atts, model ) {
		var carousel = this;
		var options = {
			autoplay : '1' == atts.autoplay,
			autoplaySpeed : atts.autoplay_speed,
			arrows : '1' == atts.arrows,
			dots : false,
			fade : '1' == atts.fade && '1' == atts.items_per_row,
			slidesToShow : parseInt( atts.items_per_row, 10 ) || 1,
			adaptiveHeight : true
		};

		carousel.$el.tailorCarousel( options );
	} );

	ElementAPI.onRender( 'tailor_content', function( atts, model ) {
		if ( this.$el.find( '.is-lightbox-image' ).length > 0 ) {
			this.$el.tailorLightbox( {
				disableOn : function() {
					return $el.hasClass( 'is-selected' );
				}
			} );
		}
	} );

	ElementAPI.onRender( 'tailor_gallery', function( atts, model ) {
		var $el = this.$el;
		var options;

		if ( 'carousel' == atts.layout ) {
			options = {
				autoplay : '1' == atts.autoplay,
				autoplaySpeed : atts.autoplay_speed,
				arrows : '1' == atts.arrows,
				dots : '1' == atts.dots,
				fade : ( '1' == atts.fade && '1' == atts.items_per_row ),
				infinite: false,
				slidesToShow : parseInt( atts.items_per_row, 10 ) || 2
			};

			$el.tailorSimpleCarousel( options ) ;
		}
		else if ( 'slideshow' == atts.layout ) {
			options = {
				autoplay : '1' == atts.autoplay,
				autoplaySpeed : atts.autoplay_speed,
				arrows : '1' == atts.arrows,
				dots : false,
				fade : true,
				items : '.tailor-slideshow__slide',
				adaptiveHeight : true,
				draggable : false,
				speed : 250
			};

			if ( '1' == atts.thumbnails ) {
				options.customPaging = function( slider, i ) {
					var thumb = $( slider.$slides[ i ] ).data( 'thumb' );
					return '<img class="slick-thumbnail" src="' + thumb + '">';
				};
				options.dots = true;
			}

			$el.tailorSlideshow( options );
		}
		else if ( atts.masonry ) {
			$el.tailorMasonry();
		}

		if ( this.el.classList.contains( 'is-lightbox-gallery' ) ) {
			$el.tailorLightbox( {
				disableOn : function() {
					return $el.hasClass( 'is-selected' );
				}
			} );
		}
	} );

	ElementAPI.onRender( 'tailor_map', function( atts, model ) {
		this.$el.tailorGoogleMap();
	} );

	ElementAPI.onRender( 'tailor_posts', function( atts, model ) {
		var $el = this.$el;
		var options;
		if ( 'carousel' == atts.layout ) {
			options = {
				autoplay : '1' == atts.autoplay,
				autoplaySpeed : atts.autoplay_speed,
				arrows : '1' == atts.arrows,
				dots : '1' == atts.dots,
				fade : ( '1' == atts.fade && '1' == atts.items_per_row ),
				infinite: false,
				slidesToShow : parseInt( atts.items_per_row, 10 ) || 2
			};
			this.$el.tailorSimpleCarousel( options ) ;
		}
		else if ( atts.masonry ) {
			$el.tailorMasonry();
		}
	} );

	ElementAPI.onRender( 'tailor_section', function( atts, model ) {
		if ( atts['background_image'] && atts['parallax'] && 1 == atts['parallax'] ) {
			this.$el.tailorParallax();
		}
	} );

	ElementAPI.onRender( 'tailor_tabs', function( atts, model ) {
		this.$el.tailorTabs();
	} );

	ElementAPI.onRender( 'tailor_toggles', function( atts, model ) {
		this.$el.tailorToggles();
	} );

} ( window.jQuery, window.app, window.Tailor.Api.Setting, window.Tailor.Api.Element ) );