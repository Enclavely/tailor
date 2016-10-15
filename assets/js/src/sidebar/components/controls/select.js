/**
 * Tailor.Controls.Select
 *
 * A select control.
 *
 * @augments Marionette.ItemView
 */
var AbstractControl = require( './abstract-control' ),
    SelectControl;

SelectControl = AbstractControl.extend( {

    ui : {
        'input' : 'select',
        'default' : '.js-default'
    },

    templateHelpers : {

        /**
         * Returns "selected" if the current choice is the selected one.
         *
         * @since 1.0.0
         *
         * @param choice
         * @returns {string}
         */
        selected : function( choice ) {
            return this.value == choice ? 'selected' : '';
        }
    },

    /**
     * Adds the required event listeners.
     *
     * @since 1.0.0
     */
    addEventListeners : function() {
        this.listenTo( this.model.setting, 'change', this.render );
        this.listenTo( this.model.setting.collection, 'change', this.checkDependencies );
    }

} );

module.exports = SelectControl;
