import "p5"
import {} from "p5/global"

import Style from "./core/style"
import State from "./core/state"
import MapBuilder from "./core/mapBuilder"
import LayerBuilder from "./core/layerBuilder"

import Detail from "./detail"

import ModelRepositoryBuilder from "./model/modelRepositoryBuilder"

import Projection from "./layout/projection"
import PxSize from "./layout/pxSize"

import HomeView from "./views/homeView"
import TechZoneView from "./views/techZoneView"
import DemoView from "./views/demoView"
import TechGroupView from "./views/techGroupView"
import Group from "./views/elements/group"
import Item from "./views/elements/item"
import Background from "./views/elements/background"
import ModelRepository from "./model/modelRepository"
import Map from "./core/map"

// import TextUtils from "./utils/textutils"
import {ViewParams} from "./types/types"
import VElement from "./core/element"
import View from "./views/view"

let style: Style
const detail = new Detail()
const state = new State()

let vizMap : Map
let modelRepositoryBuilder : ModelRepositoryBuilder
let modelRepository : ModelRepository
let canvasHeight : number
let canvasWidth : number
let currentViewName : string
let currentViewParams : ViewParams
let projection : Projection 
let layout : any

// Add methods to Window interface
declare global {
    interface Window { 
      preload: any,
      setup: any,
      draw: any,
      switchView: any
     }
}

window.preload = preload
window.setup = setup
window.draw = draw
window.switchView = switchView
window.mouseClicked = mouseClicked
window.windowResized = windowResized

function preload() {
  style = new Style()
  canvasHeight = windowHeight
  canvasWidth = windowWidth * 0.75
  modelRepositoryBuilder = new ModelRepositoryBuilder("/data/notebook.json", "/data/config.json")
  layout = loadJSON("/js/views/layout.json")
  projection = new Projection(new PxSize(canvasWidth, canvasHeight))
  style.load()
}

function setup() {
  let myCanvas = createCanvas(canvasWidth, canvasHeight)
  myCanvas.parent('myContainer')
  angleMode(DEGREES)
  modelRepository = modelRepositoryBuilder.build()
  // go to home
  switchView("home")
}

function draw() {
  const element = vizMap.findElement(mouseX, mouseY)
  state.hover(element)
  cursor(element != null ? "pointer" : "default")
  if (state.isActive()) {
    vizMap.render()
  }
}
function mouseClicked() {
  if (vizMap){
    const element = vizMap.findElement(mouseX, mouseY)
    if (element){
      state.select(element)
      updateDetail(element)
    }
  }
}

function windowResized() {
  canvasHeight = windowHeight
  canvasWidth = windowWidth * 0.75
  resizeCanvas(canvasWidth, canvasHeight)
  projection = new Projection(new PxSize(canvasWidth, canvasHeight))
  //
  const view = selectView(currentViewName, currentViewParams)
  vizMap = generateMapFromView(view)
  state.reset()
}

/**
 * @param {?VElement} element
 * 
 * Update the detail Panel  
 */
function updateDetail(element: VElement) {
  if (element instanceof Group || element instanceof Item) {
    detail.update(element instanceof Group ? 'group' : 'item', element.getId())
  }
}

function switchView(viewName: string, viewParams?: ViewParams) {
  const hasChanged = (currentViewName !== viewName) || (currentViewParams!==viewParams)
  //--
  currentViewName = viewName
  currentViewParams = viewParams ?? currentViewParams
  //--
  if (hasChanged) {
    const view = selectView(viewName, viewParams)
    vizMap = generateMapFromView(view)
    state.reset()
  }
}

/**
 * @param {string} viewName 
 * @param {Object} viewParams 
 * @return {View}
 */
function selectView(viewName: string, viewParams?: ViewParams) {
  // const clazzName = TextUtils.firstCharUpperCase(viewName)+'View'
  // const jsonParams = JSON.stringify(viewParams)
  // const expression = `new ${clazzName} (${jsonParams} )` 
  // return  eval(expression);
  switch(viewName){
    case "home":
      return new HomeView()
    case "techZone":
      return new TechZoneView()
    case "techGroup":
      if (viewParams){
        return new TechGroupView(viewParams)
      } // Else throw error ?
    default:
      return new DemoView()
  }
}

function generateMapFromView(viewInstance: View) {
  return new MapBuilder()
    .addLayer(new LayerBuilder().addElement(new Background("background", new PxSize(0,0), false)).build())
    .addLayers(viewInstance.provideLayers(modelRepository, layout))
    //.addLayers(new LayerBuilder().addElement(new Grid(-1, projection.getPxSize(), "12", "12")).build())
    .build()
}


export {style, state, detail, projection}