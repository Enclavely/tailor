/**
 * Tailor.Components.Map
 *
 * A map component.
 *
 * @class
 */
var $ = window.jQuery,
    Components = window.Tailor.Components,
    Map;

Map = Components.create( {

    getDefaults: function() {
        return {
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
        };
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
     * Initializes the component.
     *
     * @since 1.7.5
     */
    onInitialize : function() {
        var component = this;
        this.markers = [];
        this.infoWindows = [];
        this.$canvas = this.$el.find( '.tailor-map__canvas').height( this.options.height );

        this.getCoordinates( this.options )
            .then( function( coordinates ) {
                component.center = coordinates;
                var controls = component.options.controls;
                var settings = {
                    zoom : component.options.zoom,
                    draggable : component.options.draggable,
                    scrollwheel : component.options.scrollwheel,
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
                var styles = component.getStyles( component.options.saturation, component.options.hue );
    
                component.map = new google.maps.Map( component.$canvas[0], settings );
                component.map.mapTypes.set( 'map_style', new google.maps.StyledMapType( styles, { name : 'Styled Map' } ) );
                component.map.setMapTypeId( 'map_style' );
                component.setupMarkers( component.$el, component.map );
            } );
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
                deferred.reject( new Error( 'No address or map coordinates provided' ) );
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
     * Refreshes and centers the map.
     * 
     * @since 1.7.5
     */
    refreshMap: function() {
        if (  this.map ) {
            google.maps.event.trigger( this.map, 'resize' );
            this.map.setCenter( this.center );
        }
    },

    /**
     * Element listeners
     */
    onMove: function() {
        this.refreshMap();
    },

    onRefresh: function() {
        this.refreshMap();
    },

    onChangeParent: function() {
        this.refreshMap();
    },
    
    onDestroy : function() {
        delete this.map;
        delete this.markers;
        delete this.infoWindows;
    },

    /**
     * Window listeners
     */
    onResize: function() {
        this.refreshMap();
    }

} );

/**
 * Google Map jQuery plugin.
 *
 * @since 1.0.0
 *
 * @param options
 * @param callbacks
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