/**
 * Tailor.Controls.Range
 *
 * A range control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    RangeControl;

RangeControl = AbstractControl.extend( {
    
    ui : {
        'range' : 'input[type=range]',
        'input' : 'input[type=text]',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'input @ui.range' : 'onFieldChange',
        'blur @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

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
    },
    
    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function( e ) {
        var value = e.target.value;
        this.ui.input.filter( '[name^="' + this.media + '"]' ).val( value );
        this.ui.range.filter( '[name^="' + this.media + '"]' ).val( value );
        this.setValue( value );
    }

} );

module.exports = RangeControl;
