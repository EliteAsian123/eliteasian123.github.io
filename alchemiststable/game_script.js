$.widget("custom.item", {
	options: {
		itemId: 0
	},
	
    _create: function() {
        this.element.attr("src", items[this.options.itemId].img);
		this.element.draggable({stack: ".item", revert: "invalid"});
    }
});

$(".item").each(function() {
	$(this).item();
});

$("#backpack").droppable();