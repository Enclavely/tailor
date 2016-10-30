var ControlCollection = Backbone.Collection.extend( {

	model : require( '../models/control' ),

    /**
     * Initializes the controls collection.
     *
     * @since 1.0.0
     */
    initialize : function( models, options ) {
        if ( options && options.settings ) {
            this.settings = options.settings;
        }
        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'reset', this.onReset );
    },

    /**
     * Assigns settings to each control in the collection.
     *
     * @since 1.0.0
     */
    onReset : function() {

        var mediaQueries = [];
        for ( var mediaQueryId in _media_queries ) {
            if ( _media_queries.hasOwnProperty( mediaQueryId ) && '' != _media_queries[ mediaQueryId ].max ) {
                mediaQueries.push( mediaQueryId );
            }
        }

        this.each( function( model ) {
            var settingId = model.get( 'setting' );
            model.settings = this.settings.filter( function( setting ) {
                var id = setting.get( 'id' );
                if ( id == settingId ) {
                    setting.media = 'desktop';
                    return true;
                }
                else {
                    var index = _.indexOf( mediaQueries, id.replace( settingId + '_', '' ) );
                    if ( -1 !== index ) {
                        setting.media = mediaQueries[ index ];
                        return true;
                    }
                }

                return false;
            } );
        }, this );
    }

} );

module.exports = ControlCollection;
