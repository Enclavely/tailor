( function( window, $ ) {

    // Do nothing if the canvas does not exist in the page
    if ( null == document.getElementById( "canvas" ) ) {
        console.error( 'The canvas does not exist in the page.  This could be caused by a plugin or theme conflict.' );
        return;
    }

    // Include utilities
    require( '../shared/utility/polyfills/classlist' );
    require( '../shared/utility/polyfills/raf' );
    require( '../shared/utility/polyfills/transitions' );
    require( '../shared/utility/ajax' );

    // Include components
    require( '../shared/components/ui/tabs' );
    require( '../shared/components/ui/toggles' );
    require( '../shared/components/ui/map' );
    require( '../shared/components/ui/masonry' );
    require( '../shared/components/ui/slideshow' );
    require( '../shared/components/ui/lightbox' );
    require( '../shared/components/ui/parallax' );
    require( './components/ui/carousel' );
    require( './components/ui/carousel-simple' );
    Marionette.Behaviors.behaviorsLookup = function() {
        return {
            Container:          require( './components/behaviors/container' ),
            Droppable:          require( './components/behaviors/droppable' ),
            Editable:           require( './components/behaviors/editable' ),
            Movable:            require( './components/behaviors/movable' ),
            Draggable:          require( '../shared/components/behaviors/draggable' )
        };
    };
    
    // Create the app
    var App = require( './app' );
    window.app = new App();

    // Create the Tailor object
    window.Tailor = {
        Api : {
            Setting :   require( '../shared/components/api/setting' ),
            Element :   require( './components/api/element' )
        },
        CSS :       require( '../shared/utility/css' ),
        Models :    {},
        Views :     {}
    };

    app.addRegions( {
        canvasRegion : {
            selector : "#canvas",
            regionClass : require( './modules/canvas/canvas-region' )
        },
        selectRegion : {
            selector : "#select",
            regionClass : require( './modules/tools/select-region' )
        }
    } );

    // Initialize preview
    require( './preview' );

    app.on( 'before:start', function() {

        // Load element-specific models
        Tailor.Models.Section =             require( './entities/models/wrappers/section' );
        Tailor.Models.Row =                 require( './entities/models/containers/row' );
        Tailor.Models.Column =              require( './entities/models/children/column' );
        Tailor.Models.GridItem =            require( './entities/models/children/grid-item' );
        Tailor.Models.Tabs =                require( './entities/models/containers/tabs' );
        Tailor.Models.Carousel =            require( './entities/models/containers/carousel' );
        Tailor.Models.Container =           require( './entities/models/element-container' );
        Tailor.Models.Wrapper =             require( './entities/models/element-wrapper' );
        Tailor.Models.Child =               require( './entities/models/element-child' );
        Tailor.Models.Default =             require( './entities/models/element' );

        // Load views
        Tailor.Views.Section =              require( './components/elements/wrappers/section' );
        Tailor.Views.Box =                  require( './components/elements/wrappers/box' );
        Tailor.Views.Card =                 require( './components/elements/wrappers/card' );
        Tailor.Views.Hero =                 require( './components/elements/wrappers/hero' );
        Tailor.Views.Column =               require( './components/elements/children/column' );
        Tailor.Views.Tab =                  require( './components/elements/children/tab' );
        Tailor.Views.Toggle =               require( './components/elements/children/toggle' );
        Tailor.Views.ListItem =             require( './components/elements/children/list-item' );
        Tailor.Views.CarouselItem =         require( './components/elements/children/carousel-item' );
        Tailor.Views.Tabs =                 require( './components/elements/containers/tabs' );
        Tailor.Views.Carousel =             require( './components/elements/containers/carousel' );
        Tailor.Views.Container =            require( './components/elements/element-container' );
        Tailor.Views.Wrapper =              require( './components/elements/element-container' );
        Tailor.Views.Child =                require( './components/elements/element-container' );
        Tailor.Views.Default =              require( './components/elements/element' );

        /**
         * Returns the element name (in title case) based on the tag or type.
         *
         * @since 1.5.0
         *
         * @param string
         */
        function getName( string ) {
            string = string || '';
            return string
                .replace( /_|-|tailor_/gi, ' ' )
                .replace( /(?: |\b)(\w)/g, function( key ) {
                    return key.toUpperCase().replace( /\s+/g, '' );
                } );
        }

        /**
         * Returns the appropriate object based on tag or type.
         *
         * @since 1.5.0
         *
         * @param tag
         * @param type
         * @param object
         * @returns {*}
         */
        Tailor.lookup = function( tag, type, object ) {

            if ( ! Tailor.hasOwnProperty( object ) ) {
                console.error( 'Object type ' + object + ' does not exist' );
                return;
            }

            var name = getName( tag );
            if ( Tailor[ object ].hasOwnProperty( name ) ) {
                return Tailor[ object ][ name ];
            }

            if ( type ) {
                name = getName( type );
                if ( Tailor[ object ].hasOwnProperty( name ) ) {
                    return Tailor[ object ][ name ];
                }
            }

            return Tailor[ object ].Default;
        };
    } );

    app.on( 'start', function() {

        // Load modules
        app.module( 'module:elements', require( './modules/elements/elements' ) );
        app.module( 'module:templates', require( './modules/templates/templates' ) );
        app.module( 'module:canvas', require( './modules/canvas/canvas' ) );
        app.module( 'module:tools', require( './modules/tools/tools' ) );
        app.module( 'module:css', require( './modules/css/css' ) );
    } );

    $( document ).ready( function() {

        // Start the app
        app.start( {
            elements : window._elements || [],
            nonces : window._nonces || [],
            mediaQueries : window._media_queries || {},
            cssRules : window._css_rules || {}
        } );
        
        /**
         * Fires when the canvas is initialized.
         *
         * @since 1.5.0
         *
         * @param app
         */
        app.channel.trigger( 'canvas:initialize', app );
    } );

} ( window, Backbone.$ ) );

//require( './utility/debug' );