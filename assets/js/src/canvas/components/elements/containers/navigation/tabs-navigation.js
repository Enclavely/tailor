module.exports = Marionette.CollectionView.extend( {

	childView : require( './tabs-navigation-item' ),

    events : {
        'dragstart' : 'onDragStart'
    },

    onDragStart : function( e ) {

	    /**
	     * Fires when the dragging of a tab navigation item begins.
	     *
	     * @since 1.0.0
	     */
        app.channel.trigger( 'canvas:reset' );
        e.stopPropagation();
    },

    /**
     * Provides the element collection to all child elements.
     *
     * @since 1.0.0
     *
     * @param child
     * @param ChildViewClass
     * @param childViewOptions
     * @returns {*}
     */
    buildChildView : function( child, ChildViewClass, childViewOptions ) {
        var options = _.extend({
            model : child,
            collection : this.collection
        }, childViewOptions );

        return new ChildViewClass( options );
    },

    /**
     * Filters the element collection so that only children of this element are displayed.
     *
     * @since 1.0.0
     *
     * @param child
     * @param index
     * @param collection
     * @returns {boolean}
     */
    filter : function( child, index, collection ) {
        return child.get( 'parent' ) === this.model.get( 'id' );
    },

    /**
     * Enable sorting behavior for the tabs.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var view = this;
        this.sortable = new Sortable( view.el, {
            draggable : 'li',
            animation : 150,

            /**
             * Updates the order of the tabs when they are repositioned.
             *
             * @since 1.0.0
             */
            onUpdate : function( e ) {
	            var cid = e.item.getAttribute( 'data-id' );

	            /**
	             * Fires before the element is reordered.
	             * 
	             * @since 1.7.5
	             */
	            view.$el.trigger( 'before:navigation:reorder', [ cid, e.newIndex, e.oldIndex ] );

	            /**
	             * Fires when the element is reordered.
	             *
	             * @since 1.7.5
	             */
	            view.$el.trigger( 'navigation:reorder', [ cid, e.newIndex, e.oldIndex ] );
	            
	            /**
	             * Fires when the element is reordered.
	             *
	             * @since 1.7.5
	             */
	            app.channel.trigger( 'navigation:reorder', view.model );
            }

        } );
    },

	/**
	 * Cleans up the Sortable instance when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
    onBeforeDestroy : function() {
        this.sortable.destroy();
    }

} );