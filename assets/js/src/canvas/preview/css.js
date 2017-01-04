var $ = Backbone.$,
	$win = $( window );

( function( window,  app, SettingAPI ) {

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
	 * Returns an object containing style positions and values.
	 *
	 * @since 1.7.2
	 *
	 * @param string
	 * @returns {*}
	 */
	function getStyleValues( string ) {
		var values;
		if ( -1 != string.indexOf( ',' ) ) {
			values = string.split( ',' );
		}
		else {
			values = string.split( '-' ); // Old format
		}
		if ( 2 == values.length ) {
			values = _.object( [ 'top', 'bottom' ], values );
		}
		else if ( 4 == values.length ) {
			values = _.object( [ 'top', 'right', 'bottom', 'left' ], values );
		}
		else {
			values = {};
		}
		return values;
	}

	/**
	 * Returns the media query for a given setting ID.
	 *
	 * @since 1.7.2
	 *
	 * @param string
	 * @returns {string}
	 */
	function getMediaQuery( string ) {
		var query = '';
		_.each( [ '_tablet', '_mobile' ], function( target ) {
			if ( string.substring( string.length - target.length ) == target ) {
				query = target.substring(1)
			}
		} );
		return query;
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
		window.Tailor.Settings.overrides = {

			// Global overrides
			'*' : {},

			'tailor_button' : {
				'color_hover' : [ [ '.tailor-button__inner:hover', '.tailor-button__inner:focus' ], 'color', 'tailorValidateColor' ],
				'background_color' : [ [ '.tailor-button__inner' ], 'background-color', 'tailorValidateColor' ],
				'background_color_hover' : [ [ '.tailor-button__inner:hover', '.tailor-button__inner:focus' ], 'background-color', 'tailorValidateColor' ],
				'border_color' : [ [ '.tailor-button__inner' ], 'border-color', 'tailorValidateColor' ],
				'border_color_hover' : [ [ '.tailor-button__inner:hover', '.tailor-button__inner:focus' ], 'border-color', 'tailorValidateColor' ],
				'padding' : [ [ '.tailor-button__inner' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_tablet' : [ [ '.tailor-button__inner' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_mobile' : [ [ '.tailor-button__inner' ], 'padding-{0}', 'tailorValidateUnit' ],
				'margin' : [ [ '.tailor-button__inner' ], 'margin-{0}', 'tailorValidateUnit' ],
				'margin_tablet' : [ [ '.tailor-button__inner' ], 'margin-{0}', 'tailorValidateUnit' ],
				'margin_mobile' : [ [ '.tailor-button__inner' ], 'margin-{0}', 'tailorValidateUnit' ],
				'border_width' : [ [ '.tailor-button__inner' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_width_tablet' : [ [ '.tailor-button__inner' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_width_mobile' : [ [ '.tailor-button__inner' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_radius' : [ [ '.tailor-button__inner' ], 'border-radius', 'tailorValidateUnit' ],
				'shadow' : [ [ '.tailor-button__inner' ], 'box-shadow' ]
			},

			'tailor_card' : {
				'border_color' : [ [ '', '.tailor-card__header' ], 'border-color', 'tailorValidateColor' ],
				'padding' : [ [ '.tailor-card__content' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_tablet' : [ [ '.tailor-card__content' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_mobile' : [ [ '.tailor-card__content' ], 'padding-{0}', 'tailorValidateUnit' ]
			},

			'tailor_carousel' : {
				'border_color' : [ [ '', '.slick-dots' ], 'border-color', 'tailorValidateColor' ]
			},

			'tailor_grid' : {
				'border_color' : [ [ '.tailor-grid__item' ], 'border-color', 'tailorValidateColor' ],
				'border_style' : function( to, from, model ) {
					return [ {
						selectors: [ '&.tailor-grid--bordered .tailor-grid__item' ],
						declarations: {
							'border-style': tailorValidateString( to ) + '!important'
						}
					} ];
				},
				'border_width' : function( to, from, model ) {
					return [ {
						selectors: [ '.tailor-grid__item' ],
						declarations: {
							'border-width': tailorValidateUnit( to )
						}
					} ];
				},
				'border_width_tablet' : function( to, from, model ) {
					return [ {
						media: 'tablet',
						selectors: [ '.tailor-grid__item' ],
						declarations: {
							'border-width': tailorValidateUnit( to )
						}
					} ];
				},
				'border_width_mobile' : function( to, from, model ) {
					return [ {
						media: 'mobile',
						selectors: [ '.tailor-grid__item' ],
						declarations: {
							'border-width': tailorValidateUnit( to )
						}
					} ];
				}
			},

			'tailor_grid_item' : {
				'padding' : [ [ '&.tailor-grid__item' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_tablet' : [ [ '&.tailor-grid__item' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_mobile' : [ [ '&.tailor-grid__item' ], 'padding-{0}', 'tailorValidateUnit' ]
			},

			'tailor_tabs' : {
				'border_color' : [ [ '.tailor-tabs__navigation-item', '.tailor-tab' ], 'border-color', 'tailorValidateColor' ]
			},
			
			'tailor_tab' : {
				'background_color' : [ [ '&.tailor-tabs__navigation-item', '&.tailor-tab' ], 'background-color', 'tailorValidateColor' ],
				'padding' : [ [ '&.tailor-tab' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_tablet' : [ [ '&.tailor-tab' ], 'padding-{0}', 'tailorValidateUnit' ],
				'padding_mobile' : [ [ '&.tailor-tab' ], 'padding-{0}', 'tailorValidateUnit' ],
				'border_width' : [ [ '&.tailor-tab' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_width_tablet' : [ [ '&.tailor-tab' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'border_width_mobile' : [ [ '&.tailor-tab' ], 'border-{0}-width', 'tailorValidateUnit' ],
				'background_repeat' : [ [ '&.tailor-tab' ], 'background-repeat', 'tailorValidateString' ],
				'background_position' : [ [ '&.tailor-tab' ], 'background-position', 'tailorValidateString' ],
				'background_size' : [ [ '&.tailor-tab' ], 'background-size', 'tailorValidateString' ],
				'background_attachment' : [ [ '&.tailor-tab' ], 'background-attachment', 'tailorValidateString' ]
			},

			'tailor_toggle' : {
				'border_color' : [ [ '.tailor-toggle__title', '.tailor-toggle__body' ], 'border-color', 'tailorValidateColor' ],
				'border_style' : [ [ '.tailor-toggle__title', '.tailor-toggle__body' ], 'border-style', 'tailorValidateString' ],
				'border_radius' : [ [ '.tailor-toggle__title', '.tailor-toggle__body' ], 'border-radius', 'tailorValidateUnit' ]
			},

			'tailor_section' : {
				'max_width' : [ [ '.tailor-section__content' ], 'max-width', 'tailorValidateUnit' ],
				'max_width_tablet' : [ [ '.tailor-section__content' ], 'max-width', 'tailorValidateUnit' ],
				'max_width_mobile' : [ [ '.tailor-section__content' ], 'max-width', 'tailorValidateUnit' ],
				'min_height' : [ [ '.tailor-section__content' ], 'min-height', 'tailorValidateUnit' ],
				'min_height_tablet' : [ [ '.tailor-section__content' ], 'min-height', 'tailorValidateUnit' ],
				'min_height_mobile' : [ [ '.tailor-section__content' ], 'min-height', 'tailorValidateUnit' ]
			}
		};

		/**
		 * Returns the CSS rule definition to be used for the element/setting.
		 *
		 * @since 1.7.3
		 */
		function getDefinition( tag, id, definition ) {
			if ( window.Tailor.Settings.overrides['*'].hasOwnProperty( id ) ) {
				return window.Tailor.Settings.overrides['*'][ id ];
			}
			if ( window.Tailor.Settings.overrides.hasOwnProperty( tag ) && window.Tailor.Settings.overrides[ tag ].hasOwnProperty( id ) ) {
				return window.Tailor.Settings.overrides[ tag ][ id ];
			}
			return definition;
		}

		/**
		 * Registers an Element Setting API callback function.
		 *
		 * @since 1.7.2
		 *
		 * @param definitions
		 */
		function registerCallbacks( definitions ) {
			_.each( definitions, function( definition, id ) {
				SettingAPI.onChange( 'element:' + id, function( to, from, model ) {
					definition = getDefinition( model.get( 'tag' ), id, definition );
					if ( 'function' == typeof definition ) {
						return definition.call( this, to, from, model );
					}

					if ( '' == to ) {
						return [];
					}
					
					var rule = {
						media: getMediaQuery( id ),
						selectors: definition[0],
						declarations: {}
					};
					if ( 'function' == typeof window[ definition[2] ] ) {
						rule.declarations[ definition[1] ] = window[ definition[2] ]( to );
					}
					else {
						rule.declarations[ definition[1] ] = to;
					}
					return [ rule ];
				} );
			} );
		}

		//
		// General
		//
		// Horizontal alignment
		_.each( [
			'horizontal_alignment',
			'horizontal_alignment_tablet',
			'horizontal_alignment_mobile'
		], function( id ) {
			SettingAPI.onChange( ( 'element:' + id ), function( to, from, model ) {
				var media = getMediaQuery( id );
				if ( '' != media ) {
					media = '-' + media;
				}

				// Update class name
				if ( from ) {
					this.el.classList.remove( 'u-text-' + from + media );
				}
				this.el.classList.add( 'u-text-' + to + media );

				if ( 'tailor_list_item' == model.get( 'tag' ) ) {
					var atts = model.get( 'atts' );
					if ( ! _.isEmpty( atts['graphic_background_color'] ) || ! _.isEmpty( atts['graphic_background_color_hover'] ) ) {
						return [ {
							selectors: [ '.tailor-list__body' ],
							declarations: {
								'padding-left': ( 'right' == to ) ? '0' : '1em',
								'padding-right': ( 'right' == to ) ? '1em' : '0'
							}
						} ];
					}
					else {
						return [ {
							selectors: [ '.tailor-list__body' ],
							declarations: {
								'padding-left': '0',
								'padding-right': '0'
							}
						} ];
					}
				}
			} );
		} );

		// Vertical alignment
		_.each( [
			'vertical_alignment',
			'vertical_alignment_tablet',
			'vertical_alignment_mobile'
		], function( id ) {
			SettingAPI.onChange( ( 'element:' + id ), function( to, from, model ) {
				var media = getMediaQuery( id );
				if ( '' !== media ) {
					media = '-' + media;
				}

				if ( from ) {
					this.el.classList.remove( 'u-align-' + from + media );
				}
				this.el.classList.add( 'u-align-' + to + media );
			} );
		} );

		// Button size
		_.each( [
			'size',
			'size_tablet',
			'size_mobile'
		], function( id ) {
			SettingAPI.onChange( ( 'element:' + id ), function( to, from, model ) {
				if ( 'tailor_button' == model.get( 'tag' ) ) {
					var media = getMediaQuery( id );
					if ( '' != media ) {
						media = '-' + media;
					}

					if ( from ) {
						this.el.classList.remove( 'tailor-button--' + from + media );
					}
					this.el.classList.add( 'tailor-button--' + to + media );
				}
			} );
		} );

		// Max width
		registerCallbacks( {
			'width': [ [], 'width', 'tailorValidateUnit' ],
			'width_tablet': [ [], 'width', 'tailorValidateUnit' ],
			'width_mobile': [ [], 'width', 'tailorValidateUnit' ],
			'max_width' : [ [], 'max-width', 'tailorValidateUnit' ],
			'max_width_tablet' : [ [], 'max-width', 'tailorValidateUnit' ],
			'max_width_mobile' : [ [], 'max-width', 'tailorValidateUnit' ],
			'min_height' : [ [], 'min-height', 'tailorValidateUnit' ],
			'min_height_tablet' : [ [], 'min-height', 'tailorValidateUnit' ],
			'min_height_mobile' : [ [], 'min-height', 'tailorValidateUnit' ],
			'min_item_height' : [ [ '.tailor-grid__item' ], 'min-height', 'tailorValidateUnit' ]
		} );

		//
		// Colors
		//
		// Color
		// Color (hover)
		// Link color
		// Link color (hover)
		// Heading color
		// Background color
		// Background color (hover)
		// Graphic color
		// Graphic color (hover)
		// Title color
		// Title background color
		registerCallbacks( {
			'color' : [ [], 'color', 'tailorValidateColor' ],
			'color_hover' : [ [ ':hover' ], 'color', 'tailorValidateColor' ],
			'link_color' : [ [ 'a' ], 'color', 'tailorValidateColor' ],
			'link_color_hover' : [ [ 'a:hover' ], 'color', 'tailorValidateColor' ],
			'heading_color' : [ [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ], 'color', 'tailorValidateColor' ],
			'background_color' : function( to, from, model ) {
				var atts = model.get( 'atts' );

				// Re-render the element if a background image is also being used
				if ( atts['background_image'] ) {
					return false;
				}

				var definition = getDefinition( model.get( 'tag' ), 'background_color', [ [], 'background-color', 'tailorValidateColor' ] );
				if ( 'function' == typeof definition ) {
					return definition.call( this, to, from, model );
				}

				var rule = {
					selectors: definition[0],
					declarations: {}
				};
				if ( 'function' == typeof window[ definition[2] ] ) {
					rule.declarations[ definition[1] ] = window[ definition[2] ]( to );
				}
				else {
					rule.declarations[ definition[1] ] = to;
				}
				return [ rule ];
			},
			'background_color_hover' : [ [ ':hover' ], 'background-color', 'tailorValidateColor' ],
			'border_color' : [ [], 'border-color', 'tailorValidateColor' ],
			'border_color_hover' : [ [ ':hover' ], 'border-color', 'tailorValidateColor' ],
			'graphic_color' : function( to, from, model ) {
				var tag = model.get( 'tag' );
				if ( 'tailor_box' == tag ) {
					return [ {
						selectors: [ '.tailor-box__graphic' ],
						declarations: {
							'color' : tailorValidateColor( to )
						}
					} ];
				}
				else if ( 'tailor_list_item' == tag ) {
					return [ {
						selectors: [ '.tailor-list__graphic' ],
						declarations: {
							'color' : tailorValidateColor( to )
						}
					} ];
				}
			},
			'graphic_color_hover' : function( to, from, model ) {
				var tag = model.get( 'tag' );
				if ( 'tailor_box' == tag ) {
					return [ {
						selectors: [ '.tailor-box__graphic:hover' ],
						declarations: {
							'color' : tailorValidateColor( to )
						}
					} ];
				}
				else if ( 'tailor_list_item' == tag ) {
					return [ {
						selectors: [ '.tailor-list__graphic:hover' ],
						declarations: {
							'color' : tailorValidateColor( to )
						}
					} ];
				}
			},
			'graphic_background_color' : function( to, from, model ) {
				var tag = model.get( 'tag' );
				var rules = [];

				if ( 'tailor_box' == tag ) {
					if ( to ) {
						rules.push( {
							selectors: [ '.tailor-box__graphic' ],
							declarations: {
								'margin-bottom': '1em',
								'background-color' : tailorValidateColor( to ),
								'text-align': 'center'
							}
						} );
					}
				}
				else if ( 'tailor_list_item' == tag ) {
					var atts = model.get( 'atts' );
					var alignment = atts['horizontal_alignment'];

					if ( to ) {
						rules.push( {
							selectors: [ '.tailor-list__graphic' ],
							declarations: {
								'background-color' : tailorValidateColor( to ),
								'text-align': 'center'
							}
						} );
						rules.push( {
							selectors: [ '.tailor-list__body' ],
							declarations: {
								'padding-left': ( 'right' == alignment ) ? '0' : '1em',
								'padding-right': ( 'right' == alignment ) ? '1em' : '0'
							}
						} );
					}
					else {
						if ( ! _.isEmpty( atts['graphic_background_color_hover'] ) ) {
							rules.push( {
								selectors: [ '.tailor-list__body' ],
								declarations: {
									'padding-left': ( 'right' == alignment ) ? '0' : '1em',
									'padding-right': ( 'right' == alignment ) ? '1em' : '0'
								}
							} );
						}
						else {
							rules.push( {
								selectors: [ '.tailor-list__body' ],
								declarations: {
									'padding-left': '0',
									'padding-right': '0'
								}
							} );
						}
					}
				}

				return rules;
			},
			'graphic_background_color_hover' : function( to, from, model ) {
				var tag = model.get( 'tag' );
				var rules = [];

				if ( 'tailor_box' == tag ) {
					if ( to ) {
						rules.push( {
							selectors: [ '.tailor-box__graphic' ],
							declarations: {
								'margin-bottom': '1em',
								'text-align': 'center'
							}
						} );
						rules.push( {
							selectors: [ '.tailor-box__graphic:hover' ],
							declarations: {
								'background-color' : tailorValidateColor( to )
							}
						} );
					}
				}
				else if ( 'tailor_list_item' == tag ) {
					var atts = model.get( 'atts' );
					var alignment = atts['horizontal_alignment'];

					if ( to ) {
						rules.push( {
							selectors: [ '.tailor-list__graphic' ],
							declarations: {
								'text-align': 'center'
							}
						} );
						rules.push( {
							selectors: [ '.tailor-list__body' ],
							declarations: {
								'padding-left': ( 'right' == alignment ) ? '0' : '1em',
								'padding-right': ( 'right' == alignment ) ? '1em' : '0'
							}
						} );
						rules.push( {
							selectors: [ '.tailor-list__graphic:hover' ],
							declarations: {
								'background-color' : tailorValidateColor( to )
							}
						} );
					}
					else {
						if ( ! _.isEmpty( atts['graphic_background_color'] ) ) {
							rules.push( {
								selectors: [ '.tailor-list__body' ],
								declarations: {
									'padding-left': ( 'right' == alignment ) ? '0' : '1em',
									'padding-right': ( 'right' == alignment ) ? '1em' : '0'
								}
							} );
						}
						else {
							rules.push( {
								selectors: [ '.tailor-list__body' ],
								declarations: {
									'padding-left': '0',
									'padding-right': '0'
								}
							} );
						}
					}
				}

				return rules;
			},
			'title_color' : [ [ '.tailor-toggle__title' ], 'color', 'tailorValidateColor' ],
			'title_background_color' : [ [ '.tailor-toggle__title' ], 'background-color', 'tailorValidateColor' ],
			'navigation_color' : function( to, from, model ) {
				return [ {
					'selectors' : [ '.slick-active button:before' ],
					'declarations' : {
						'background-color' : tailorValidateColor( to )
					}
				}, {
					'selectors' : [ '.slick-arrow:not( .slick-disabled )' ],
					'declarations' : {
						'color' : tailorValidateColor( to )
					}
				} ];
			}
		} );

		//
		// Attributes
		//
		// Border style
		// Border radius
		// Background repeat
		// Background position
		// Background size
		// Background attachment
		registerCallbacks( {
			'class' : function( to, from, model ) {
				var classNames;
				if ( ! _.isEmpty( from ) ) {

					// Prevent multiple whitespace and whitespace at the end of string.
					classNames = from.trim().split( /\s+(?!$)/g );
					for ( var i in classNames ) {
						if ( classNames.hasOwnProperty( i ) ) {
							this.el.classList.remove( classNames[ i ] );
						}
					}
				}
				if ( ! _.isEmpty( to ) ) {
					classNames = to.trim().split( /\s+(?!$)/g );
					for ( var j in classNames ) {
						if ( classNames.hasOwnProperty( j ) ) {
							this.el.classList.add( classNames[ j ] );
						}
					}
				}
			},
			'border_style' : [ [], 'border-style', 'tailorValidateString' ],
			'border_radius' : [ [], 'border-radius', 'tailorValidateUnit' ],
			'background_repeat' : [ [], 'background-repeat', 'tailorValidateString' ],
			'background_position' : [ [], 'background-position', 'tailorValidateString' ],
			'background_size' : [ [], 'background-size', 'tailorValidateString' ],
			'background_attachment' : [ [], 'background-attachment', 'tailorValidateString' ],
			'shadow' : function( to, from, model ) {
				var definition = getDefinition( model.get( 'tag' ), 'shadow', [ [] ] );
				if ( 'function' == typeof definition ) {
					return definition.call( this, to, from, model );
				}

				if ( 1 == to ) {
					return [ {
						selectors: definition[0],
						declarations: {
							'box-shadow' : '0 2px 6px rgba(0, 0, 0, 0.1)'
						}
					} ];
				}
				return [];
			}
		} );

		// Margin
		// Padding
		// Border width
		_.each( {
			'margin' : [ [], 'margin-{0}', 'tailorValidateUnit' ],
			'margin_tablet' : [ [], 'margin-{0}', 'tailorValidateUnit' ],
			'margin_mobile' : [ [], 'margin-{0}', 'tailorValidateUnit' ],
			'padding' : [ [], 'padding-{0}', 'tailorValidateUnit' ],
			'padding_tablet' : [ [], 'padding-{0}', 'tailorValidateUnit' ],
			'padding_mobile' : [ [], 'padding-{0}', 'tailorValidateUnit' ],
			'border_width' : [ [], 'border-{0}-width', 'tailorValidateUnit' ],
			'border_width_tablet' : [ [], 'border-{0}-width', 'tailorValidateUnit' ],
			'border_width_mobile' : [ [], 'border-{0}-width', 'tailorValidateUnit' ]
		}, function( definition, id ) {
			SettingAPI.onChange( ( 'element:' + id ), function( to, from, model ) {
				definition = getDefinition( model.get( 'tag' ), id, definition );
				if ( 'function' == typeof definition ) {
					return definition.call( this, to, from, model );
				}

				var rules = [];
				var rule = {
					media: getMediaQuery( id ),
					selectors: definition[0],
					declarations: {}
				};

				_.each( getStyleValues( to ), function( value, position ) {
					if ( 'function' == typeof window[ definition[3] ] ) {
						rule.declarations[ definition[1].replace( '{0}', position ) ] = window[ definition[2] ]( value );
					}
					else {
						rule.declarations[ definition[1].replace( '{0}', position ) ] = value;
					}
				} );

				if ( _.keys( rule.declarations ).length > 0 ) {
					rules.push( rule );
				}
				return rules;
			} );
		} );
	} );

} ( window, window.app, window.Tailor.Api.Setting ) );