( function( window, $ ) {

    // Do nothing if the canvas does not exist in the page
    if ( null == document.getElementById( "canvas" ) ) {
        console.error( 'The canvas does not exist in the page.  This could be caused by a plugin or theme conflict.' );
        return;
    }

    // Include utilities
    require( './shared/utility/polyfills/classlist' );
    require( './shared/utility/polyfills/raf' );
    require( './shared/utility/polyfills/transitions' );
    require( './shared/utility/ajax' );

    Marionette.Behaviors.behaviorsLookup = function() {
        return {
            Container:          require( './canvas/components/behaviors/container' ),
            Droppable:          require( './canvas/components/behaviors/droppable' ),
            Editable:           require( './canvas/components/behaviors/editable' ),
            Movable:            require( './canvas/components/behaviors/movable' ),
            Draggable:          require( './shared/components/behaviors/draggable' )
        };
    };
    
    // Create the app
    var App = require( './canvas/app' );
    window.app = new App();

    // Create the Tailor object
    var abstractComponent = require( './shared/components/ui/abstract' );
    window.Tailor = {
        Api:            {
            Setting:        require( './shared/components/api/setting' ),
            Element:        require( './canvas/components/api/element' )
        },
        CSS:            require( './shared/utility/css' ),
        Models:         {},
        Views:          {},
        Settings:       {},
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

    // Canvas components
    window.Tailor.Components.Carousel = require( './canvas/components/ui/carousel' );
    window.Tailor.Components.SimpleCarousel = require( './canvas/components/ui/carousel-simple' );

    app.addRegions( {
        canvasRegion : {
            selector : "#canvas",
            regionClass : require( './canvas/modules/canvas/canvas-region' )
        },
        selectRegion : {
            selector : "#select",
            regionClass : require( './canvas/modules/tools/select-region' )
        }
    } );

    // Initialize preview
    require( './canvas/preview' );

    app.on( 'before:start', function() {

        // Load element-specific models
        Tailor.Models.Section =             require( './canvas/entities/models/wrappers/section' );
        Tailor.Models.Row =                 require( './canvas/entities/models/containers/row' );
        Tailor.Models.Column =              require( './canvas/entities/models/children/column' );
        Tailor.Models.GridItem =            require( './canvas/entities/models/children/grid-item' );
        Tailor.Models.Tabs =                require( './canvas/entities/models/containers/tabs' );
        Tailor.Models.Carousel =            require( './canvas/entities/models/containers/carousel' );
        Tailor.Models.Container =           require( './canvas/entities/models/element-container' );
        Tailor.Models.Wrapper =             require( './canvas/entities/models/element-wrapper' );
        Tailor.Models.Child =               require( './canvas/entities/models/element-child' );
        Tailor.Models.Default =             require( './canvas/entities/models/element' );

        // Load views
        Tailor.Views.Column =               require( './canvas/components/elements/children/column' );
        Tailor.Views.Tab =                  require( './canvas/components/elements/children/tab' );
        Tailor.Views.CarouselItem =         require( './canvas/components/elements/children/carousel-item' );
        Tailor.Views.Tabs =                 require( './canvas/components/elements/containers/tabs' );
        Tailor.Views.Carousel =             require( './canvas/components/elements/containers/carousel' );
        Tailor.Views.Container =            require( './canvas/components/elements/element-container' );
        Tailor.Views.Wrapper =              require( './canvas/components/elements/element-container' );
        Tailor.Views.Child =                require( './canvas/components/elements/element-container' );
        Tailor.Views.Default =              require( './canvas/components/elements/element' );

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

    app.channel.on( 'sidebar:initialize', function() {
        
        // Load modules
        app.module( 'module:css', require( './canvas/modules/css/css' ) );
        app.module( 'module:elements', require( './canvas/modules/elements/elements' ) );
        app.module( 'module:templates', require( './canvas/modules/templates/templates' ) );
        app.module( 'module:canvas', require( './canvas/modules/canvas/canvas' ) );
        app.module( 'module:tools', require( './canvas/modules/tools/tools' ) );

        app.channel.on( 'module:canvas:ready', function() {

            /**
             * Fires when the canvas is initialized.
             *
             * @since 1.5.0
             *
             * @param app
             */
            app.channel.trigger( 'canvas:initialize', app );
        } );
    } );

    function start() {
        app.start( {
            elements : window._elements || [],
            nonces : window._nonces || [],
            mediaQueries : window._media_queries || {},
            cssRules : window._css_rules || {}
        } );
    }

    $( function() {
        var sidebarApp = window.parent.app;

        // Wait until the sidebar is initialized before starting the canvas
        if ( sidebarApp._initialized ) {
            start();
        }
        else {
            sidebarApp.on('start', function() {
                start();
            } );
        }
    } );

} ( window, Backbone.$ ) );

//require( './utility/debug' );