/**
 * Tailor.Views.TailorCarouselItem
 *
 * Carousel item element view.
 *
 * @class
 */
var ContainerView = require( './../view-container' ),
    CarouselItemView;

CarouselItemView = ContainerView.extend( {

    /**
     * Sets the DOM element ID to the model ID.
     *
     * @since 1.0.0
     */
    onRenderTemplate : function() {
        this.el.draggable = false;
        this.el.id = this.model.cid;
    }

} );

module.exports = CarouselItemView;