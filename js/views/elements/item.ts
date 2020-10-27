import {VElement} from "../../core/index"
import {TextUtils}  from "../../utils/index"
import {style, state} from "../../sketch"
import {PxSize} from "../../layout/index"
export class Item extends VElement {
     private title: string

    constructor(id: any, pxSize: PxSize, title: string) {
        super(id, pxSize, true)
        this.title = title ? TextUtils.buildDisplayableTitle(title, this.getWidth(), style.text.size.s) : "No title"
    }

    public render(): void {
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
        text(this.title, 0, 0, this.getWidth(), this.getHeight())
    }
}