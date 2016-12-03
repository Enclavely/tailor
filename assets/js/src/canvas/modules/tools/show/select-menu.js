var SelectMenuItemView = require( './select-menu-item' ),
    SelectMenuView;

SelectMenuView = Marionette.CompositeView.extend( {

    className : 'select',

	childView : SelectMenuItemView,

	childViewContainer : '.select__menu',

	ui : {
		'add' : '.js-add',
		'edit' : '.js-edit',
		'copy' : '.js-copy',
		'delete' : '.js-delete'
	},

    events : {
        'click @ui.add' : 'addElement',
        'click @ui.edit' : 'editElement',
        'click @ui.copy' : 'copyElement',
        'click @ui.delete' : 'deleteElement'
    },

    modelEvents : {
        'destroy' : 'destroy'
    },
    
    childEvents : {
		'toggle' : 'toggleMenu'
	},

    template : '#tmpl-tailor-tools-select',

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.CompositeView.prototype.serializeData.apply( this, arguments );
        data.type = this.model.get( 'type' );
        data.siblings = this.collection.where( { parent : this.model.get( 'parent' ) } ).length;
        return data;
    },

    /**
     * Initializes the selector.
     *
     * @since 1.0.0
     *
     * @param options
     */
	initialize : function( options ) {
        this._view = options.view;
    },

    /**
     * Filters the collection so that only ancestors of the target element are displayed in the menu.
     *
     * @since 1.0.0
     *
     * @returns {Array}
     * @private
     */
    _filteredSortedModels : function() {
        var models = [];
        var model = this.model;

        while ( 'undefined' !== typeof model ) {
            models.push( model );
            model = this.collection.get( model.get( 'parent' ) );
        }
        return models;
    },

    /**
     * Positions the selector over the target view.
     *
     * @since 1.0.0
     */
	onDomRefresh : function() {
        var thisRect = this.el.parentNode.getBoundingClientRect();
        var thatRect = this._view.el.getBoundingClientRect();

        var style = getComputedStyle( this._view.el, null );
        var borderTop = parseInt( style.getPropertyValue( 'border-top-width' ), 10 );
        var borderRight = parseInt( style.getPropertyValue( 'border-right-width' ), 10 );
        var borderBottom = parseInt( style.getPropertyValue( 'border-bottom-width' ), 10 );
        var borderLeft = parseInt( style.getPropertyValue( 'border-left-width' ), 10 );

        var left = Math.round( parseFloat( thatRect.left ) ) + borderLeft;
        var right = Math.min( window.innerWidth + 1, Math.round( thatRect.right ) - borderRight );
        var width = right - left;

        this.el.style.top = ( Math.round( parseFloat( thatRect.top - parseFloat( thisRect.top ) ) ) + borderTop ) + 'px';
        this.el.style.left = ( left - thisRect.left ) + 'px';
        this.el.style.width = width + 'px';
        this.el.style.height = ( Math.round( parseFloat( thatRect.height ) ) - borderTop - borderBottom ) + 'px';

        var controls = this.el.querySelector( '.select__controls' );
        var menu = this.el.querySelector( '.select__menu' );
        if ( menu && controls ) {
            var menuRect = menu.getBoundingClientRect();
            var controlsRect = controls.getBoundingClientRect();
            if ( ( menuRect.width + controlsRect.width ) > parseInt( this.el.style.width, 10 ) ) {
                this.el.classList.add( 'is-minimal' );
            }
        }
    },

	/**
     * Adds a child to the container element.
     *
     * @since 1.7.3
     */
    addElement : function() {
        var child = this.model.collection.createChild( this.model );
        
        // Set the collection to library to ensure the history snapshot is created
        child.set( 'collection', 'library', { silent : true } );

        /**
         * Fires when a child element is added.
         *
         * @since 1.7.3
         *
         * @param this.model
         */
        app.channel.trigger( 'element:add', child );
    },

    /**
     * Edits the target element.
     *
     * @since 1.0.0
     */
    editElement : function() {

        /**
         * Fires when the edit modal is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:open', this.model );
    },

	/**
	 * Copies the target element and creates a duplicate immediately below it.
     *
     * @since 1.6.2
     */
    copyElement : function() {
        this.model.copyAfter( this._view, this._view );

        /**
         * Fires when an element is copied.
         *
         * @since 1.6.2
         *
         * @param this.model
         */
        app.channel.trigger( 'element:copy', this.model );
    },

    /**
     * Removes the target element.
     *
     * @since 1.0.0
     */
    deleteElement : function() {
        this.model.trigger( 'destroy', this.model );

        /**
         * Fires when an element is deleted.
         *
         * This is used by the History module instead of listening to the element collection, as the removal of
         * an element can have cascading effects (e.g., the removal of column and row structures) which should
         * not be tracked as steps.
         *
         * @since 1.0.0
         *
         * @param this.model
         */
        app.channel.trigger( 'element:delete', this.model );
    },

    /**
     * Toggles the menu.
     *
     * @since 1.0.0
     */
    toggleMenu : function() {
        this.$el.toggleClass( 'is-expanded' );
    }

} );

module.exports = SelectMenuView;