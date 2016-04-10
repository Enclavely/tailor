/**
 * Tailor.Models.Panel
 *
 * The panel model.
 *
 * @augments Backbone.Model
 */
var PanelModel;

PanelModel = Backbone.Model.extend( {

    /**
     * The default parameters for a panel.
     *
     * @since 1.0.0
     *
     * @returns object
     */
	defaults: {
		id : '',
		title : '',
		description : '',
		collection : '',
		priority : 0
	}
} );

module.exports = PanelModel;