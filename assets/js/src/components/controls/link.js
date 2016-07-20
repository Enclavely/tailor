/**
 * Tailor.Controls.Link
 *
 * A link control.
 *
 * @augments Marionette.ItemView
 */
var $ = Backbone.$,
    AbstractControl = require( './abstract-control' ),
    LinkControl;

LinkControl = AbstractControl.extend( {

	ui: {
        'input' : 'input',
        'select' : '.button--select',
        'default' : '.js-default'
	},

    events : {
        'input @ui.input' : 'onControlChange',
        'change @ui.input' : 'onControlChange',
        'click @ui.select' : 'openDialog',
        'click @ui.default' : 'restoreDefaultValue'
    },

    /**
     * Provides the required information to the template rendering function.
     *
     * @since 1.0.0
     *
     * @returns {*}
     */
    serializeData : function() {
        var data = Backbone.Marionette.ItemView.prototype.serializeData.apply( this, arguments );
        var defaultValue = this.getDefaultValue();

        data.value = this.getSettingValue();
        data.placeholder = this.model.get( 'placeholder' );
        data.showDefault = null != defaultValue && data.value != defaultValue;

        return data;
    },

	/**
     * Queries the server for links based on the search criteria.
     *
     * @since 1.0.0
     *
     * @param term
     */
    search : function( term ) {
        var control = this;
        var $searchResults = this.$el.find( '.search-results' );

        if ( $searchResults.length ) {

            control.$el.addClass( 'is-searching' );

            var options = {
	            
                data : {
                    s : term,
                    nonce : window._nonces.query
                },

	            /**
	             * Appends the list of search results to the page.
	             *
	             * @since 1.0.0
	             */
                success : function( response ) {
                    $searchResults.html( response );
                },

	            /**
	             * Resets the control classname when searching is complete.
	             */
                complete : function() {
                    control.$el.removeClass( 'is-searching' );
                }
            };

            window.ajax.send( 'tailor_get_links', options );
        }
    },

	/**
     * Opens the link selection dialog.
     *
     * @since 1.0.0
     */
    openDialog : function() {
        var control = this;
        var options = {
            title : 'Select content',
            button : window._l10n.select,

	        /**
	         * Returns the content for the Select Content dialog.
	         *
	         * @since 1.0.0
	         *
	         * @returns {*}
	         */
            content : function() {
                return  '<div class="dialog__container">' +
                            '<input class="search--content" type="search" role="search" placeholder="Search">' +
                            '<span class="spinner"></span>' +
                            '<div class="search-results"></div>' +
                        '</div>';
            },

	        /**
	         * Adds the required event listeners to the dialog window content.
	         *
	         * @since 1.0.0
	         */
            onOpen : function() {
                var dialog = this;
                var previousTerm = '';
                var minimumCharacters = 3;
                var timeout;

                this.$el.find( '.search--content' ).on( 'input', function( e ) {

                    clearTimeout( timeout );

                    var term = this.value;
                    if ( term.length >= minimumCharacters && previousTerm != $.trim( term ) ) {
                        timeout = setTimeout( $.proxy( control.search, dialog, term ), 500 );
                    }
                } );
            },

	        /**
	         * Returns true if an item has been selected.
	         *
	         * @since 1.0.0
	         *
	         * @returns {*}
	         */
            onValidate : function() {
                return $( 'input[name=url]:checked' ).val()
            },

	        /**
	         * Updates the setting value with the selected item URL.
	         *
	         * @since 1.0.0
	         */
            onSave : function() {
                var url = $( 'input[name=url]:checked' ).val();

                control.setSettingValue( url );
                control.ui.input.val( url )
            },

	        /**
	         * Cleans up event listeners.
	         *
	         * @since 1.0.0
	         */
            onClose : function() {
                this.$el.find( '.search--content' ).off( 'input' );
            }
        };

		/**
		 * Fires when the dialog window is opened.
		 *
		 * @since 1.0.0
		 */
		app.channel.trigger( 'dialog:open', options );
    },

	/**
     * Clears the selected icon.
     *
     * @since 1.0.0
     */
    removeIcon : function() {
        this.setSettingValue( '' );
    },

	/**
     * Re-renders the control when the default value is restored.
     *
     * @since 1.0.0
     */
    onRestoreDefault : function() {
        this.render();
    }

} );

module.exports = LinkControl;