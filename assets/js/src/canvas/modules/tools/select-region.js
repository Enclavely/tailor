var SelectRegion = Backbone.Marionette.Region.extend( {

    /**
     * Adds a class name to the underlying view when selected.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onShow : function( view, region, options ) {
        view._view.el.classList.add( 'is-selected' );
    },

    /**
     * Removes a class name from the underlying view when deselected.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onEmpty : function( view, region, options ) {
        view._view.el.classList.remove( 'is-selected' );
    }

} );

module.exports = SelectRegion;