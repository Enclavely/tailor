/**
 * Tailor.Controls.SelectMulti
 *
 * A select multi control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    SelectMultiControl;

SelectMultiControl = AbstractControl.extend( {
    
    ui : {
        'input' : 'select',
        'mediaButton' : '.js-setting-group .button',
        'defaultButton' : '.js-default',
        'controlGroups' : '.control__body > *'
    },

    events : {
        'change @ui.input' : 'onFieldChange',
        'click @ui.mediaButton' : 'onMediaButtonChange',
        'click @ui.defaultButton' : 'onDefaultButtonChange'
    },

    templateHelpers : {

        selected : function( media, key ) {
            var values = this.values[ media ].split( ',' );
            return -1 !== values.indexOf( key ) ? 'selected' : '';
        }
    },

    /**
     * Initializes the selectize instance(s) and updates the media-query based control groups when the control is rendered.
     *
     * @since 1.7.2
     */
    onRender : function() {
        _.each( this.getValues(), function( value, media ) {
            var $field = this.ui.input.filter( '[name^="' + media + '"]' );

            _.each($field, function(fieldNode) {
                if (fieldNode.id && window['ss_' + fieldNode.id]) {
                    const valueArray = value.split(',');

                    $field.selectize({
                        options: window['ss_' + fieldNode.id].map(function(object) {
                            return {
                                value: object.id,
                                text: object.text,
                                selected: !!valueArray.includes(object.id)
                            }
                        }),
                        items: valueArray,
                        searchField: ['value', 'text']
                    });
                } else {
                    $field.selectize();
                }
            });
        }, this );

        this.updateControlGroups();
    },

    /**
     * Updates the current setting value when a field change occurs.
     *
     * @since 1.7.2
     */
    onFieldChange : function() {
        var $field = this.ui.input.filter( '[name^="' + this.media + '"]' );
        var field = $field.get(0);
        var values = [];
        for ( var i = 0; i < field.length; i ++ ) {
            if ( field[ i ].selected ) {
                values.push( field[ i ].value );
            }
        }
        this.setValue( values.join( ',' ) );
    },

    /**
     * Destroys the selectize instance(s).
     *
     * @since 1.7.2
     */
    onDestroy : function() {
        _.each( this.getValues(), function( value, media ) {
            var $field = this.ui.input.filter( '[name^="' + media + '"]' );
            $field.selectize( 'destroy' );
        }, this );
    }

} );

module.exports = SelectMultiControl;
