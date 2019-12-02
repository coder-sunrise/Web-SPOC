/**
 * Maintains the history of an object
 */

class History {
  constructor (undoLimit = 200, debug = false) {
    this.undoLimit = undoLimit
    this.originalList = []
    this.undoList = []
    this.redoList = []
    this.tempUndoList = []
    this.saveLayerList = []
    this.current = null
    this.debug = debug
    this.count = 0
    this.templateId = ''
    this.undoNotAllowIndex = ''
  }

  /**
   * Get the limit of undo/redo actions
   *
   * @returns {number|*} the undo limit, as it is configured when constructing the history instance
   */
  getUndoLimit () {
    return this.undoLimit
  }

  /**
   * Get Current state
   *
   * @returns {null|*}
   */
  getCurrent () {
    return this.current
  }

  /*
  Get all list
*/

  getOriginalList () {
    return this.originalList
  }

  getSaveLayerList () {
    return this.saveLayerList
  }

  // getInitializeList (data) {
  //   this.allList = data
  // }

  updateCount (count, id) {
    this.count = count
    this.templateId = id
  }

  /**
   * Keep an object to history
   *
   * This method will set the object as current value and will push the previous "current" object to the undo history
   *
   * @param obj
   */
  keep (obj) {
    try {
      let [
        mainObject,
      ] = obj

      if (mainObject.id === 'delete' || mainObject.id === 'oldTemplate') {
        for (let i = 0; i < this.saveLayerList.length; i++) {
          let arrayobject = this.saveLayerList[i].layerContent
          if (arrayobject === JSON.stringify(mainObject)) {
            let temp = this.saveLayerList
            this.saveLayerList = []
            for (let a = 0; a < temp.length; a++) {
              let tempArrayObject = temp[a].layerContent
              if (tempArrayObject !== JSON.stringify(mainObject)) {
                this.saveLayerList.push(temp[a])
              }
            }
          }
        }
      } else if (mainObject.id === 'move') {
        const movingObject = JSON.stringify(mainObject.__originalState)
        const movingJsonObject = JSON.parse(movingObject)

        delete movingJsonObject.left
        delete movingJsonObject.top
        delete movingJsonObject.scaleX
        delete movingJsonObject.scaleY
        delete movingJsonObject.top
        delete movingJsonObject.left
        delete movingJsonObject.height
        delete movingJsonObject.width
        delete movingJsonObject.text
        delete movingJsonObject.angle

        for (let i = 0; i < this.saveLayerList.length; i++) {
          const layerContent = JSON.parse(this.saveLayerList[i].layerContent)
          delete layerContent.left
          delete layerContent.top
          delete layerContent.scaleX
          delete layerContent.scaleY
          delete layerContent.top
          delete layerContent.left
          delete layerContent.height
          delete layerContent.width
          delete layerContent.text
          delete layerContent.angle

          if (
            JSON.stringify(movingJsonObject) === JSON.stringify(layerContent)
          ) {
            this.saveLayerList[i].layerContent = movingObject
          }
        }
      } else if (mainObject.id !== 'pan' || mainObject.id === null) {
        // this.redoList = []

        this.originalList.push(obj)
        this.saveLayerList.push({
          layerType: mainObject.type,
          layerNumber: this.count,
          layerContent: JSON.stringify(mainObject),
          templateFK: this.templateId,
        })
        this.templateId = ''
        this.count = 0
      }

      if (this.current) {
        this.undoList.push(this.current)
      }
      if (this.undoList.length > this.undoLimit) {
        this.undoList.shift()
      }
      this.current = obj
    } finally {
      this.print()
    }
  }

  /**
   * Undo the last object, this operation will set the current object to one step back in time
   *
   * @returns the new current value after the undo operation, else null if no undo operation was possible
   */
  undo () {
    try {
      if (this.current) {
        this.redoList.push(this.current)

        if (this.redoList.length > this.undoLimit) {
          this.redoList.shift()
        }
        if (this.undoList.length === 0) this.current = null
      }
      if (this.undoList.length > 0) {
        this.current = this.undoList.pop()
        return this.current
      }

      return null
    } finally {
      this.print()
    }
  }

  /**
   * Redo the last object, redo happens only if no keep operations have been performed
   *
   * @returns the new current value after the redo operation, or null if no redo operation was possible
   */
  redo () {
    try {
      if (this.redoList.length > 0) {
        if (this.current) this.undoList.push(this.current)
        this.current = this.redoList.pop()

        return this.current
      }
      return null
    } finally {
      this.print()
    }
  }

  /**
   * Checks whether we can perform a redo operation
   *
   * @returns {boolean}
   */
  canRedo () {
    return this.redoList.length > 0
  }

  /**
   * Checks whether we can perform an undo operation
   *
   * @returns {boolean}
   */
  canUndo () {
    let result = ''
    if (this.undoList.length === this.undoNotAllowIndex) {
      result = false
    }
    return result === ''
      ? this.undoList.length > 0 || this.current !== null
      : result
  }

  /**
   * Clears the history maintained, can be undone
   */
  reset () {
    this.undoNotAllowIndex = this.undoList.length
    this.redoList = []
    this.count = 0
  }

  clear () {
    this.undoNotAllowIndex = ''
    for (let i = 0; i < this.undoList.length; i++) {
      let [
        undoObj,
      ] = this.undoList[i]

      undoObj.__removed = true
      undoObj.set({
        removeObject: true,
      })
    }

    let [
      originalObj,
    ] = this.originalList[this.originalList.length - 1]

    originalObj.__removed = true
    originalObj.set({
      removeObject: true,
    })

    this.current = this.originalList[this.originalList.length - 1]

    this.redoList = []
    this.print()
  }

  print () {
    if (this.debug) {
      /* eslint-disable no-console */
      console.log(this.undoList, this.current, this.redoList.slice(0).reverse())
    }
  }
}

export default History
