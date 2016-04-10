module.exports = Marionette.CollectionView.extend( {

    tagName : 'ul',

    className : 'slick-dots',

	childView : require( './navigation-carousel-item' ),

    events : {
        'dragstart' : 'onDragStart'
    },

	/**
     * Resets the canvas when dragging of a carousel item starts.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onDragStart : function( e ) {

		/**
		 * Fires when dragging of a carousel navigation item begins.
		 *
		 * @since 1.0.0
		 */
		app.channel.trigger( 'canvas:reset' );
        e.stopPropagation();
    },

	/**
     * Initializes the SortableJS plugin when the elememt is rendered.
     *
     * SortableJS is used to allow reordering of carousel items.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var navigation = this;
        this.sortable = new Sortable( navigation.el, {
            draggable : 'li',
            animation : 150,

	        /**
	         * Update the order of the carousel items when they are repositioned.
	         *
	         * @since 1.0.0
	         */
            onUpdate : function( e ) {
                var $container = navigation.$el.parent();

                /**
                 * Fires before a carousel item is reordered.
                 *
                 * @since 1.0.0
                 */
                $container.trigger( 'before:element:change:order' );

	            /**
                 * Fires when a carousel item is reordered.
                 *
                 * @since 1.0.0
                 */
                $container.trigger( 'element:change:order', [ e.item.getAttribute( 'data-id' ), e.newIndex, e.oldIndex ] );

                /**
                 * Fires when a carousel item is reordered.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'element:change:order', navigation.model );
            }
        } );
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
	 * Cleans up the Sortable instance when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onBeforeDestroy : function() {
		this.sortable.destroy();
	}

} );