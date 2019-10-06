class UI {
    constructor(width, height) {
        this.components = [];
        this.width = width;
        this.height = height;
    }

    add(component) {
        this.components.push(component);
    }

    clear() {
        this.components = [];
    }

    renderAll(uiContext) {
        for (var i of this.components) {
            i.render(uiContext);
        }
    }

    clickAll(pos) {
        for (var i of this.components) {
            if (pos.x > i.x && pos.x < i.x + i.w * 4 && pos.y < i.y + i.h * 4 && pos.y > i.y) {
                i.click();
            }
        }
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    isEmpty() {
        return this.components.length === 0 ? true : false;
    }
}

class UIComponent {
    constructor(x, y, w, h, anchor) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.x = anchor.passX(this.x, this.w);
        this.y = anchor.passY(this.y, this.h);
    }

    render(uiContext) {}

    click() {}

    copyValue() {}
}

class UIImage extends UIComponent {
    constructor(x, y, w, h, anchor, path) {
        super(x, y, w, h, anchor);
        this.path = path;
    }

    render(uiContext) {
        var img = new Image();
        img.src = this.path;
        uiContext.drawImage(img, this.x, this.y, this.w * 4, this.h * 4);
    }
}

class UIButton extends UIImage {
    constructor(x, y, w, h, anchor, path, func) {
        super(x, y, w, h, anchor, path);
        this.func = func;
    }

    click() {
        this.func();
    }
}

class UIItemSlot extends UIComponent {
    constructor(x, y, w, h, anchor, f_getItem, f_getCount, f_setItem, f_setCount) {
        super(x, y, w, h, anchor);
        this.item = null;
        this.count = 0;
        this.f_getItem = f_getItem;
        this.f_getCount = f_getCount;
        this.f_setItem = f_setItem;
        this.f_setCount = f_setCount;
    }

    render(uiContext) {
        this.item = this.f_getItem();
        this.count = this.f_getCount();
        if (this.item !== null) {
            var img = items[this.item].texture;
            uiContext.drawImage(img, this.x, this.y, this.w * 4, this.h * 4);
        }

        if (this.count > 1) {
            if (this.count < 10) {
                uiContext.drawImage(numbersImage, ((this.count - Math.floor(this.count / 10) * 10) * 3), 0, 3, 6, this.x, this.y, 3 * 4, 6 * 4);
            } else {
                uiContext.drawImage(numbersImage, (Math.floor(this.count / 10) * 3), 0, 3, 6, this.x, this.y, 3 * 4, 6 * 4);
                uiContext.drawImage(numbersImage, ((this.count - Math.floor(this.count / 10) * 10) * 3), 0, 3, 6, this.x + 16, this.y, 3 * 4, 6 * 4);
            }
        }
    }

    click() {
        if (heldItem === null) {
            heldItem = this.f_getItem();
            heldItemCount = this.f_getCount();
            this.f_setItem(null);
            this.f_setCount(0);
        } else {
            if (this.f_getItem() === null) {
                this.f_setItem(heldItem);
                this.f_setCount(heldItemCount);
                heldItem = null;
                heldItemCount = 0;
            } else {
                if (this.f_getItem() === heldItem) {
                    var finishingAmount = this.f_getCount() + heldItemCount;
                    if (finishingAmount > 99) {
                        this.f_setCount(99);
                        heldItemCount = finishingAmount - 99;
                    } else {
                        this.f_setCount(finishingAmount);
                        heldItem = null;
                        heldItemCount = 0;
                    }
                } else {
                    var temp1 = heldItem;
                    var temp2 = heldItemCount;
                    heldItem = this.f_getItem();
                    heldItemCount = this.f_getCount();
                    this.f_setItem(temp1);
                    this.f_setCount(temp2);
                }
            }
        }
    }
}

class UIItemTrash extends UIComponent {
    constructor(x, y, w, h, anchor) {
        super(x, y, w, h, anchor);
    }

    click() {
        heldItem = null;
        heldItemCount = 0;
    }
}

class Anchor {
    constructor(ui) {
        this.width = ui.width;
        this.height = ui.height;
    }

    passX(x, w) {
        return x;
    }
    
    passY(y, h) {
        return y;
    }
}

class AnchorCenter extends Anchor {
    constructor(width, height) {
        super(width, height);
    }

    passX(x, w) {
        return (this.width / 2) - (w * 4 / 2) + x * 4;
    }

    passY(y, h) {
        return (this.height / 2) - (h * 4 / 2) + y * 4;
    }
}