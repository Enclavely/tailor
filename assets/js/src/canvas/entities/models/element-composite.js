var BaseModel = require( './element-base' ),
    CompositeModel;

CompositeModel = BaseModel.extend( {

    /**
     * Clones the element and its child elements.
     *
     * @since 1.0.0
     *
     * @param sourceView
     * @param parent
     * @param index
     */
    cloneContainer : function( sourceView, parent, index ) {
        var collection = this.collection;
        var clone = sourceView.model.clone();

        clone.set( 'id', clone.cid );
        clone.set( 'parent', parent );
        clone.set( 'order', index );

        this.copy( clone.cid, sourceView );

        var clonedChildren = this.cloneChildren( sourceView.children, clone, [] );

        collection.add( clonedChildren, { silent : true } );
        collection.add( clone );

	    /**
	     * Fires after the element has been copied.
	     *
	     * @since 1.0.0
	     */
        sourceView.triggerMethod( 'element:refresh' );
    },

    /**
     * Clones all children of a given element.
     *
     * @since 1.0.0
     *
     * @param childViews
     * @param parent
     * @param clones
     * @returns {*}
     */
    cloneChildren : function( childViews, parent, clones ) {
        if ( childViews.length ) {
            childViews.each( function( childView ) {
                var clone = childView.model.clone();
                clone.set( 'id', clone.cid );
                clone.set( 'parent', parent.get( 'id' ) );

                clone.copy( clone.cid, childView );
                clones.push( clone );

                if ( childView.children ) {
                    this.cloneChildren( childView.children, clone, clones );
                }

            }, this );
        }

        return clones;
    },

    /**
     * Copies the source element and inserts it before the target element.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyBefore : function( targetView, sourceView ) {
        this.cloneContainer( sourceView, targetView.model.get( 'parent' ), targetView.model.get( 'order' ) - 1 );
    },

    /**
     * Copies the source element and inserts it after the target element.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyAfter : function( targetView, sourceView ) {
        this.cloneContainer( sourceView, targetView.model.get( 'parent' ), targetView.model.get( 'order' ) );
    },

    /**
     * Copies the source element and inserts it before the target element in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyColumnBefore : function( targetView, sourceView ) {
        var parent = targetView.model.get( 'parent' );

        if ( 'tailor_column' === targetView.model.get( 'tag' ) ) {
            var column = this.collection.createColumn( parent, targetView.model.get( 'order' ) - 1 );
            this.cloneContainer( sourceView, column.get( 'id' ), 0 );
        }
        else {
            var columns = this.collection.createRow( parent, targetView.model.get( 'order' ) );
            this.collection.insertChild( targetView.model, _.last( columns ) );
            this.cloneContainer( sourceView, _.first( columns ).get( 'id' ), 0 );
        }

    },

    /**
     * Copies the source element and inserts it after the target element in a row/column layout.
     *
     * @since 1.0.0
     *
     * @param targetView
     * @param sourceView
     */
    copyColumnAfter : function( targetView, sourceView ) {
        var parent = targetView.model.get( 'parent' );

        if ( 'tailor_column' === targetView.model.get( 'tag' ) ) {
            var column = this.collection.createColumn( parent, targetView.model.get( 'order' ) );
            this.cloneContainer( sourceView, column.get( 'id' ), 0 );
        }
        else {
            var columns = this.collection.createRow( parent, targetView.model.get( 'order' ) );
            this.collection.insertChild( targetView.model, _.first( columns ) );
            this.cloneContainer( sourceView, _.last( columns ).get( 'id' ), 0 );
        }
    },

	/**
	 * Creates a new element template for use with a copied element.
	 *
	 * @since 1.7.9
	 *
	 * @param id
	 * @param view
	 */
	copy: function( id, view ) {
		this.beforeCopyElement( id, view );
		this.createTemplate( id, view );
		this.afterCopyElement( id, view );
	},
	
	/**
	 * Creates a new template based on the element.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	createTemplate : function( id, view ) {
		var isEditing =  view.el.classList.contains( 'is-editing' );
		view.$el.removeClass( 'is-dragging is-hovering is-selected is-editing' );
		
		var $childViewContainer = view.getChildViewContainer( view );
		var $children = $childViewContainer.contents().detach();

		this.appendTemplate( id, view );

		$childViewContainer.append( $children );
		
		if ( isEditing ) {
			view.el.classList.add( 'is-editing' );
		}
	}

} );

module.exports = CompositeModel;