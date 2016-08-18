var ModalRegion = Backbone.Marionette.Region.extend( {

    /**
     * Displays the modal container and sets the initial modal window position.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onShow : function( view, region, options ) {
        this.el.classList.add( 'is-visible' );

        var rect = this.el.getBoundingClientRect();
        var width = this.el.style.width ? this.el.style.width : rect.width;
        this.el.style.width = width + 'px';

        if ( ! this.el.style.height ) {
            this.el.style.height = ( window.innerHeight - 40 ) + 'px';
        }

        if ( ! this.el.style.top  ) {
            this.el.style.top = '20px';
        }

        if ( ! this.el.style.left ) {
            if ( document.documentElement.dir && 'rtl' == document.documentElement.dir ) {
                this.el.style.left = 20 + 'px';
            }
            else {
                this.el.style.left = window.innerWidth - ( rect.width + 20 ) + 'px';
            }
        }

        // Update the element class name
        this.updateClassName( width );

        // Listen to resize events on the modal view
        this.listenTo( view, 'modal:resize', this.onResize );
    },

    /**
     * Responds to changes in the modal width and/or height.
     *
     * @since 1.0.0
     *
     * @param width
     * @param height
     */
    onResize : function( width, height ) {
        this.updateClassName( width );
    },

    /**
     * Updates the container class name based on the width.
     *
     * @since 1.0.0
     *
     * @param width
     */
    updateClassName : function( width ) {
        this.$el
            .toggleClass( 'is-x-small', width < 480 )
            .toggleClass( 'is-small', ( 481 < width ) && ( width < 767 ) )
            .toggleClass( 'is-medium', ( 768 < width ) && ( width < 979 ) )
            .toggleClass( 'is-large', ( 980 < width ) && ( width < 1199 ) )
            .toggleClass( 'is-x-large', width >= 1200 );
    },

    /**
     * Hides the modal container.
     *
     * @since 1.0.0
     *
     * @param view
     * @param region
     * @param options
     */
    onEmpty : function( view, region, options ) {
        this.el.classList.remove( 'is-visible' );
	    this.stopListening( view, 'modal:resize', this.onResize );
    }

} );

module.exports = ModalRegion;