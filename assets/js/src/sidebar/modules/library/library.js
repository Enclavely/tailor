
var LibraryCollection = require( '../../entities/collections/library' ),
    LibraryMenuItem = require( './show/library-menu-item' ),
    LibraryModule;

Tailor.Items.Library = LibraryMenuItem;

LibraryModule = Marionette.Module.extend( {

	onBeforeStart : function( options ) {
        var collection = new LibraryCollection( options.library );
        var api = {

            /**
             * Returns a given library item if a tag is provided, otherwise the library.
             *
             * @since 1.0.0
             *
             * @param tag
             * @returns {*}
             */
            getLibraryItem : function ( tag ) {
                if ( tag ) {
                    return collection.findWhere( { tag : tag } );
                }
                return collection;
            }
        };

        app.channel.reply( 'sidebar:library', api.getLibraryItem );
    },

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onStart : function() {

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:library:ready', this );
    }
    
} );

module.exports = LibraryModule;