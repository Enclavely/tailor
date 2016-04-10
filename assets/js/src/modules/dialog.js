module.exports = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
	onStart : function() {
        var DialogView = require( './dialog/show/dialog' );
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
    }

} );