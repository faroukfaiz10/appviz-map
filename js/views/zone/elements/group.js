class Group extends Element {
    #items
    #maxValue
    #header
    #progressBars
    #color

    constructor(id, width, height, title, items, color, maxValue = 20) {
        super(id, width, height, true)
        this.#color = color
        this.#header = new Header( title, width, 50, style.text.size.m)
        this.#items = items
        this.#maxValue = maxValue

        this.#progressBars = []
        const secondaryStroke = style.text.color.primary
        this.#items.forEach(item => this.#progressBars.push(new ProgressBar(item.frequency, this.#maxValue, this.getWidth() - 90, secondaryStroke)))
    }

    /**
     * @override
     */
    render() {
        //-- background
        this.#renderBackground()

        //-- header
        this.#header.render()
        noStroke()
        fill(this.#color) 
        rect(0, 0, 4, 50)   

        //-- body
        this.#renderItems()
    }

    #renderBackground() {
        fill(state.isHovered(this) 
            ? style.color.front
            : style.color.middle)
        noStroke()
        rect(0, 0, this.getWidth(), this.getHeight())
    }
    
    /*
    *   Render item type:
    *       - Icon
    *       - Item frequency
    *       - Progress bar
    */

    #renderItems() {
        const top = textAscent() + 35
        let positions = []
        for (let i = 0; i < this.#items.length; i++) {
            positions.push(top + (this.getHeight() - top) / (this.#items.length + 1) * (i + 1))
        }
        this.#items.forEach((item, index) => {
            push()
            translate(25, positions[index] + 8)
            new VText(style.getIcon(item.prefix), style.icon.font, style.icon.size.xl).render()
            translate(35, -8)
            this.#progressBars[index].render()
            pop()
        })
    }
}