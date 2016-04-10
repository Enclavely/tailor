module.exports = Marionette.Module.extend( {

    /**
     * Initializes the module.
     *
     * @since 1.0.0
     */
    onStart : function( options ) {
        var LayoutView = require( './panels/show/layout' );

        app.content.show( new LayoutView( {
            panels : app.channel.request( 'sidebar:panels' ),
            sections : app.channel.request( 'sidebar:sections' ),
            controls : app.channel.request( 'sidebar:controls' ),
            settings : app.channel.request( 'sidebar:settings' )
        } ) );
    }

} );