/**
 * Tailor.Controls.Text
 *
 * A text control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    TextControl;

TextControl = AbstractControl.extend( {
    
    templateHelpers : {

        /**
         * Returns the attributes for the control.
         *
         * @since 1.0.0
         *
         * @returns {string}
         */
        inputAttrs : function() {
            var atts = '';
            _.each( this.attrs, function( value, attr ) {
                atts += ( attr + '="' + value + '"' );
            } );
            return atts;
        }
    },
    
    /**
     * Provides additional data to the template rendering function.
     *
     * @since 1.7.2
     *
     * @returns {*}
     */
    addSerializedData : function( data ) {
        data.attrs = this.model.get( 'input_attrs' );
        return data;
    }
    
} );

module.exports = TextControl;
