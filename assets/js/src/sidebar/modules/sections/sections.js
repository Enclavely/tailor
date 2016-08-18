
var SectionCollection = require( '../../entities/collections/sections' ),
    DefaultMenuItem = require( './show/default-menu-item' ),
    SectionsModule;

Tailor.Items.Default = DefaultMenuItem;

SectionsModule = Marionette.Module.extend( {

	onBeforeStart : function( options ) {
        var module = this;

        module.collection = {
            sidebar : new SectionCollection( options.sections )
        };

		var api = {

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
                    return module.collection['sidebar'];
                }

                var cid = model.cid;

                // Create the element control collection if it doesn't already exist
                if ( ! module.collection.hasOwnProperty( cid ) ) {
                    var itemDefinition = app.channel.request( 'sidebar:library', model.get( 'tag' ) );
                    var sections = itemDefinition.get( 'sections' ) || [];
                    module.collection[ cid ] = new SectionCollection( sections );
                }

                // Return the element control collection
                return module.collection[ cid ];
            }
		};

        app.channel.reply( 'sidebar:sections sidebar:default', api.getSections );
    },

    /**
     * Initializes the module.
     *
     * @since 1.5.0
     */
    onStart: function() {

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:sections:ready', this );
    }

} );

module.exports = SectionsModule;