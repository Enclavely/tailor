var CanvasRegion = Backbone.Marionette.Region.extend( {

	/**
     * Initialize the canvas region.
     * 
     * @since 1.0.0
     */
    initialize : function() {
        this.listenTo( app.channel, 'canvas:dragstart', this.onDragStart );
        this.listenTo( app.channel, 'canvas:dragend', this.onDragEnd );
    },

    /**
     * Adds a class name to the canvas when dragging begins.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onDragStart : function( view, region, options ) {
        this.el.classList.add( 'is-active' );
    },

    /**
     * Removes a class name from the canvas when dragging ends.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onDragEnd : function( view, region, options ) {
        this.el.classList.remove( 'is-active' );
    }

} );

module.exports = CanvasRegion;