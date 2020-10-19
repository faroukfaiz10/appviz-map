class Card extends Element {
    #header

    constructor(id, pxSize, title) {
        super(id, pxSize.getWidth(), pxSize.getHeight(), false)
        this.#header = new Header(title, this.getWidth(), 100,style.text.size.xxl)
    }

    /**
     * @override
     */
    render() {
        this.#renderBackground()
        this.#header.render()
    }

    #renderBackground() {
        noStroke()
        noFill()
        rect(0, 0, this.getWidth(), this.getHeight())
    }
}