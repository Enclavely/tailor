
var SettingCollection = require( '../../entities/collections/settings' ),
    ControlCollection = require( '../../entities/collections/controls' ),
    SettingsModule;

SettingsModule = Marionette.Module.extend( {

    onBeforeStart : function( options ) {
        var module = this;

        module.settings = {
            sidebar : new SettingCollection( options.settings )
        };
        
        module.controls = {
            sidebar : new ControlCollection( options.controls, {
                silent : false,
                settings : module.settings['sidebar']
            } )
        };
        
        var api = {

            /**
             * Returns the collection of controls for a given element.
             *
             * If no element model is is provided, the sidebar control collection is returned.
             *
             * @since 1.0.0
             *
             * @param model
             * @returns {*}
             */
            getControls : function( model ) {

                // Return the sidebar control collection if no element is provided
                if ( ! model ) {
                    return module.controls['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.controls.hasOwnProperty( cid ) ) {
                    var itemDefinition = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var controls = itemDefinition.get( 'controls' ) || [];
                    var settings = api.getSettings( model );

                    module.controls[ cid ] = new ControlCollection( controls, {
                        silent : false,
                        settings : settings
                    } );
                }

                // Return the element control collection
                return module.controls[ cid ];
            },

            /**
             * Returns the collection of settings for a given element.
             *
             * If no element model is is provided, the sidebar settings collection is returned.
             *
             * @since 1.0.0
             *
             * @param model
             * @returns {*}
             */
            getSettings : function( model ) {

                // Return the sidebar control collection if no element is provided
                if ( ! model ) {
                    return module.settings['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.settings.hasOwnProperty( cid ) ) {
                    var itemDefinition = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var settings = itemDefinition.get( 'settings' ) || [];

                    module.settings[ cid ] = new SettingCollection( settings, { element : model } );
                }

                module.settings[ cid ].load();

                // Return the element control collection
                return module.settings[ cid ];
            }
        };

        app.channel.reply( 'sidebar:controls', api.getControls );
        app.channel.reply( 'sidebar:settings', api.getSettings );

        this.listenTo( module.settings['sidebar'], 'change', this.onChangeSetting );
    },

    /**
     * Initializes the module.
     */
    onStart : function() {

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:settings:ready', this );
    },

    /**
     * Triggers an event on the app communication channel when a sidebar setting changes.
     *
     * @since 1.0.0
     *
     * @param setting
     */
    onChangeSetting : function( setting ) {

        /**
         * Fires when a sidebar setting changes.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'sidebar:setting:change', setting );
    }

} );

module.exports = SettingsModule;