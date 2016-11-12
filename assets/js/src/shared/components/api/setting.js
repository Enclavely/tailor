
var $ = window.jQuery,
    $win = $( window ),
    app = window.app,
    cssModule,
    callbacks = {
        'sidebar' : [],
        'element' : []
    };

/**
 * Ensures that the query name provided is valid.
 *
 * @since 1.5.0
 *
 * @param query
 * @returns {*}
 */
function checkQuery( query ) {
    if ( ! query || ! _.contains( _.keys( cssModule.stylesheets ), query ) ) {
        query = 'all';
    }
    return query;
}

/**
 * Triggers registered callback functions when a sidebar setting is changed.
 *
 * @since 1.5.0
 *
 * @param setting
 */
var onSidebarChange = function( setting ) {
    var settingId = setting.get( 'id' );

    // Do nothing if there are no registered callbacks for this setting
    if ( _.isEmpty( callbacks['sidebar'][ settingId ] ) ) {
        return;
    }

    _.each( callbacks['sidebar'][ settingId ], function( callback ) {
        callback.apply( window, [ setting.get( 'value' ), setting.previous( 'value' ) ] );
    } );

    // Trigger a resize even on the window when a sidebar setting changes
    $win.trigger( 'resize' );
};

/**
 * Triggers registered callback functions when an element setting is changed.
 *
 * @since 1.5.0
 *
 * @param setting
 * @param view
 */
var onElementChange = function( setting, view ) {
    var elementId = view.model.get( 'id' );
    var settingId = setting.get( 'id' );

    // Do nothing if there are no registered callbacks for this setting
    if ( ! callbacks['element'].hasOwnProperty( settingId ) || 0 == callbacks['element'][ settingId ].length ) {
        return;
    }

    if ( 1 == callbacks['element'][ settingId ].length ) {
        cssModule.deleteRules( elementId, settingId );
    }

    var ruleSets = {};
    var rules;
    
    _.each( callbacks['element'][ settingId ], function( callback ) {
        if ( 'function' == typeof callback ) {
            
            // Get the collection of rules from the callback function
            rules = callback.apply( view, [ setting.get( 'value' ), setting.previous( 'value' ), view.model ] );

            // Re-render the element if the the callback function returns a value of false
            if ( false === rules ) {
                view.model.trigger( 'change:atts', view.model, view.model.get( 'atts' ) );
            }
            else if ( _.isArray( rules ) && rules.length > 0 ) {

                // Process the rules
                for ( var rule in rules ) {
                    if ( rules.hasOwnProperty( rule ) ) {
                        if ( ! rules[ rule ].hasOwnProperty( 'selectors' ) || ! rules[ rule ].hasOwnProperty( 'declarations' ) ) {
                            continue;
                        }
                        
                        var query = checkQuery( rules[ rule ].media );
                        ruleSets[ query ] = ruleSets[ query ] || {};
                        ruleSets[ query ][ elementId ] = ruleSets[ query ][ elementId ] || [];

                        if ( _.keys( rules[ rule ].declarations ).length > 0 ) {
                            ruleSets[ query ][ elementId ].push( {
                                selectors: rules[ rule ].selectors,
                                declarations: rules[ rule ].declarations,
                                setting: rules[ rule ].setting || settingId
                            } );
                        }
                    }
                }

                // Update the rules for the element/setting
                cssModule.addRules( ruleSets );
            }
        }
    } );
};

app.listenTo( app.channel, 'sidebar:setting:change', onSidebarChange );
app.listenTo( app.channel, 'element:setting:change', onElementChange );
app.channel.on( 'module:css:stylesheets:ready', function( module ) {
    cssModule = module;
} );

function registerCallback( type, id, callback ) {
    if ( 'function' === typeof callback ) {
        callbacks[ type ][ id ] = callbacks[ type ][ id ] || [];
        callbacks[ type ][ id ].push( callback );
    }
}

module.exports = {

    /**
     * API for updating the canvas when a sidebar or element setting is changed.
     * 
     * Accepts an event in the form "setting_type:setting_id".
     *
     * @since 1.5.0
     *
     * @param id
     * @param callback
     */
    onChange : function( id, callback ) {
        var parts = id.split( ':' );
        if ( parts.length >= 2 && _.contains( [ 'sidebar', 'element' ], parts[0] ) ) {
            registerCallback( parts[0], parts[1], callback );
        }
    }
};