/**
 * Tailor.Controls.InputGroup
 *
 * An input group control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    InputGroup;

InputGroup = AbstractControl.extend( {

    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        data.choices = this.model.get( 'choices' );
        data.values = {};
        
        _.each( this.getValues(), function( value, media ) {
            data.values[ media ] = {};
            var values = [];
            if ( _.isString( value ) ) {
                if ( -1 != value.indexOf( ',' ) ) {
                    values = value.split( ',' );
                }
                else {
                    values = value.split( '-' ); // Old format
                }
            }

            var i = 0;
            for ( var choice in data.choices ) {
                if ( data.choices.hasOwnProperty( choice ) ) {
                    data.values[ media ][ choice ] = values[ i ];
                    i ++;
                }
            }
        } );

        return data;
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var fields = this.ui.input.filter( '[name^="' + this.media + '"]' ).serializeArray();
        var values = _.map( fields, function( field ) {
            return field.value;
        } );
        this.setValue( values.join( ',' ) );
    }

} );

module.exports = InputGroup;
