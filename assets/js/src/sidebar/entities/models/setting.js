var SettingModel = Backbone.Model.extend( {

    /**
     * The default parameters for a setting.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
        type : '',
		value : '',
		default : null
	}
} );

module.exports = SettingModel;
