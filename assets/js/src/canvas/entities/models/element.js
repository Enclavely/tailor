var BaseModel = require( './element-base' ),
	ElementModel;

ElementModel = BaseModel.extend( {

	/**
	 * Returns true if this element is a valid drop target.
	 *
	 * @since 1.0.0
	 *
	 * @param that The element being dragged
	 * @param region The region of this element that the other element is over
	 * @param threshold The distance to the closest edge, if applicable
	 */
	validTarget : function( that, region, threshold ) {

		if ( threshold < 20 ) {
			return false;
		}
		
		if ( 'child' == that.get( 'type' ) || _.contains( [ 'tailor_section', 'tailor_column' ], that.get( 'tag' ) ) || 'center' == region ) {
			return false;
		}

		var parent = this.collection.getParent( this );
		if ( 'tailor_row' == that.get( 'tag' ) ) {
			return 'tailor_section' == parent.get( 'tag' ) && _.contains( [ 'top', 'bottom' ], region );
		}

		if ( 'child' == parent.get( 'type' ) && 'tailor_column' != parent.get( 'tag' ) ) {
			return 'container' != that.get( 'type' ) && ! _.contains( [ 'left', 'right' ], region );
		}

		if ( _.contains( [ 'wrapper', 'child' ], parent.get( 'type' ) ) ) {
			if ( _.contains( [ 'top', 'bottom' ], region ) ) {
				return _.contains( [ 'tailor_section', 'tailor_column' ], parent.get( 'tag' ) ) || ! _.contains( [ 'container', 'wrapper', 'child' ], that.get( 'type' ) );
			}

			return 'tailor_section' == parent.get( 'tag' ) || _.contains( [ 'left', 'right' ], region );
		}

		return true;
	},

	/**
	 * Initializes the element model.
	 *
	 * @since 1.0.0
	 */
	initialize : function() {
		this.addEventListeners();
	},

	/**
	 * Adds the required event listeners.
	 *
	 * @since 1.0.0
	 */
	addEventListeners : function() {
		this.listenTo( this, 'element:move:top', this.insertBefore );
		this.listenTo( this, 'element:move:bottom', this.insertAfter );
		this.listenTo( this, 'element:move:left', this.columnBefore );
		this.listenTo( this, 'element:move:right', this.columnAfter );

		this.listenTo( this, 'element:copy:top', this.copyBefore );
		this.listenTo( this, 'element:copy:bottom', this.copyAfter );
		this.listenTo( this, 'element:copy:left', this.copyColumnBefore );
		this.listenTo( this, 'element:copy:right', this.copyColumnAfter );

		this.listenTo( this, 'element:move:center', this.createChild );
		this.listenTo( this, 'element:copy:center', this.copyChild );
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
		var clone = sourceView.model.clone();
		var index = targetView.model.get( 'order' ) - 1;

		clone.set( 'id', clone.cid );
		clone.set( 'parent', targetView.model.get( 'parent' ) );//, { silent : true } );
		clone.set( 'order', index );//, { silent : true } );

		this.copy( clone.cid, sourceView );
		this.collection.add( clone );//, { at : index } );
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
		var clone = sourceView.model.clone();
		var index = targetView.model.get( 'order' );

		clone.set( 'id', clone.cid );
		clone.set( 'parent', targetView.model.get( 'parent' ) );
		clone.set( 'order', index );

		this.copy( clone.cid, sourceView );

		this.collection.add( clone );
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
		var model = targetView.model;
		var clone = sourceView.model.clone();

		clone.set( 'id', clone.cid );

		this.copy( clone.cid, sourceView );

		if ( 'tailor_column' === model.get( 'tag' ) ) {
			var column = this.collection.createColumn( model.get( 'parent' ),  model.get( 'order' ) - 1 );

			clone.set( 'parent', column.get( 'id' ) );
			this.collection.add( clone );
		}
		else {
			var columns = this.collection.createRow( model.get( 'parent' ), model.get( 'order' ) );
			this.collection.insertChild( model, _.last( columns ) );

			clone.set( 'parent', _.first( columns ).get( 'id' ) );
			this.collection.add( clone );
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
		var model = targetView.model;
		var clone = sourceView.model.clone();

		clone.set( 'id', clone.cid );

		this.copy( clone.cid, sourceView );

		if ( 'tailor_column' === model.get( 'tag' ) ) {
			var column = this.collection.createColumn( model.get( 'parent' ), model.get( 'order' ) );

			clone.set( 'parent', column.get( 'id' ) );
			this.collection.add( clone );
		}
		else {
			var columns = this.collection.createRow( model.get( 'parent' ), model.get( 'order' ) );

			this.collection.insertChild( model, _.first( columns ) );
			clone.set( 'parent', _.last( columns ).get( 'id' ) );
			this.collection.add( clone );
		}
	},

	/**
	 * Inserts the source element inside a new child element in the target view.
	 *
	 * @since 1.0.0
	 *
	 * @param targetView
	 * @param sourceView
	 */
	createChild : function( targetView, sourceView ) {
		var id = targetView.model.get( 'id' );
		var childTag = targetView.model.get( 'child' );
		var numberChildren = this.collection.where( { parent : id, tag : childTag } ).length;

		this.appendTemplate( sourceView.model.get( 'id' ), sourceView );
		this.collection.createWrapper( childTag, id, numberChildren, sourceView.model );
	},

	/**
	 * Copies the source element and inserts it inside a new child element in the target view.
	 *
	 * @since 1.0.0
	 *
	 * @param targetView
	 * @param sourceView
	 */
	copyChild : function( targetView, sourceView ) {
		var id = targetView.model.get( 'id' );
		var childTag = targetView.model.get( 'child' );
		var numberChildren = this.collection.where( { parent : id, tag : childTag } ).length;
		var wrapper = this.collection.createWrapper( childTag, id, numberChildren, false );

		var clone = sourceView.model.clone();
		clone.set( 'id', clone.cid );
		clone.set( 'parent', wrapper.get( 'id' ) );
		clone.set( 'order', 0 );

		this.copy( clone.cid, sourceView );
		this.collection.add( clone );
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
	 * Creates a new element template based on a given element and appends it to the page.
	 *
	 * @since 1.0.0
	 *
	 * @param id
	 * @param view
	 */
	createTemplate : function( id, view ) {
		var isEditing =  view.el.classList.contains( 'is-editing' );
		view.$el.removeClass( 'is-dragging is-hovering is-selected is-editing' );
		
		this.appendTemplate( id, view );

		if ( isEditing ) {
			view.el.classList.add( 'is-editing' );
		}
	}

} );

module.exports = ElementModel;