/**
 * Tailor.Collections.Panel
 *
 * The panel collection.
 *
 * @augments Backbone.Collection
 */
var $ = Backbone.$,
	PanelCollection;

PanelCollection = Backbone.Collection.extend( {
	model : require( '../models/panel' )
} );

module.exports = PanelCollection;