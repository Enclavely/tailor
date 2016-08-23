
( function( window, $ ) {
    
    'use strict';
    
    var $doc = $( document );
    var $win = $( window );
    
    // Include utilities
    require( '../shared/utility/polyfills/classlist' );
    require( '../shared/utility/polyfills/raf' );
    require( '../shared/utility/polyfills/transitions' );
    require( '../shared/utility/ajax' );

    // Include components
    Marionette.Behaviors.behaviorsLookup = function() {
        return {
            Resizable:          require( './components/behaviors/resizable' ),
            Panel:              require( './components/behaviors/panel' ),
            Draggable:          require( '../shared/components/behaviors/draggable' )
        };
    };
    
    // Create the app
    var App = require( './app' );
    window.app = new App();

    // Create the Tailor object
    window.Tailor = {
        Api : {
            Setting :   require( '../shared/components/api/setting' )
        },
        Notify :    require( '../shared/utility/notify' ),
        Models :    {},
        Panels :    {},
        Sections :  {},
        Controls :  {},
        Items :     {},
        Helpers :   {
            
            /**
             * Evaluates whether the given condition is true, given two values.
             *
             * @since 1.5.0
             *
             * @param actual
             * @param condition
             * @param required
             * 
             * @returns {*}
             */
            checkCondition : function( condition, actual, required ) {
                switch ( condition ) {
                    case 'equals' : return actual === required;

                    case 'not':
                        if ( _.isArray( required ) ) {
                            return -1 === required.indexOf( actual );
                        }
                        return actual !== required;

                    case 'lessThan': return ( actual < parseInt( required, 10 ) );

                    case 'greaterThan': return ( actual > parseInt( required, 10 ) );

                    case 'contains' :
                        if ( _.isString( actual ) ) {
                            actual = actual.split( ',' );
                        }
                        if ( _.isArray( required ) ) {
                            var intersection = _.intersection( required, actual );
                            return 0 !== intersection.length;
                        }
                        return -1 !== _.indexOf( actual, required );
                }
            }
        }
    };

    wp.media.view.settings.post.id = window.post.id;

    app.addRegions( {
        content : '#tailor-sidebar-content',
        dialog : {
            selector : "#tailor-dialog-container",
            regionClass : require( './modules/dialog/dialog-region' )
        },
        modal : {
            selector : "#tailor-modal-container",
            regionClass : require( './modules/modal/modal-region' )
        }
    } );

    // Load models
    Tailor.Models.Container =           require( './entities/models/element-container' );
    Tailor.Models.Wrapper =             require( './entities/models/element-wrapper' );
    Tailor.Models.Section =             require( './entities/models/element-wrapper' ); // Sections are just special wrappers
    Tailor.Models.Default =             require( './entities/models/element' );

    // Load views
    Tailor.Panels.Default =             require( './components/panels/panel-default' );
    Tailor.Panels.Empty =               require( './components/panels/panel-empty' );
    Tailor.Sections.Default =           require( './components/sections/section-default' );
    Tailor.Controls.ButtonGroup =       require( './components/controls/button-group' );
    Tailor.Controls.Checkbox =          require( './components/controls/checkbox' );
    Tailor.Controls.Code =              require( './components/controls/code' );
    Tailor.Controls.Colorpicker =       require( './components/controls/colorpicker' );
    Tailor.Controls.Editor =            require( './components/controls/editor' );
    Tailor.Controls.Gallery =           require( './components/controls/gallery' );
    Tailor.Controls.Icon =              require( './components/controls/icon' );
    Tailor.Controls.Image =             require( './components/controls/image' );
    Tailor.Controls.Link =              require( './components/controls/link' );
    Tailor.Controls.List =              require( './components/controls/list' );
    Tailor.Controls.Radio =             require( './components/controls/radio' );
    Tailor.Controls.Range =             require( './components/controls/range' );
    Tailor.Controls.Select =            require( './components/controls/select' );
    Tailor.Controls.SelectMulti =       require( './components/controls/select-multi' );
    Tailor.Controls.Style =             require( './components/controls/style' );
    Tailor.Controls.Switch =            require( './components/controls/switch' );
    Tailor.Controls.Text =              require( './components/controls/text' );
    Tailor.Controls.Textarea =          require( './components/controls/textarea' );
    Tailor.Controls.Video =             require( './components/controls/video' );
    Tailor.Controls.Default =           require( './components/controls/text' );

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

    app.on( 'start', function( options ) {

        // Load modules
        app.module( 'module:library', require( './modules/library/library' ) );
        app.module( 'module:templates', require( './modules/templates/templates' ) );
        app.module( 'module:settings', require( './modules/settings/settings' ) );
        app.module( 'module:history', require( './modules/history/history' ) );
        app.module( 'module:sections', require( './modules/sections/sections' ) );
        app.module( 'module:panels', require( './modules/panels/panels' ) );
        app.module( 'module:modal', require( './modules/modal/modal' ) );
        app.module( 'module:dialog', require( './modules/dialog/dialog' ) );
        app.module( 'module:notification', require( './modules/notifications/notifications' ) );
        
        // Initialize preview
        require( './preview' );
        
        $doc.on( 'heartbeat-send', function( e, data ) {
            data['tailor_post_id'] = window.post.id;
        } );

        wp.heartbeat.interval( 60 );
        wp.heartbeat.connectNow();

        $win

            /**
             * Warns the user if they attempt to navigate away from the page without saving changes.
             *
             * @since 1.0.0
             */
            .on( 'beforeunload.tailor', function( e ) {
                if ( app.hasUnsavedChanges() ) {
                    return window._l10n.confirmPage;
                }
            } )

            /**
             * Unlocks the post when the user navigates away from the page.
             *
             * @since 1.0.0
             */
            .on( 'unload.tailor', function( e ) {
                window.ajax.send( 'tailor_unlock_post', {
                    data : {
                        post_id : options.postId,
                        nonce : options.nonces.unlockPost
                    }
                } );
            } );
    } );

    $doc.ready( function() {
        
        // Start the app
        app.start( {
            postId : window.post.id,
            nonces : window._nonces,
            l10n : window._l10n || [],
            library : window._library || [],
            templates : window._templates || [],
            panels : window._panels || [],
            sections : window._sections || [],
            settings : window._settings || [],
            controls : window._controls || []
        } );

        /**
         * Fires when the sidebar is initialized.
         *
         * @since 1.0.0
         *
         * @param app
         */
        app.channel.trigger( 'sidebar:initialize', app );
    } );
    
} ( window, Backbone.$ ) );