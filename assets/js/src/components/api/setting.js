var callbacks = {};

/**
 * Triggers registered callback functions when a setting value changes.
 *
 * @since 1.0.0
 *
 * @param setting
 */
var onChange = function( setting ) {
    var settingId = setting.get( 'id' );
    if ( callbacks[ settingId ] ) {
        _.each( callbacks[ settingId ], function( callback ) {
            callback.apply( app, [ setting.get( 'value' ), setting.previous( 'value' ) ] );
        } );
    }
};

app.listenTo( app.channel, 'sidebar:setting:change', onChange );

/**
 * A simple API for registering a callback function to be applied when a given setting changes.
 *
 * @since 1.0.0
 *
 * @param id
 * @param callback
 */
module.exports = function( id, callback ) {
    if ( 'function' === typeof callback ) {
        callbacks[ id ] = callbacks[ id ] || [];
        callbacks[ id ].push( callback );
    }
};