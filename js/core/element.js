/**
 * Element displayed on the map.
 * 
 * An element is 
 *  - displayed in a layer by the 'render' method.
 *  - a bounding box
 *  - selectable -or not-
 * 
 * An element has 
 * - an id
 * - a width
 * - a height
 *  
 * An element must
 * - define a rendering method
 * - not depend each other
 * 
 * An element can
 *  - define a specific 'contains' method to handle a specific shape  
 */
class Element {
  #id
  #width
  #height
  #selectable
 
  /**
   * @constructor
   * 
   * @param {*} id 
   * @param {number} width 
   * @param {number} height 
   * @param {boolean} selectable 
   */
  constructor (id, width, height, selectable){
    this.#id = id
    this.#width = width
    this.#height = height
    this.#selectable = selectable
  }

  /**
   * @returns {*} id
   */
  getId(){
    return this.#id
  }

  /**
   * @returns {number} width
   */
  getWidth(){
    return this.#width
  }

  /**
   * @returns {number} height
   */
  getHeight(){
    return this.#height
  }

  /**
   * @returns {boolean} if the element is selectable
   */
  isSelectable(){
    return this.#selectable
  }
  
  /**
   * This method MUST be overridden
   * This defines how the elemnt is rendererd inside a layer.
   */
  render() {
    throw 'render method MUST be overridden'
  }

  /**
   * This method CAN be overridden
   * 
   * @param {number} x 
   * @param {number} y 
   * @returns {boolean} if the element contains the point (x, y)
   */
  contains(x, y) {
    return x > 0
        && x < this.#width
        && y > 0
        && y < this.#height
  }
}
