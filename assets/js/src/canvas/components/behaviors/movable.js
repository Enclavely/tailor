var MovableBehaviors = Marionette.Behavior.extend( {

	modelEvents : {
		'add:child' : 'addChild',
		'remove:child' : 'removeChild',
		'insert:before' : 'insertBefore',
		'insert:after' : 'insertAfter',
		'insert' : 'insert',
		'append' : 'append',
		'template' : 'template'
	},

	template: function( id ) {
		var element = this.view;
		var model = element.model;
		model.createTemplate( id, element );
	},

    /**
     * Triggers an "append" event on the target model.
     *
     * @since 1.0.0
     *
     * @param model
     */
    insert : function( model ) {
        model.trigger( 'append', this.view );
    },

    /**
     * Triggers an event to add the element to its new parent container.
     *
     * @since 1.0.0
     */
	addChild : function() {
		this.view.$el.trigger( 'container:add', this.view );
	},

    /**
     * Triggers an event to remove the element from its container.
     *
     * @since 1.0.0
     */
	removeChild : function() {
		this.view.$el.trigger( 'container:remove', this.view );
    },

    /**
     * Inserts the view element before the target view element.
     *
     * @since 1.0.0
     *
     * @param view
     */
	insertBefore : function( view ) {
		this.view.$el.insertBefore( view.$el );
	},

    /**
     * Inserts the view element after the target view element.
     *
     * @since 1.0.0
     *
     * @param view
     */
	insertAfter : function( view ) {
		this.view.$el.insertAfter( view.$el );
	},

	/**
	 * Triggers an event on the element before it is added to a new container.
	 *
	 * @since 1.0.0
	 *
	 * @param view
	 */
	triggerEvent : function( view ) {

		/**
		 * Fires before the element is added to a new container.
		 *
		 * @since 1.0.0
		 */
		view.$el.trigger( 'before:element:child:add', this.view );
	},

    /**
     * Appends the view element to the target view element.
     *
     * @since 1.0.0
     *
     * @param view
     */
	append : function( view ) {
        var $el = view.$childViewContainer ? view.$childViewContainer : view.$el;
		this.view.$el.appendTo( $el );
	}

} );

module.exports = MovableBehaviors;