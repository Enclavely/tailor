var ContainerView = require( './../element-container' ),
	CarouselNavigationView = require( './navigation/carousel-navigation' ),
	CarouselView;

CarouselView = ContainerView.extend( {

    childViewContainer : '.tailor-carousel__wrap',

    events : {
        'element:change:order' : 'onReorderElement'
    },

	/**
	 * Handles the reordering of carousel items.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 * @param id
	 * @param newIndex
	 * @param oldIndex
	 */
    onReorderElement : function( e, id, newIndex, oldIndex ) {
        if ( newIndex - oldIndex < 0 ) {
            this.children.each( function( view ) {
                if ( view._index >= newIndex && view._index <= oldIndex ) {
                    if ( view._index == oldIndex ) {
                        view._index = newIndex;
                    }
                    else {
                        view._index++;
                    }
                    view.model.set( 'order', view._index );
                }
            }, this );
        }
        else {
            this.children.each( function( view ) {
                if ( view._index >= oldIndex && view._index <= newIndex ) {
                    if ( view._index == oldIndex ) {
                        view._index = newIndex;
                    }
                    else {
                        view._index--;
                    }
                    view.model.set( 'order', view._index );
                }
            }, this );
        }

        this.model.collection.sort();
    },

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