var ControlModel = Backbone.Model.extend( {

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
		section : '' // Only used for controls on the Settings panel
	}
} );

module.exports = ControlModel;
