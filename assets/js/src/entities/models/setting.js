/**
 * Tailor.Models.Setting
 *
 * The setting model.
 *
 * @augments Backbone.Model
 */
var SettingModel;

SettingModel = Backbone.Model.extend( {

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