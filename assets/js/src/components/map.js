/**
 * Tailor.Objects.Map
 *
 * A map module.
 *
 * @class
 */
var $ = window.jQuery,
    Map;

/**
 * The Map object.
 *
 * @since 1.0.0
 *
 * @param el
 * @param options
 * @param callbacks
 *
 * @constructor
 */
Map = function( el, options, callbacks ) {
    this.el = el;
    this.$el = $( el );
    this.$win = $( window );

	this.options = $.extend( {}, this.defaults, this.$el.data(), options );
	this.callbacks = $.extend( {}, this.callbacks, callbacks );

    this.initialize();
};

Map.prototype = {

    defaults : {
        height : 450,
        address : '',
        latitude : '',
        longitude : '',
        zoom : 12,
        draggable : 1,
        scrollwheel : 0,
        controls : 0,
        hue : null,
        saturation : 0
    },

	callbacks : {

		/**
		 * Callback function to be run when the object is initialized.
		 *
		 * @since 1.0.0
		 */
		onInitialize : function () {},

		/**
		 * Callback function to be run when the object is destroyed.
		 *
		 * @since 1.0.0
		 */
		onDestroy : function () {}
	},

    getStyles : function( saturation, hue ) {

        return  [
            {
                featureType : 'all',
                elementType : 'all',
                stylers     : [
                    { saturation : ( saturation ) ? saturation : null },
                    { hue : ( hue ) ? hue : null }
                ]
            },
            {
                featureType : 'water',
                elementType : 'all',
                stylers     : [
                    { hue : ( hue ) ? hue : null },
                    { saturation : ( saturation ) ? saturation : null },
                    { lightness  : 50 }
                ]
            },
            {
                featureType : 'poi',
                elementType : 'all',
                stylers     : [
                    { visibility : 'simplified' } // off
                ]
            }
        ]
    },

    /**
     * Initializes the Map instance.
     *
     * @since 1.0.0
     */
    initialize : function() {
        var map = this;

        this.markers = [];
        this.infoWindows = [];
        this.$canvas = this.$el.find( '.tailor-map__canvas').height( this.options.height );

        this.getCoordinates( this.options ).then( function( coordinates ) {
            map.center = coordinates;

            var controls = map.options.controls;
            var settings = {
                zoom : map.options.zoom,
                draggable : map.options.draggable,
                scrollwheel : map.options.scrollwheel,
                center : coordinates,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: ! controls,
                panControl: controls,
                rotateControl : controls,
                scaleControl: controls,
                zoomControl: controls,
                mapTypeControl: controls,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_CENTER
                }
            };
            var styles = map.getStyles( map.options.saturation, map.options.hue );

            map.map = new google.maps.Map( map.$canvas[0], settings );
            map.map.mapTypes.set( 'map_style', new google.maps.StyledMapType( styles, { name : 'Styled Map' } ) );
            map.map.setMapTypeId( 'map_style' );

            map.setupMarkers( map.$el, map.map );
            map.addEventListeners();

	        if ( 'function' == typeof map.callbacks.onInitialize ) {
		        map.callbacks.onInitialize.call( map );
	        }
        } );
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.$el

	        // Fires before the element is destroyed
	        //.on( 'before:element:refresh', $.proxy( this.maybeDestroy, this ) )

            // Fires when the element parent changes
            .on( 'element:change:parent', $.proxy( this.refresh, this ) )

            // Fires before the element is destroyed
            .on( 'before:element:destroy', $.proxy( this.maybeDestroy, this ) )

            // Fires after the parent element is modified
            .on( 'element:parent:change', $.proxy( this.refresh, this ) );

	    this.$win.on( 'resize', $.proxy( this.refresh, this ) );
    },

    /**
     * Refreshes the map if the event target is the map element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeRefresh : function( e ) {
        if ( e.target == this.el ) {
            this.refresh();
        }
    },

    /**
     * Refreshes the map.
     *
     * @since 1.0.0
     */
    refresh : function() {
        google.maps.event.trigger( this.map, 'resize' );
        this.map.setCenter( this.center );
    },

    /**
     * Destroys the map if the event target is the map element.
     *
     * @since 1.0.0
     *
     * @param e
     */
    maybeDestroy : function( e ) {
        if ( e.target == this.el ) {
            this.destroy();
        }
    },

    /**
     * Returns the map coordinates.
     *
     * @since 1.0.0
     * 
     * @param options
     * @returns {*}
     */
    getCoordinates : function( options ) {
        return $.Deferred( function( deferred ) {

            if ( 'undefined' == typeof google ) {
                deferred.reject( new Error( 'The Google Maps API is currently unavailable' ) );
            }

            else if ( '' != options.address ) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode( { address : options.address }, function( results, status ) {
                    if ( google.maps.GeocoderStatus.OK == status ) {
                        deferred.resolve( results[0].geometry.location );
                    }
                    else if ( options.latitude && options.longitude ) {
                        deferred.resolve( new google.maps.LatLng( options.latitude, options.longitude ) );
                    }
                    else {
                        deferred.reject( new Error( status ) );
                    }
                } );

            }
            else if ( options.latitude && options.longitude ) {
                deferred.resolve( new google.maps.LatLng( options.latitude, options.longitude ) );
            }
            else {
                deferred.reject( new Error( 'No address or map coordinates provided'  ) );
            }
        } ).promise();
    },

    /**
     * Sets up the map markers.
     *
     * @since 1.0.0
     *
     * @param $el
     * @param googleMap
     */
    setupMarkers : function( $el, googleMap ) {
        var map = this;

        this.$el.find( '.tailor-map__marker' ).each( function( index, el ) {

            var defaults = {
                address : '',
                latitude : '',
                longitude : '',
                image : ''
            };

            var settings = _.extend( {}, defaults, $( el ).data() );

            map.getCoordinates( settings ).then( function( coordinates ) {
                map.markers[ index ] = new google.maps.Marker( {
                    map : googleMap,
                    position : coordinates,
                    infoWindowIndex : index,
                    icon : settings.image
                } );

                if ( 'null' != el.innerHTML ) {
                    map.infoWindows[ index ] = new google.maps.InfoWindow( {
                        content : el.innerHTML
                    } );

                    google.maps.event.addListener( map.markers[ index ], 'click', function() {
                        if ( el.innerHTML ) {
                            map.infoWindows[ index ].open( googleMap, this );
                        }
                    } );
                }
            } );
        } );
    },

    /**
     * Destroys the the Map instance.
     *
     * @since 1.0.0
     */
    destroy : function() {
        delete this.map;
        delete this.markers;
        delete this.infoWindows;

	    //this.$canvas.remove();
	    this.$el.off();
	    this.$win.off( 'resize', $.proxy( this.refresh, this ) );

	    if ( 'function' == typeof this.callbacks.onDestroy ) {
		    this.callbacks.onDestroy.call( this );
	    }
    }
};

/**
 * Google Map jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @returns {*}
 */
$.fn.tailorGoogleMap = function( options, callbacks ) {
    return this.each( function() {
        var instance = $.data( this, 'tailorGoogleMap' );
        if ( ! instance ) {
            $.data( this, 'tailorGoogleMap', new Map( this, options, callbacks ) );
        }
    } );
};

module.exports = Map;