var $ = Backbone.$,
    HistoryItem;

HistoryItem = Marionette.ItemView.extend( {

    events : {
        click : 'restore',
        keypress : 'onKeyPress'
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     *
     * @returns {string}
     */
    template : '#tmpl-tailor-panel-history-item',

    /**
     * Initializes the item.
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
        this.listenTo( this.model.collection, 'change:active', this.toggleClass );
    },

	/**
	 * Assigns the appropriate class name to the item based on whether it is active.
	 *
	 * @since 1.0.0
	 */
    onRender : function() {
        this.toggleClass();
    },

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
     *
     * @param html
     * @returns {exports}
     */
    attachElContent : function( html ) {
        var $el = $( html );

        this.$el.replaceWith( $el );
        this.setElement( $el );
        this.el.setAttribute( 'tabindex', 0 );

        return this;
    },

	/**
	 * Restores the associated history entry when the item is selected using the keyboard.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.restore();
        }
    },

    /**
     * Restores the history entry.
     *
     * @since 1.0.0
     */
    restore : function() {
        var timestamp = this.model.get( 'timestamp' );

	    /**
	     * Fires before a request is made to restore a given history entry.
	     *
	     * @since 1.0.0
	     *
	     * @param id
	     */
	    app.channel.trigger( 'before:history:restore', timestamp );

        /**
         * Fires after a request is made to restore a given history entry.
         *
         * @since 1.0.0
         *
         * @param id
         */
        app.channel.trigger( 'history:restore', timestamp );
    },

    /**
     * Toggles the state of the entry element based on its status.
     *
     * @since 1.0.0
     *
     * @param model
     */
    toggleClass : function( model ) {
        model = model || this.model.collection.getActive();
        this.$el.toggleClass( 'is-active', model === this.model );
    }

} );

module.exports = HistoryItem;
