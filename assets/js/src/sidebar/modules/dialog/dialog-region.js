var DialogRegion = Backbone.Marionette.Region.extend( {

    /**
     * Initializes the dialog region.
     *
     * @since 1.0.0
     */
    initialize : function() {
        this.$overlay = jQuery( '<div id="overlay"></div>' );
    },

    /**
     * Shows the dialog window and adds necessary event listeners.
     *
     * @since 1.0.0
     */
    onShow : function( view, region, options ) {
        this.el.classList.add( 'is-visible' );
        this.$overlay
            .on( 'click', jQuery.proxy( this.empty, this ) )
            .appendTo( 'body' );
    },

    /**
     * Hides the dialog window and removes event listeners.
     *
     * @since 1.0.0
     */
    onEmpty : function( view, region, options ) {
        this.el.classList.remove( 'is-visible' );
        this.$overlay
            .off()
            .detach();
    }

} );

module.exports = DialogRegion;
