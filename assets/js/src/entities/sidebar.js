Tailor.Collections = Tailor.Collections || {};

Tailor.Collections.Library = require( './collections/library' );
Tailor.Collections.Template = require( './collections/templates' );
Tailor.Collections.Panel = require( './collections/panels' );
Tailor.Collections.Section = require( './collections/sections' );
Tailor.Collections.Setting = require( './collections/settings' );
Tailor.Collections.Control = require( './collections/controls' );

module.exports = Marionette.Module.extend( {

	onBeforeStart : function( options ) {
        var module = this;
        var library = new Tailor.Collections.Library( options.library );
        var templates = new Tailor.Collections.Template( options.templates );

        module.panels = new Tailor.Collections.Panel( options.panels );
        module.sections = { sidebar : new Tailor.Collections.Section( options.sections ) };
        module.settings = { sidebar : new Tailor.Collections.Setting( options.settings ) };
        module.controls = {
            sidebar : new Tailor.Collections.Control( options.controls, {
                silent : false,
                settings : module.settings['sidebar']
            } )
        };

		var api = {

            /**
             * Returns a given library item if a tag is provided, otherwise the library.
             *
             * @since 1.0.0
             *
             * @param tag
             * @returns {*}
             */
            getLibraryItems : function( tag ) {
                return tag ? library.findWhere( { tag : tag } ) : library;
            },

            /**
             * Returns the template item collection.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            getTemplates : function() {
                return templates;
            },

            /**
             * Returns a given panel if an ID is provided, otherwise the panel collection.
             *
             * @since 1.0.0
             *
             * @param id
             * @returns {*}
             */
            getPanels : function( id ) {
                return id ? module.panels.findWhere( { id : id } ) : module.panels;
            },

            /**
             * Returns the collection of sections for a given element.
             *
             * If no element model is is provided, the sidebar sections collection is returned.
             *
             * @since 1.0.0
             *
             * @param model
             * @returns {*}
             */
            getSections : function( model ) {

                // Return the sidebar section collection if no element is provided
                if ( ! model ) {
                    return module.sections['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.sections.hasOwnProperty( cid ) ) {
                    var libraryItem = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var sections = libraryItem.get( 'sections' ) || [];

                    module.sections[ cid ] = new Tailor.Collections.Section( sections );
                }

                // Return the element control collection
                return module.sections[ cid ];
            },

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
                    var libraryItem = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var controls = libraryItem.get( 'controls' ) || [];
                    var settings = api.getSettings( model );
                    var options = {
                        silent : false,
                        settings : settings
                    };

                    module.controls[ cid ] = new Tailor.Collections.Control( controls, options );
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
                    var libraryItem = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var settings = libraryItem.get( 'settings' ) || [];

                    module.settings[ cid ] = new Tailor.Collections.Setting( settings, { element : model } );
                }

                module.settings[ cid ].load();

                // Return the element control collection
                return module.settings[ cid ];
            }
		};

        app.channel.reply( 'sidebar:library', api.getLibraryItems );
        app.channel.reply( 'sidebar:templates', api.getTemplates );
        app.channel.reply( 'sidebar:panels', api.getPanels );
        app.channel.reply( 'sidebar:sections sidebar:default', api.getSections );
        app.channel.reply( 'sidebar:controls', api.getControls );
        app.channel.reply( 'sidebar:settings', api.getSettings );

        this.listenTo( module.settings['sidebar'], 'change', this.onChangeSetting );
	},

    /**
     * Triggers an event on the applcation communication channel when a sidebar setting changes.
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