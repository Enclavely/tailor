var ContainerBehaviors = Marionette.Behavior.extend( {

    events : {
		'container:add' : 'addChildView',
		'container:remove' : 'removeChildView'
	},

	modelEvents : {
		'container:collapse' : 'onCollapse'
	},

    /**
     * Adds a child view to the container.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
	addChildView : function( e, childView ) {
        if ( childView === this.view ) {
			return;
		}

        var $el = this.view.$childViewContainer ? this.view.$childViewContainer : this.$el;
        var index = $el.children().filter( ':not( .tailor-column__helper )' ).index( childView.$el );

		this.view._updateIndices( childView, true, index );
		this.view.proxyChildEvents( childView );
		this.view.children.add( childView, childView.model.get( 'order' ) );

	    childView._parent = this;

		//console.log( '\n Added view ' + childView.model.get( 'tag' ) + ' to ' + this.view.model.get( 'tag' ) );

	    /**
	     * Fires after a child view is added.
	     *
	     * @since 1.0.0
	     */
	    this.view.triggerAll( 'element:child:add', this.view, false );

	    e.stopPropagation();
    },

    /**
     * Removes a child view from the container.
     *
     * @since 1.0.0
     *
     * @param e
     * @param childView
     */
    removeChildView : function( e, childView ) {
		if ( childView === this.view ) {
			return;
		}

		this.view.stopListening( childView );
		this.view.children.remove( childView, childView.model.get( 'order' ) );
		this.view._updateIndices( childView, false );

		delete childView._parent;

	    //console.log( '\n Removed view ' + childView.model.get( 'tag' ) + ' from ' + this.view.model.get( 'tag' ) );

	    childView.$el.detach();

	    /**
	     * Fires after a child view is removed.
	     *
	     * @since 1.0.0
	     */
	    this.view.triggerAll( 'element:child:remove', this.view, false );

	    e.stopPropagation();
	},

    /**
     * Collapses a container.
     *
     * @since 1.0.0
     *
     * @param model
     * @param children
     */
	onCollapse : function( model, children ) {
	    var containerView = this.view;
	    var index = containerView.$el.index();
	    var childView;
	    var siblings;

	    //console.log( '\n Collapsing ' + containerView.model.get( 'tag' ) + ' ' + containerView.model.get( 'id' ) );

	    _.each( children, function( child ) {
		    childView = this.view.children.findByModel( child );
		    siblings = containerView.el.parentNode.children;
		    childView.$el.insertAfter( siblings[ index ] );
		    index ++;

		    containerView.stopListening( childView );
		    containerView.children.remove( childView );
		    containerView._updateIndices( childView, false );

		    delete childView._parent;

		    /**
		     * Triggers an event to add the view to its new container.
		     *
		     * @since 1.0.0
		     */
		    childView.$el.trigger( 'container:add', childView );
	    }, this );

	    /**
	     * Triggers an event to remove the view from its container.
	     *
	     * @since 1.0.0
	     */
	    containerView.$el.trigger( 'container:remove', containerView );

	    containerView.destroy();

		//console.log( '\n Collapsed and destroyed view ' + containerView.model.get( 'tag' ) + ' ' + containerView.model.get( 'id' ) );
	}

} );

module.exports = ContainerBehaviors;