/**
 * Tailor.Controls.List
 *
 * A list control.
 *
 * @augments Marionette.CompositeView
 */
var ListControl = Marionette.CompositeView.extend( {

    childView : require( './list-item' ),

    childViewContainer : '#list-items',

    emptyView : require( './list-empty' ),

    className : function() {
        return 'control control--' + this.model.get( 'type' );
    },

    ui : {
        'button' : '.js-add'
    },

    events : {
        'click @ui.button' : 'addItem'
    },

    collectionEvents : {
        'add' : 'updateContent',
        'remove' : 'updateContent',
        'change' : 'updateContent'
    },

    childEvents : {
        'remove' : 'deleteItem',
        'toggle' : 'onToggleItem'
    },

    template : '#tmpl-tailor-control-list',

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        data.childLabel = this.child.get( 'label' ).toLowerCase();
        return data;
    },

    /**
     * Returns the appropriate set of options for the child view.
     *
     * @since 1.0.0
     *
     * @param model
     * @param index
     * @returns {{model: *}}
     */
    childViewOptions : function( model, index ) {
        var controlCollection = app.channel.request( 'sidebar:controls', model );
        var settingCollection = app.channel.request( 'sidebar:settings', model );
        var options = {
            model : model,
            collection : controlCollection,
            settings : settingCollection
        };

        return options;
    },

    /**
     * Initializes the list.
     *
     * @since 1.0.0
     *
     * @param options
     */
    initialize : function( options ) {
        this.element = options.element;
        this._added = [];
        this._deleted = [];

        var listItemDefinition = app.channel.request( 'sidebar:library', this.element.get( 'tag' ) );
        this.child = app.channel.request( 'sidebar:library', listItemDefinition.get( 'child' ) );

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( app.channel, 'modal:apply', this.onApplyModal );
        this.listenTo( app.channel, 'modal:close', this.onCloseModal );
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
        return child.get( 'parent' ) == this.element.get( 'id' );
    },

    /**
     * Enables sorting of the list items.
     *
     * @since 1.0.0
     */
    onRender : function() {
        var listControl = this;

        this.sortable = Sortable.create( this.$childViewContainer.get(0), {
            draggable : '.list-item',
            handle : '.list-item__title',
            animation : 250,

            /**
             * Updates the order of the list items when they are sorted.
             *
             * @since 1.0.0
             */
            onEnd : function ( e ) {

                /**
                 * Fires when a list item is reordered.
                 *
                 * @since 1.0.0
                 */
                app.channel.trigger( 'list:change:order', listControl.el );

                listControl.updateOrder();
            }
        } );
    },

    /**
     * Returns true if the collection is empty (i.e., the list has no list items).
     *
     * @since 1.0.0
     *
     * @returns {boolean}
     */
    isEmpty : function() {
        return this.collection.getChildren( this.element ).length == 0;
    },

	/**
	 * Toggle a list item.
	 *
	 * @since 1.0.0
	 *
	 * @param child
	 */
	onToggleItem : function( child ) {
		this.children.each( function( childView ) {
			if ( childView !== child ) {
				childView.slideUp();
			}
		}, this );
	},

    /**
     * Slides up other list items when a list item is added.
     *
     * @since 1.0.0
     *
     * @param child
     */
    onAddChild : function( child ) {
        this.children.each( function( childView ) {
            if ( childView !== child ) {
                childView.slideUp();
            }
        }, this );
    },

    /**
     * Adds a list item.
     *
     * New list items are tracked so that they can be added, if necessary, when the modal window is closed.
     *
     * @since 1.0.0
     */
    addItem : function() {
        var numberChildren = this.collection.getChildren( this.element ).length;
        var item = _.first( this.collection.create( [ {
            tag : this.child.get( 'tag' ),
            parent : this.element.get( 'id' ),
            order : numberChildren,
            atts : {
                title : this.child.get( 'label' )
            }
        } ], { } ) );

        this._added.push( item );
    },

    /**
     * Deletes a list item.
     *
     * Preexisting list items are tracked so that they can be deleted, if necessary, when the modal window is closed.
     *
     * @since 1.0.0
     */
    deleteItem : function( view ) {

        // Delete the list item from the 'added' list, if it exists
        for ( var i = 0; i < this._added.length; i++ ) {
            if ( this._added[ i ] ==  view.model ) {
                this._added.splice( i, 1 );
            }
        }

        this.collection.remove( view.model );
        this._deleted.push( view.model );
    },

    /**
     * Resets the added and deleted list items.
     */
    onApplyModal : function() {
        this._deleted = [];
        this._added = [];
    },

    /**
     * Updates the collection to undo any unapplied changes to the collection.
     *
     * @since 1.0.0
     */
    onCloseModal : function() {
        this.collection.add( this._deleted );
        this.collection.remove( this._added );
    },

    /**
     * Updates the order of each list item after sorting.
     *
     * @since 1.0.0
     */
    updateOrder : function() {
        this.children.each( function( view ) {
            view.model.set( 'order', view.$el.index() );
        }, this );

	    this.collection.sort( { silent : true } );

	    this.updateContent();
    },

    /**
     * Updates the content attribute of the list when a list item changes.
     *
     * @since 1.0.0
     */
    updateContent : function() {
	    var shortcode = this.generateShortcode();
        this.model.settings[0].set( 'value', shortcode );
    },

    /**
     * Generates the content attribute of the list (i.e., a shortcode representing the list items).
     *
     * @since 1.0.0
     */
    generateShortcode : function() {
        var obj = this;
        var content = '';
        var parentId = this.element.get( 'id' );
        var children = this.collection.filter( function( model ) {
            return  model.get( 'parent' ) === parentId && ! obj._deleted.hasOwnProperty( model.cid );
        } );

        _.each( children, function( child ) {
            content += child.toShortcode();
        } );

        return content;
    },

	/**
	 * Cleans up the Sortable instance when the element is destroyed.
	 *
	 * @since 1.0.0
	 */
	onBeforeDestroy : function() {
        this.sortable.destroy();
        this.collection.sort();
    }

} );

module.exports = ListControl;
