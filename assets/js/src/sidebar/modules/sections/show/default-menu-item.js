var $ = Backbone.$,
    DefaultItem;

DefaultItem = Marionette.ItemView.extend( {

    events : {
        click : 'onClick',
        keypress : 'onKeyPress'
    },

    modelEvents : {
        'focus' : 'onFocus'
    },

    /**
     * Returns the appropriate template based on the panel type.
     *
     * @since 1.0.0
     * @returns {string}
     */
    template : '#tmpl-tailor-panel-default-item',

    /**
     * Uses the rendered template HTML as the $el.
     *
     * @since 1.0.0
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
	 * Displays the associated section when the item is clicked.
	 *
	 * @since 1.0.0
	 */
    onClick : function() {
        this.triggerMethod( 'show:section' );
    },

	/**
	 * Displays the associated section when the item is selected using the keyboard.
	 *
	 * @since 1.0.0
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.triggerMethod( 'show:section' );
        }
    },

	/**
	 * Sets focus on the list item.
	 *
	 * @since 1.0.0
	 */
	onFocus : function() {
		this.el.focus();
	}

} );

module.exports = DefaultItem;
