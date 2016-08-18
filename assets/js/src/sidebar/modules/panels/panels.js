var PanelCollection = require( '../../entities/collections/panels' ),
    PanelLayoutView = require( './show/layout' ),
    PanelMenuItem = require( './show/panel-menu-item' ),
    PanelsModule;

Tailor.Items.Panels = PanelMenuItem;

PanelsModule = Marionette.Module.extend( {

    onBeforeStart : function( options ) {
        var module = this;

        module.collection = new PanelCollection( options.panels );

        var api = {

            /**
             * Returns a given panel if an ID is provided, otherwise the panel collection.
             *
             * @since 1.0.0
             *
             * @param id
             * @returns {*}
             */
            getPanels : function( id ) {
                if ( id ) {
                    return module.collection.findWhere( { id : id } )
                }
                return module.collection;
            }
        };

        app.channel.reply( 'sidebar:panels', api.getPanels );
    },

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onStart : function() {
        
        app.content.show( new PanelLayoutView( {
            panels :    app.channel.request( 'sidebar:panels' ),
            sections :  app.channel.request( 'sidebar:sections' ),
            controls :  app.channel.request( 'sidebar:controls' ),
            settings :  app.channel.request( 'sidebar:settings' )
        } ) );

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:panels:ready', this );
    }

} );

module.exports = PanelsModule;
