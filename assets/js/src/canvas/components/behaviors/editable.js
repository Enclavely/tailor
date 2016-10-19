var EditableBehaviors = Marionette.Behavior.extend( {

	events : {
		'mouseover' : 'onMouseOver',
		'mouseout' : 'onMouseOut',
        'click' : 'onClick'
	},

    modelEvents : {
        'select' : 'selectElement'
    },

    collectionEvents: {
        edit : 'onEdit'
    },

    /**
     * Selects or edits the element when clicked, depending on whether the Shift button is pressed.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onClick : function( e ) {
        if ( e.shiftKey ) {
            this.editElement();
        }
        else {
            this.selectElement();
        }

        e.preventDefault();
        e.stopPropagation();
    },

    /**
     * Updates the element class when the mouse is over it.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onMouseOver : function( e ) {
        this.view.$el.addClass( 'is-hovering' );

        e.stopPropagation();
    },

    /**
     * Updates the element class when the mouse leaves it.
     *
     * @since 1.0.0
     *
     * @param e
     */
    onMouseOut : function( e ) {
        this.view.$el.removeClass( 'is-hovering' );

        e.stopPropagation();
    },

    /**
     * Edits the element.
     *
     * @since 1.0.0
     */
    editElement : function() {

        /**
         * Fires when the edit modal is opened.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'modal:open', this.view.model );
    },

    /**
     * Selects the element.
     *
     * This is used when an element is selected from the drop down menu of the select tool.
     *
     * @since 1.0.0
     */
    selectElement : function() {

        /**
         * Fires when an element is selected.
         *
         * @since 1.0.0
         */
        app.channel.trigger( 'canvas:select', this.view );
    },

    /**
     * Updates the element class when the element is being edited.
     *
     * @since 1.0.0
     *
     * @param model
     * @param editing bool
     */
    onEdit : function( model, editing ) {
        this.view.$el.toggleClass( 'is-editing', ( model === this.view.model && editing ) );
    }

} );

module.exports = EditableBehaviors;