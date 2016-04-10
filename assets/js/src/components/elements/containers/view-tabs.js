/**
 * Tailor.Views.TailorTabs
 *
 * Tabs element view.
 *
 * @class
 */
var ContainerView = require( './../view-container' ),
	TabsView;

TabsView = ContainerView.extend( {

    ui : {
        navigation : '.tailor-tabs__navigation'
    },

    childViewContainer : '.tailor-tabs__content',

    events : {
        'element:change:order' : 'onReorderElement'
    },

	/**
	 * Handles the reordering of tabs.
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
        var NavigationView = require( './navigation/navigation-tabs' );

        this.navigation = new NavigationView( {
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