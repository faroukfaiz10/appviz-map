class Item extends Element {
     #title

    constructor(id, width, height, title) {
        super(id, width, height, true)
        this.#title = title ? TextUtils.buildDisplayableTitle(title, width, style.text.size.s) : "No title"
    }

    render() {
        fill(state.isHovered(this) 
            ? style.color.front
            : style.color.middle)
        stroke(255)
        rect(0, 0, this.getWidth(), this.getHeight())
        noStroke()
        fill(style.text.color.primary)
        textSize(style.text.size.s)
        textFont(style.text.font)
        textAlign(CENTER, CENTER)
        text(this.#title, 0, 0, this.getWidth(), this.getHeight())
    }
}