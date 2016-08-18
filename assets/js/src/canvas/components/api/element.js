var callbacks = {
    'render' : [],
    'destroy' : []
};

var registerCallback = function( event, tag, callback ) {
    if ( callbacks.hasOwnProperty( event ) && 'function' === typeof callback ) {
        callbacks[ event ][ tag ] = callbacks[ event][ tag ] || [];
        callbacks[ event ][ tag ].push( callback );
    }
};

/**
 * Triggers registered callback functions when an element is rendered (or refreshed).
 *
 * @since 1.0.0
 *
 * @param view
 * @param atts
 */
var onRender = function( view, atts ) {
    var model = view.model;
    var tag = model.get( 'tag' );

    atts = atts || model.get( 'atts' );

    if ( callbacks.render[ tag ] ) {
        _.each( callbacks.render[ tag ], function( callback ) {
            callback.apply( view, [ atts, model ] );
        } );
    }
};

/**
 * Triggers registered callback functions when an element is destroyed.
 *
 * @since 1.0.0
 *
 * @param view
 */
var onDestroy = function( view ) {
    var model = view.model;
    var tag = model.get( 'tag' );

    if ( callbacks.destroy[ tag ] ) {
        _.each( callbacks.destroy[ tag ], function( callback ) {
            callback.apply( view, [ model.get( 'atts' ), model ] );
        } );
    }
};

window.app.listenTo( app.channel, 'element:ready element:refresh', onRender );
window.app.listenTo( app.channel, 'element:destroy', onDestroy );

module.exports = {

    /**
     * API for updating the canvas when an element is rendered.
     *
     * @since 1.0.0
     *
     * @param tag
     * @param callback
     */
    onRender : function( tag, callback ) {
        registerCallback( 'render', tag, callback );
    },

    /**
     * API for updating the canvas when an element is destroyed.
     *
     * @since 1.0.0
     *
     * @param tag
     * @param callback
     */
    onDestroy : function( tag, callback ) {
        registerCallback( 'destroy', tag, callback );
    }
};
