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
        if ( this.settings ) {
            this.each( function( model ) {
                var setting = this.settings.findWhere( { id : model.get( 'setting' ) } );
                if ( setting ) {
                    model.setting = setting;
                }
            }, this );
        }
    }

} );

module.exports = ControlCollection;
