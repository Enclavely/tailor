var DialogView = require( './show/dialog' ),
	DialogModule;

DialogModule = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
		var api = {

            /**
             * Opens the dialog window.
             *
             * @since 1.0.0
             *
             * @param options
             */
			showDialog : function( options ) {
                app.dialog.show( new DialogView( options ) );
			}
		};

		this.listenTo( app.channel, 'dialog:open', api.showDialog );

	    /**
	     * Fires when the module is initialized.
	     *
	     * @since 1.5.0
	     *
	     * @param this
	     */
	    app.channel.trigger( 'module:dialog:ready', this );
    }

} );

module.exports = DialogModule;