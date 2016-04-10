Tailor.Objects = Tailor.Objects || {};

( function( Tailor, Api, $ ) {

    'use strict';

    var stylesheet = document.getElementById( 'tailor-custom-page-css' );
    var originalCSS = stylesheet.innerHTML;
    var rules = [];

	/**
	 * Generates custom CSS for the page.
	 *
	 * Ensures that any preexisting custom CSS is preserved.
	 *
	 * @since 1.0.0
	 */
    var generateCSS = function() {
        var customCSS = '';
        for ( var settingId in rules ) {
            if ( rules.hasOwnProperty( settingId ) ) {
                var rule = rules[ settingId ];
                var selectorString = Tailor.CSS.parseSelectors( rule.selectors );
                var declarationString = Tailor.CSS.parseDeclarations( rule.declarations );

                customCSS += "\n" + selectorString + " {" + declarationString + "}";
            }
        }

        customCSS = originalCSS + customCSS;
        stylesheet.innerHTML = customCSS;
    };

    Api.Setting( '_post_title', function( to, from ) {
        $( 'h1, h2, h1 a, h2 a' ).each( function() {
            if ( from == this.textContent ) {
                this.textContent = to;
            }
        } );
    } );

    Api.Setting( '_tailor_page_css', function( to, from ) {
        originalCSS = to;

        generateCSS();
    } );

    Api.Setting( '_tailor_section_width', function( to, from ) {
        var unit = to.replace( /[0-9]/g, '' );
        var value = to.replace( unit, '' );

        if ( value ) {
            rules['sectionWidth'] = {
                selectors : ['.tailor-section .tailor-section__content'],
                declarations : { 'max-width' : value + unit }
            };

            generateCSS();
        }
        else if ( rules['sectionWidth'] ) {
            delete rules['sectionWidth'];

            generateCSS();
        }
    } );

    Api.Setting( '_tailor_element_spacing', function( to, from ) {
        var value = to.replace( /[a-z]/g, '' );
        var unit = to.replace( /[0-9]/g, '' );

        if ( value ) {
            rules['elementSpacing'] = {
                selectors : ['.tailor-element'],
                declarations : { 'margin-bottom' : value + unit }
            };

            generateCSS();
        }
        else if ( rules['elementSpacing'] ) {
            delete rules['elementSpacing'];

            generateCSS();
        }
    } );

    Api.Setting( '_tailor_column_spacing', function( to, from ) {
        var value = to.replace( /[a-z]/g, '' ) / 2;
        var unit = to.replace( /[0-9]/g, '' );

        if ( value ) {
            rules['columnSpacing'] = {
                selectors : ['.tailor-element.tailor-row .tailor-column'],
                declarations : { 'padding-left' : value + unit, 'padding-right' : value + unit }
            };
            rules['rowMargin'] = {
                selectors : ['.tailor-element.tailor-row'],
                declarations : { 'margin-left' : ( -value ) + unit, 'margin-right' : ( -value ) + unit }
            };

            generateCSS();
        }
        else if ( rules['columnSpacing'] ) {
            delete rules['columnSpacing'];
            delete rules['rowMargin'];

            generateCSS();
        }
    } );

	_.extend( Tailor.Objects, {
		Carousel : require( './components/carousel' ),
		PostsCarousel : require( './components/carousel-simple' ),
		Tabs : require( './components/tabs' ),
		Toggles : require( './components/toggles' ),
		Map : require( './components/map' ),
		Masonry : require( './components/masonry' ),
		Slideshow : require( './components/slideshow' ),
		Lightbox : require( './components/lightbox' )
	} );

	Api.Element.onRender( 'tailor_section', function( atts, model ) {
		var section = this;

		// Refreshes all child elements when the section width setting changes
		Api.Setting( '_tailor_section_width', function( to, from ) {
			section.triggerAll( 'element:parent:change', section );
		} );
	} );

	Api.Element.onRender( 'tailor_column', function( atts, model ) {
		var column = this;

		// Refreshes all child elements when the column spacing setting changes
		Api.Setting( '_tailor_column_spacing', function( to, from ) {
			column.triggerAll( 'element:parent:change', column );
		} );
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

    Api.Element.onRender( 'tailor_content', function( atts, model ) {
	    this.$el.tailorLightbox( {
		    disableOn : function() {
			    return $el.hasClass( 'is-selected' );
		    }
	    } );
    } );

    Api.Element.onRender( 'tailor_tabs', function( atts, model ) {
        this.$el.tailorTabs();
    } );

    Api.Element.onRender( 'tailor_toggles', function( atts, model ) {
        this.$el.tailorToggles();
    } );

    Api.Element.onRender( 'tailor_map', function( atts, model ) {
        this.$el.tailorGoogleMap();
    } );

} ) ( window.Tailor, window.Tailor.Api, jQuery );