( function( window, $ ) {
    
    'use strict';
    
    var $doc = $( document );
    var $win = $( window );
    
    // Include utilities
    require( './shared/utility/polyfills/classlist' );
    require( './shared/utility/polyfills/raf' );
    require( './shared/utility/polyfills/transitions' );
    require( './shared/utility/ajax' );

    // Include components
    Marionette.Behaviors.behaviorsLookup = function() {
        return {
            Resizable:          require( './sidebar/components/behaviors/resizable' ),
            Panel:              require( './sidebar/components/behaviors/panel' ),
            Draggable:          require( './shared/components/behaviors/draggable' )
        };
    };
    
    // Create the app
    var App = require( './sidebar/app' );
    window.app = new App();

    // Create the Tailor object
    window.Tailor = {
        Api : {
            Setting :   require( './shared/components/api/setting' )
        },
        Notify :    require( './shared/utility/notify' ),
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
                actual = actual || '';
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
            regionClass : require( './sidebar/modules/dialog/dialog-region' )
        },
        modal : {
            selector : "#tailor-modal-container",
            regionClass : require( './sidebar/modules/modal/modal-region' )
        }
    } );

    // Load models
    Tailor.Models.Container =           require( './sidebar/entities/models/element-container' );
    Tailor.Models.Wrapper =             require( './sidebar/entities/models/element-wrapper' );
    Tailor.Models.Section =             require( './sidebar/entities/models/element-wrapper' ); // Sections are just special wrappers
    Tailor.Models.Default =             require( './sidebar/entities/models/element' );

    // Load views
    Tailor.Panels.Default =             require( './sidebar/components/panels/panel-default' );
    Tailor.Panels.Empty =               require( './sidebar/components/panels/panel-empty' );
    Tailor.Sections.Default =           require( './sidebar/components/sections/section-default' );
    Tailor.Controls.ButtonGroup =       require( './sidebar/components/controls/button-group' );
    Tailor.Controls.Checkbox =          require( './sidebar/components/controls/checkbox' );
    Tailor.Controls.Code =              require( './sidebar/components/controls/code' );
    Tailor.Controls.Colorpicker =       require( './sidebar/components/controls/colorpicker' );
    Tailor.Controls.Editor =            require( './sidebar/components/controls/editor' );
    Tailor.Controls.Gallery =           require( './sidebar/components/controls/gallery' );
    Tailor.Controls.Icon =              require( './sidebar/components/controls/icon' );
    Tailor.Controls.Image =             require( './sidebar/components/controls/image' );
    Tailor.Controls.InputGroup =        require( './sidebar/components/controls/input-group' );
    Tailor.Controls.Link =              require( './sidebar/components/controls/link' );
    Tailor.Controls.List =              require( './sidebar/components/controls/list' );
    Tailor.Controls.Radio =             require( './sidebar/components/controls/radio' );
    Tailor.Controls.Range =             require( './sidebar/components/controls/range' );
    Tailor.Controls.Select =            require( './sidebar/components/controls/select' );
    Tailor.Controls.SelectMulti =       require( './sidebar/components/controls/select-multi' );
    Tailor.Controls.Style =             require( './sidebar/components/controls/style' );
    Tailor.Controls.Switch =            require( './sidebar/components/controls/switch' );
    Tailor.Controls.Text =              require( './sidebar/components/controls/text' );
    Tailor.Controls.Textarea =          require( './sidebar/components/controls/textarea' );
    Tailor.Controls.Video =             require( './sidebar/components/controls/video' );
    Tailor.Controls.WidgetForm =        require( './sidebar/components/controls/widget-form' );
    Tailor.Controls.Default =           require( './sidebar/components/controls/text' );
    Tailor.Controls.Abstract =          require( './sidebar/components/controls/abstract-control' );

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

    // Load modules
    app.module( 'module:library', require( './sidebar/modules/library/library' ) );
    app.module( 'module:templates', require( './sidebar/modules/templates/templates' ) );
    app.module( 'module:settings', require( './sidebar/modules/settings/settings' ) );
    app.module( 'module:history', require( './sidebar/modules/history/history' ) );
    app.module( 'module:sections', require( './sidebar/modules/sections/sections' ) );
    app.module( 'module:panels', require( './sidebar/modules/panels/panels' ) );
    app.module( 'module:modal', require( './sidebar/modules/modal/modal' ) );
    app.module( 'module:dialog', require( './sidebar/modules/dialog/dialog' ) );
    app.module( 'module:notification', require( './sidebar/modules/notifications/notifications' ) );
    app.module( 'module:devicePreview', require( './sidebar/modules/device-preview/device-preview' ) );

    // Initialize preview
    require( './sidebar/preview' );
    
    app.on( 'before:start', function( options ) {

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

    $( function() {
        
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
    } );
    
} ( window, Backbone.$ ) );