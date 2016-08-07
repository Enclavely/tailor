Tailor.Objects = Tailor.Objects || {};

( function( Tailor, Api, $ ) {

    'use strict';

	var $win = $( window );

	// Create a new stylesheet for managing custom and dynamic CSS
	var stylesheet = document.createElement( 'style' );
	stylesheet.appendChild( document.createTextNode( '' ) );
	stylesheet.setAttribute( 'media', 'screen' );
	stylesheet.setAttribute( 'id', 'tailor-canvas-css' );
	document.head.appendChild( stylesheet );

	// CSS rule sets associated with sidebar settings
	var cssRules = window._pageRules || [];

	// Setting IDs for which CSS should be generated
	var dynamicSettingIds = [
		'_tailor_section_width',
		'_tailor_column_spacing',
		'_tailor_element_spacing'
	];

	// Collection of CSS by setting ID
	var cssCollection = {
		'_tailor_section_width' : '',
		'_tailor_column_spacing' : '',
		'_tailor_element_spacing' : '',
		'_tailor_page_css' : '' // Custom page CSS
	};

	// Generate CSS on app start
	app.on( 'start', function() {

		// Get the saved settings
		var settings = app.channel.request( 'sidebar:settings' );
		if ( settings && settings.length ) {
			settings.each( function( setting ) {
				var id = setting.get( 'id' );
				var value = setting.get( 'value' );
				value = _.isString( value ) ? value.trim() : value;

				if ( ! _.isEmpty( value ) && cssCollection.hasOwnProperty( id ) ) {
					if ( cssRules.hasOwnProperty( id ) ) {
						generateCSS( id, setting.get( 'value' ) );
					}
					else {
						cssCollection[ id ] = setting.get( 'value' )
					}
				}
			} );
		}

		updateStylesheet();
	} );

	// Re-generate CSS when a setting value changes
	_.each( dynamicSettingIds, function( settingId ) {
		if ( cssRules.hasOwnProperty( settingId ) ) {
			Api.Setting( settingId, function( to, from ) {
				generateCSS( settingId, to );
				updateStylesheet();
			} );
		}
	} );

	// Update custom page CSS
	Api.Setting( '_tailor_page_css', function( to, from ) {
		cssCollection[ '_tailor_page_css' ] = to;
		updateStylesheet();
	} );

	// Update the post title
	Api.Setting( '_post_title', function( to, from ) {
		$( 'h1, h2, h1 a, h2 a'  ).each( function() {
			if ( from == this.textContent ) {
				this.textContent = to;
			}
		} );
	} );

	/**
	 * Generates CSS for a given setting.
	 * 
	 * @since 1.4.0
	 * 
	 * @param settingId
	 * @param value
	 */
	function generateCSS( settingId, value ) {
		cssCollection[ settingId ] = '';
		value = _.isString( value ) ? value.trim() : value;
		
		// Compile the CSS rules for non-empty setting values
		if ( ! _.isEmpty( value ) ) {
			_.each( cssRules[ settingId ], function( rule ) {
				var selectors = Tailor.CSS.parseSelectors( rule.selectors );
				var declarations = Tailor.CSS.parseDeclarations( rule.declarations ).replace( /\{\{(.*?)\}\}/g, value );
				cssCollection[ settingId ] += "\n" + selectors + " {" + declarations + "}";
			} );
		}
	}
	
	/**
	 * Updates the stylesheet.
	 *
	 * @since 1.4.0
	 */
	function updateStylesheet() {
		var value = '';
		for ( var settingId in cssCollection ) {
			if ( cssCollection.hasOwnProperty( settingId ) ) {
				value += cssCollection[ settingId ];
			}
		}
		stylesheet.innerHTML = value;
		$win.trigger( 'resize' );
	}

	_.extend( Tailor.Objects, {
		Carousel : require( './components/carousel' ),
		PostsCarousel : require( './components/carousel-simple' ),
		Tabs : require( './components/tabs' ),
		Toggles : require( './components/toggles' ),
		Map : require( './components/map' ),
		Masonry : require( './components/masonry' ),
		Slideshow : require( './components/slideshow' ),
		Lightbox : require( './components/lightbox' ),
		Parallax : require( './components/parallax' )
	} );

	Api.Element.onRender( 'tailor_carousel', function( atts, model ) {
		var carousel = this;
		var options = {
			autoplay : '1' == atts.autoplay,
			arrows : '1' == atts.arrows,
			dots : false,
			fade : '1' == atts.fade && '1' == atts.items_per_row,
			slidesToShow : parseInt( atts.items_per_row, 10 ) || 1,
			adaptiveHeight : true
		};

		carousel.$el.tailorCarousel( options );

		Api.Setting( '_tailor_element_spacing', function( to, from ) {
			carousel.triggerAll( 'element:parent:change', carousel );
		} );
	} );

	Api.Element.onRender( 'tailor_column', function( atts, model ) {
		var column = this;

		// Refreshes all child elements when the column spacing setting changes
		Api.Setting( '_tailor_column_spacing', function( to, from ) {
			column.triggerAll( 'element:parent:change', column );
		} );
	} );

	Api.Element.onRender( 'tailor_content', function( atts, model ) {
		this.$el.tailorLightbox( {
			disableOn : function() {
				return $el.hasClass( 'is-selected' );
			}
		} );
	} );

	Api.Element.onRender( 'tailor_gallery', function( atts, model ) {
		var $el = this.$el;
		var options;

		if ( 'carousel' == atts.layout ) {
			options = {
				autoplay : '1' == atts.autoplay,
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

	Api.Element.onRender( 'tailor_map', function( atts, model ) {
		this.$el.tailorGoogleMap();
	} );

	Api.Element.onRender( 'tailor_posts', function( atts, model ) {
        var $el = this.$el;
        var options;

	    if ( 'carousel' == atts.layout ) {
		    options = {
			    autoplay : '1' == atts.autoplay,
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

	Api.Element.onRender( 'tailor_section', function( atts, model ) {
		var section = this;

		// Refreshes all child elements when the section width setting changes
		Api.Setting( '_tailor_section_width', function( to, from ) {
			section.triggerAll( 'element:parent:change', section );
		} );

		var ratio = this.el.getAttribute( 'data-ratio' );
		if ( atts.parallax && ratio ) {
			this.$el.tailorParallax( { ratio: ratio } );
		}
	} );

    Api.Element.onRender( 'tailor_tabs', function( atts, model ) {
        this.$el.tailorTabs();
    } );

    Api.Element.onRender( 'tailor_toggles', function( atts, model ) {
        this.$el.tailorToggles();
    } );

} ) ( window.Tailor, window.Tailor.Api, jQuery );