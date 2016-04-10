/**
 * Tailor.Models.Control
 *
 * The control model.
 *
 * @augments Backbone.Model
 */
var ControlModel;

ControlModel = Backbone.Model.extend( {

    /**
     * The default parameters for a control.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
		label : '',
		description : '',
		type : '',
		choices : {},
		priority : 0,
		setting : '',
		value : null,
		section : '' // Only used for controls on the Settings panel
	}
} );

module.exports = ControlModel;