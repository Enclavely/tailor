var $ = Backbone.$,
	$win = $( window );

/**
 * Element behaviors.
 */
( function( app, SettingAPI, ElementAPI ) {

	ElementAPI.onRender( 'tailor_carousel', function( atts, model ) {
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

		SettingAPI.onChange( 'sidebar:_tailor_element_spacing', function( to, from ) {
			carousel.triggerAll( 'element:parent:change', carousel );
		} );
	} );

	ElementAPI.onRender( 'tailor_column', function( atts, model ) {
		var column = this;

		// Refreshes all child elements when the column spacing setting changes
		SettingAPI.onChange( 'sidebar:_tailor_column_spacing', function( to, from ) {
			column.triggerAll( 'element:parent:change', column );
		} );
	} );

	ElementAPI.onRender( 'tailor_content', function( atts, model ) {
		this.$el.tailorLightbox( {
			disableOn : function() {
				return $el.hasClass( 'is-selected' );
			}
		} );
	} );

	ElementAPI.onRender( 'tailor_gallery', function( atts, model ) {
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

	ElementAPI.onRender( 'tailor_map', function( atts, model ) {
		this.$el.tailorGoogleMap();
	} );

	ElementAPI.onRender( 'tailor_posts', function( atts, model ) {
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

	ElementAPI.onRender( 'tailor_section', function( atts, model ) {
		var section = this;

		// Refreshes all child elements when the section width setting changes
		SettingAPI.onChange( 'sidebar:_tailor_section_width', function( to, from ) {
			section.triggerAll( 'element:parent:change', section );
		} );

		var ratio = this.el.getAttribute( 'data-ratio' );
		if ( atts.parallax && ratio ) {
			this.$el.tailorParallax( { ratio: ratio } );
		}
	} );

	ElementAPI.onRender( 'tailor_tabs', function( atts, model ) {
		this.$el.tailorTabs();
	} );

	ElementAPI.onRender( 'tailor_toggles', function( atts, model ) {
		this.$el.tailorToggles();
	} );

} ( window.app, window.Tailor.Api.Setting, window.Tailor.Api.Element ) );

/**
 * Live setting and dynamic CSS updates.
 */
( function( app, SettingAPI ) {

	// CSS rule sets associated with sidebar settings
	var cssRules = window._pageRules || [];

	// Collection of CSS by setting ID
	var cssCollection = {
		'_tailor_section_width' : '',
		'_tailor_column_spacing' : '',
		'_tailor_element_spacing' : '',
		'_tailor_page_css' : '' // Custom page CSS
	};

	// Stylesheet for page setting CSS
	var stylesheet = document.createElement( 'style' );
	stylesheet.appendChild( document.createTextNode( '' ) );
	stylesheet.setAttribute( 'media', 'screen' );
	stylesheet.setAttribute( 'id', 'tailor-settings' );
	document.head.appendChild( stylesheet );

	/**
	 * Returns true if all values in an array are equal.
	 *
	 * @since 1.5.0
	 *
	 * @param array
	 * @returns {boolean}
	 */
	function isIdentical( array ) {
		for ( var i = 0; i < array.length - 1; i++ ) {
			if( array[ i ] !== array[ i + 1 ] ) {
				return false;
			}
		}
		return true;
	}

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

	app.channel.on( 'module:css:stylesheets:ready', function( cssModule ) {

		// Generate page setting CSS on page load
		var settings = app.channel.request( 'sidebar:settings' );
		if ( settings && settings.length ) {
			settings.each( function( setting ) {
				var id = setting.get( 'id' );
				var value = setting.get( 'value' );
				value = _.isString( value ) ? value.trim() : value;

				if ( ! _.isEmpty( value ) && cssCollection.hasOwnProperty( id ) ) {
					if ( cssRules.hasOwnProperty( id ) ) {
						generateCSS( id, value );
					}
					else {
						cssCollection[ id ] = value
					}
				}
			} );
		}

		updateStylesheet();

		/**
		 * Sidebar settings.
		 */
		var ids = [
			'_tailor_section_width',
			'_tailor_column_spacing',
			'_tailor_element_spacing'
		];
		_.each( ids, function( settingId ) {
			if ( cssRules.hasOwnProperty( settingId ) ) {
				SettingAPI.onChange( 'sidebar:' + settingId, function( to, from ) {
					generateCSS( settingId, to );
					updateStylesheet();
				} );
			}
		} );

		// Custom page CSS
		SettingAPI.onChange( 'sidebar:_tailor_page_css', function( to, from ) {
			cssCollection[ '_tailor_page_css' ] = to;
			updateStylesheet();
		} );

		// Post title
		SettingAPI.onChange( 'sidebar:_post_title', function( to, from ) {
			$( 'h1, h2, h1 a, h2 a'  ).each( function() {
				if ( from == this.textContent ) {
					this.textContent = to;
				}
			} );
		} );

		/**
		 * Element settings.
		 */
		ids = [

			// Dimensions
			'min_height',

			// Colors
			'color',
			'background_color',
			'border_color',

			// Borders
			'border_style',
			'border_radius',

			// Background images
			'background_repeat',
			'background_position',
			'background_size',
			'background_attachment'
		];
		_.each( ids, function( settingId ) {
			SettingAPI.onChange( 'element:' + settingId, function( to, from, model ) {
				var rule = {
					selectors: 'tailor_button' == model.get( 'tag' ) ? [ 'a.tailor-button__inner' ] : [],
					declarations: {}
				};
				rule.declarations[ settingId.replace( '_', '-' ) ] = to;

				// Return the rule(s)
				return [ rule ];
			} );
		} );

		// Link color
		SettingAPI.onChange( 'element:link_color', function( to, from, model ) {
			return [ {
				selectors: [ 'a' ],
				declarations: { color : to }
			} ];
		} );

		// Heading color
		SettingAPI.onChange( 'element:heading_color', function( to, from, model ) {
			return [ {
				selectors: [ 'h1, h2, h3, h4, h5' ],
				declarations: { color : to }
			} ];
		} );

		// Graphic color
		SettingAPI.onChange( 'element:graphic_color', function( to, from, model ) {
			var tag = model.get( 'tag' );
			if ( 'tailor_list_item' == tag ) {
				return [ {
					selectors: [ '.tailor-list__graphic' ],
					declarations: { color : to }
				} ];
			}
			return [ {
				selectors: [ '.' + tag.replace( /_/gi, '-' ) + '__graphic' ],
				declarations: { color : to }
			} ];
		} );

		// Graphic hover color
		SettingAPI.onChange( 'element:graphic_color_hover', function( to, from, model ) {
			var tag = model.get( 'tag' );
			if ( 'tailor_list_item' == tag ) {
				return [ {
					selectors: [ '.tailor-list__graphic:hover' ],
					declarations: { color : to }
				} ];
			}
			return [ {
				selectors: [ '.' + tag.replace( /_/gi, '-' ) + '__graphic:hover' ],
				declarations: { color : to }
			} ];
		} );

		// Minimum item height
		SettingAPI.onChange( 'element:min_item_height', function( to, from, model ) {
			return [ {
				selectors: [ model.get( 'tag' ).replace( /_/gi, '-' ) + '__item' ],
				declarations: { minHeight : to }
			} ];
		} );

		// Maximum width
		SettingAPI.onChange( 'element:max_width', function( to, from, model ) {
			var $el = this.$childViewContainer ? this.$childViewContainer : this.$el;
			$el.css( { maxWidth: to } );
		} );

		// Minimum column height
		SettingAPI.onChange( 'element:min_column_height', function( to, from, model ) {
			return [ {
				selectors: [ '.tailor-column' ],
				declarations: { 'min-height' : to }
			} ];
		} );

		// Column spacing
		SettingAPI.onChange( 'element:column_spacing', function( to, from, model ) {
			return [
				{
					selectors: [],
					declarations: {
						'margin-left' : '-calc(' + to + '/2)',
						'margin-right' : '-calc(' + to + '/2)'
					}
				},
				{
					selectors: [ '.tailor-column' ],
					declarations: {
						'padding-left' : 'calc(' + to + '/2)',
						'padding-right' : 'calc(' + to + '/2)'
					}
				}
			];
		} );

		// Horizontal alignment
		SettingAPI.onChange( 'element:horizontal_alignment', function( to, from, model ) {
			this.el.className = this.el.className.replace( /\bu-text-.*?\b/g, '' );
			this.el.classList.add( 'u-text-' + to );
		} );

		// Vertical alignment
		SettingAPI.onChange( 'element:vertical_alignment', function( to, from, model ) {
			this.el.className = this.el.className.replace( /\bu-align-.*?\b/g, '' );
			this.el.classList.add( 'u-align-' + to );
		} );

		// Class name
		SettingAPI.onChange( 'element:class', function( to, from, model ) {
			if ( ! _.isEmpty( from ) ) {
				this.el.classList.remove( from );
			}
			if ( ! _.isEmpty( to ) ) {
				this.el.classList.add( to );
			}
		} );

		// Box shadow
		SettingAPI.onChange( 'element:shadow', function( to, from, model ) {
			var rules = [];
			if ( 1 == to ) {
				rules.push( {
					selectors: [],
					declarations: { 'box-shadow' : '0 2px 6px rgba(0, 0, 0, 0.1)' }
				} );
			}
			return rules;
		} );

		// Hover colors
		ids = [
			'color_hover',
			'background_color_hover',
			'border_color_hover'
		];
		_.each( ids, function( settingId ) {
			SettingAPI.onChange( 'element:' + settingId, function( to, from, model ) {
				var rule = {
					selectors: 'tailor_button' == model.get( 'tag' ) ? [ 'a.tailor-button__inner:hover' ] : [ ':hover' ],
					declarations: {}
				};
				rule.declarations[ settingId.substring( 0, settingId.lastIndexOf( '_hover' ) ).replace( '_', '-' ) ] = to;
				return [ rule ];
			} );
		} );
		
		// Link hover color
		SettingAPI.onChange( 'element:link_color_hover', function( to, from, model ) {
			return [ {
				selectors: [ 'a:hover' ],
				declarations: { color : to }
			} ];
		} );
		
		// Multi-dimensional attributes
		ids = [
			'padding',
			'margin'
		];
		_.each( ids, function( settingId ) {
			SettingAPI.onChange( 'element:' + settingId, function( to, from, model ) {
				var rules = [];
				var rule = {
					selectors: [],
					declarations: {}
				};

				// Process setting value
				to = to.split( '-' );
				if ( isIdentical( to ) ) {
					rule.declarations[ settingId ] = to[0];
				}
				else {
					if ( 2 == to.length ) {
						to = _.object( [ 'top', 'bottom' ], to );
					}
					else if ( 4 == to.length ) {
						to = _.object( [ 'top', 'right', 'bottom', 'left' ], to );
					}
					else {
						return;
					}
					for ( var key in to ) {
						if ( to.hasOwnProperty( key ) ) {
							rule.declarations[ settingId + '-' + key ] = to[ key ];
						}
					}
				}

				if ( _.keys( rule.declarations ).length > 0 ) {
					rules.push( rule );
				}

				return rules;
			} );
		} );

		// Border width
		SettingAPI.onChange( 'element:border_width', function( to, from, model ) {
			var rules = [];
			var rule = {
				selectors: [],
				declarations: {}
			};

			// Process setting value
			to = to.split( '-' );
			if ( isIdentical( to ) ) {
				rule.declarations[ 'border-width' ] = to[0];
			}
			else {
				if ( 2 == to.length ) {
					to = _.object( [ 'top', 'bottom' ], to );
				}
				else if ( 4 == to.length ) {
					to = _.object( [ 'top', 'right', 'bottom', 'left' ], to );
				}
				else {
					return;
				}
				for ( var key in to ) {
					if ( to.hasOwnProperty( key ) ) {
						rule.declarations[ 'border-' + key + '-width' ] = to[ key ];
					}
				}
			}

			if ( _.keys( rule.declarations ).length > 0 ) {
				rules.push( rule );
			}

			return rules;
		} );

	} );
} ( window.app, window.Tailor.Api.Setting ) );