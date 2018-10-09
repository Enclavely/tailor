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
     * Initializes the Select2 instance(s) and updates the media-query based control groups when the control is rendered.
     *
     * @since 1.7.2
     */
    onRender : function() {
        function formatMatchString(string) {
            return string.toLowerCase().replace(/[^\w\s]/gi, '');
        }

        _.each( this.getValues(), function( value, media ) {
            var $field = this.ui.input.filter( '[name^="' + media + '"]' );

            _.each($field, function(fieldNode) {
                if (fieldNode.id && window['ss_' + fieldNode.id]) {
                    var valueArray = value.split(',');

                    $field.select2({
                        data: window['ss_' + fieldNode.id].map(function(object) {
                            return {
                                id: object.id,
                                text: object.text,
                                selected: !!valueArray.includes(object.id)
                            }
                        }),
                        matcher: function(params, data) {
                            if ($.trim(params.term) === '') {
                                return data;
                            }

                            if (typeof data.text === 'undefined') {
                                return null;
                            }

                            var query = formatMatchString(params.term);

                            if (formatMatchString(data.text).indexOf(query) > -1 || formatMatchString(data.id).indexOf(query) > -1) {
                                return data;
                            }

                            return null;
                        }
                    })
                } else {
                    $field.select2();
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
     * Destroys the Select2 instance(s).
     *
     * @since 1.7.2
     */
    onDestroy : function() {
        _.each( this.getValues(), function( value, media ) {
            var $field = this.ui.input.filter( '[name^="' + media + '"]' );
            $field.select2( 'destroy' );
        }, this );
    }

} );

module.exports = SelectMultiControl;
