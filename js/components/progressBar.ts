import * as p5 from "p5"
import {Component}  from "./component"
import {style} from "../sketch"
import {VText} from "./vtext"
import {AnimationUtils} from "../utils"

export class ProgressBar implements Component{
    private value: number
    private maxValue: number
    private width: number
    private color: p5.Color
    private vtext: VText

    constructor(value: number, maxValue: number, width: number, color: p5.Color) {
        this.value = value
        this.maxValue = maxValue
        this.width = width
        this.color = color
        this.vtext = new VText("", style.text.font, style.text.size.s)
        const duration = 300 /*ms*/
        AnimationUtils.animate(0, value, duration, s => this.value = s)
    }
    
    public render(): void {
        const weight: number = 8
        this.vtext.setText(Math.floor(this.value).toString())
        this.vtext.render() 
        push()
        translate(20, (-textAscent() + weight) / 2 )
        this.renderBar(weight);
        pop()
    }

    private renderBar(weight: number): void{
        strokeJoin(ROUND)
        
        strokeWeight(weight)
        stroke(style.color.front)
        line(0, 0, this.width, 0)
        
        stroke(this.color)
        const size = this.value * this.width / this.maxValue  
        line(0, 0, size, 0)
    }
}