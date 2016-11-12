var ContainerView = require( './../element-container' ),
	CarouselNavigationView = require( './navigation/carousel-navigation' ),
	CarouselView;

CarouselView = ContainerView.extend( {
	
	/**
	 * Destroys the carousel navigation dots before the template is refreshed.
	 *
	 * @since 1.0.0
	 */
    onBeforeRenderTemplate : function() {
        if ( this.navigation ) {
            this.navigation.triggerMethod( 'destroy' );
        }
    },

	/**
	 * Inserts the carousel navigation dots into the DOM.
	 *
	 * @since 1.0.0
	 */
    onRenderTemplate : function() {
        this.navigation = new CarouselNavigationView( {
            model : this.model,
            collection : this.collection,
            sort : false
        } );

		this.$el.append( this.navigation.render().el );
    },

	/**
	 * Destroys the carousel navigation dots before the carousel is destroyed.
	 *
	 * @since 1.0.0
	 */
    onBeforeDestroy : function() {
		this.triggerAll( 'before:element:destroy', this );
        this.navigation.triggerMethod( 'destroy' );
    }

} );

module.exports = CarouselView;