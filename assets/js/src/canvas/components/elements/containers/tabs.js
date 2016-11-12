var ContainerView = require( './../element-container' ), 
	TabsNavigationView = require( './navigation/tabs-navigation' ),
	TabsView;

TabsView = ContainerView.extend( {

    ui : {
        navigation : '.tailor-tabs__navigation'
    },

	/**
	 * Destroys the tabs navigation before the template is refreshed.
	 *
	 * @since 1.0.0
	 */
    onBeforeRenderTemplate : function() {
        if ( this.navigation ) {
            this.navigation.triggerMethod( 'destroy' );
        }
    },

	/**
	 * Inserts the tabs navigation into the DOM.
	 *
	 * @since 1.0.0
	 */
    onRenderTemplate : function() {
        this.navigation = new TabsNavigationView( {
            el : this.ui.navigation,
            model : this.model,
            collection : this.collection,
            sort : false
        } );

        this.navigation.render();
    },

	/**
	 * Triggers events when a child element template is refreshed.
	 *
	 * @since 1.0.0
	 *
	 * @param childView
	 */
	childRefreshed : function( childView ) {
		childView.el.id = childView.model.cid;
		childView.el.classList.add( 'is-active' );

		this.triggerAll( 'element:child:refresh', childView );
	},

    /**
     * Destroys the tabs navigation before the tabs element is destroyed.
     *
     * @since 1.0.0
     */
    onBeforeDestroy : function() {
	    this.triggerAll( 'before:element:destroy', this );
        this.navigation.triggerMethod( 'destroy' );
    }

} );

module.exports = TabsView;