var SettingCollection = Backbone.Collection.extend( {

	model : require( '../models/setting' ),

    /**
     * Initializes the setting collection.
     *
     * @since 1.0.0
     */
    initialize : function( models, options ) {
        if ( options && options.element ) {
            this.element = options.element;
        }

        this.addEventListeners();
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this, 'reset', this.load );
    },

	/**
     * Assigns the initial value to the setting.
     *
     * @since 1.0.0
     */
    load : function() {
        var atts = this.element.get( 'atts' );
        this.each( function( model ) {
            model.set( 'value', atts[ model.get( 'id' ) ] );
        }, this );
    }

} );

module.exports = SettingCollection;
