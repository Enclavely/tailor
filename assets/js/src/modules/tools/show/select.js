module.exports = Marionette.CompositeView.extend( {

    className : 'select',

	childView : require( './menu-item' ),

	childViewContainer : '.select__menu',

	ui : {
		'edit' : '.js-edit',
		'delete' : '.js-delete'
	},

    events : {
        'click @ui.edit' : 'editElement',
        'click @ui.delete' : 'deleteElement'
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
        this._model = this._view.model;
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

        this.el.style.top = thatRect.top - thisRect.top + 'px';
        this.el.style.left = thatRect.left - thisRect.left + 'px';
        this.el.style.width = thatRect.width + 'px';
        this.el.style.height = thatRect.height + 'px';
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