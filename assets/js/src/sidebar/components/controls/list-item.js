/**
 * Individual list item view.
 *
 * @augments Marionette.CompositeView
 */
var ListItemControl = Marionette.CompositeView.extend( {

    tagName : 'li',

    className : 'list-item',

    ui : {
        title : '.list-item__title',
        content : '.list-item__content',
        delete : '.js-delete-list-item',
        close : '.js-close-list-item'
    },

    triggers : {
        'click @ui.title' : 'toggle',
        'click @ui.close' : 'toggle',
        'click @ui.delete' : 'delete'
    },

    events : {
        'keypress' : 'onKeyPress'
    },

    /**
     * Returns the appropriate child view based on the panel type.
     *
     * @since 1.0.0
     *
     * @param child
     * @returns {*|exports|module.exports}
     */
    getChildView: function( child ) {
        return Tailor.lookup( child.get( 'type' ), false, 'Controls' );
    },

    childViewContainer : '#controls',

    template : '#tmpl-tailor-control-list-item',

	/**
	 * Initializes the list item view.
	 *
	 * @since 1.0.0
	 *
	 * @param options
	 */
    initialize : function( options ) {
        this.settings = options.settings;
        this._open = false;
        this.model.startTracking();

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.settings, 'change', this.onChangeSettings );
        this.listenTo( app.channel, 'modal:apply', this.onApplyModal );
        this.listenTo( app.channel, 'modal:close', this.onCloseModal );
    },

	/**
	 * Updates the list item title.
	 *
	 * @since 1.0.0
	 *
	 * @param from
	 * @param to
	 */
    updateTitle : function( from, to ) {
        this.ui.title.find( ':contains(' + from + ')' ).html( to );
    },

	/**
	 * Toggles the list item when selected using the keyboard.
	 *
	 * @since 1.0.0
	 *
	 * @param e
	 */
    onKeyPress : function( e ) {
        if ( 13 === e.which ) {
            this.triggerMethod( 'toggle' );
        }
    },

	/**
	 * Toggles the list item.
	 *
	 * @since 1.0.0
	 */
    onToggle : function() {
        if ( this._open ) {
            this.slideUp();
        }
        else {
            this.slideDown();
        }
    },

	/**
	 * Hides the list item.
	 *
	 * @since 1.0.0
	 */
    slideUp : function() {
        var control = this;
        control._open = false;

        control.ui.content.slideUp( 150, function() {
            control.el.classList.remove( 'is-open' );
        } );
    },

	/**
	 * Shows the list item.
	 *
	 * @since 1.0.0
	 */
    slideDown : function() {
        var control = this;
        control._open = true;

        control.ui.content.slideDown( 150, function() {
            control.el.classList.add( 'is-open' );
        } );
    },

	/**
	 * Triggers the 'remove' method/event on the list item when removed.
	 *
	 * @since 1.0.0
	 */
    onDelete : function() {
        var control = this;
        control.$el.slideUp( 250, function() {

            /**
             * Destroys the list item view.
             *
             * @since 1.0.0
             */
            control.triggerMethod( 'remove' );
        } );
    },

	/**
	 * Updates the model and view when changes are made.
	 *
	 * @since 1.0.0
	 *
	 * @param setting
	 */
    onChangeSettings : function( setting ) {
        var atts = _.clone( this.model.get( 'atts' ) );
        var settingId = setting.get( 'id' );
        var settingValue = setting.get( 'value' );

        if ( 'title' == settingId ) {
            this.updateTitle( atts.title, settingValue );
        }

        atts[ settingId ] = settingValue;

        this.model.set( 'atts', atts );
    },

	/**
	 * Stops tracking changes when changes are applied.
	 *
	 * @since 1.0.0
	 */
    onApplyModal : function() {
        this.model.stopTracking();
    },

	/**
	 * Reset attributes to their original values when changes are discarded.
	 *
	 * @since 1.0.0
	 */
    onCloseModal : function() {
        this.model.resetAttributes();
    }

} );

module.exports = ListItemControl;
