var GuideView = require( './show/guide' ),
    SelectorView = require( './show/select-menu' ),
    ToolsModule;

ToolsModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
        var guide = new GuideView( { el : '#guide' } ).render();
        var api = {

            /**
             * Shows and positions the insertion guide.
             *
             * @since 1.0.0
             *
             * @param view
             * @param drop
             */
            positionGuide : function( view, drop ) {
                guide.position( view, drop );
            },

            /**
             * Displays the element selector.
             *
             * @since 1.0.0
             *
             * @param view
             */
            selectElement : function( view ) {
                app.selectRegion.show(
                    new SelectorView( {
                        model : view.model,
                        collection : app.channel.request( 'canvas:elements' ),
                        view : view
                    } )
                );
            },

            /**
             * Resets the canvas.
             *
             * @since 1.0.0
             */
            resetGuide : function() {
                guide.reset();

                app.selectRegion.empty();
            },

            /**
             * Returns the currently selected element, if one exists.
             *
             * @since 1.0.0
             *
             * @returns {*}
             */
            getSelectedElement : function() {
                var select = app.selectRegion.currentView;
                return select ? select.model : null;
            }
        };

        this.listenTo( app.channel, 'canvas:guide', api.positionGuide );
        this.listenTo( app.channel, 'canvas:select', api.selectElement );
        this.listenTo( app.channel, 'canvas:reset', api.resetGuide );
        this.listenTo( app.channel, 'element:refresh:template', api.resetGuide );

        app.channel.reply( 'canvas:element:selected', api.getSelectedElement );

        /**
         * Fires when the module is initialized.
         *
         * @since 1.5.0
         *
         * @param this
         */
        app.channel.trigger( 'module:tools:ready', this );
    }

} );

module.exports = ToolsModule;