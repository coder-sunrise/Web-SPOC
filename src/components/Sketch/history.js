/**
 * Maintains the history of an object
 */

class History {
  constructor (undoLimit = 200, debug = false) {
    this.undoLimit = undoLimit
    this.originalList = []
    this.undoList = []
    this.redoList = []
    this.saveLayerList = []
    this.current = null
    this.debug = debug
    this.count = 0
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

  updateCount (count) {
    this.count = count
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
      // if (mainObject.id !== 'delete' && mainObject.id !== 'oldTemplate') {
      //   this.redoList = []
      //   this.allList.push({
      //     data: obj,
      //     type: mainObject.type,
      //     sequence: this.count,
      //   })
      //   this.count = this.count + 1
      // } else

      if (mainObject.id === 'delete' || mainObject.id === 'oldTemplate') {
        for (let i = 0; i < this.saveLayerList.length; i++) {
          // let [
          //   arrayobject,
          // ] = this.allList[i].layerContent
          let arrayobject = this.saveLayerList[i].layerContent
          if (arrayobject === JSON.stringify(mainObject)) {
            let temp = this.saveLayerList
            this.saveLayerList = []
            for (let a = 0; a < temp.length; a++) {
              // let [
              //   tempArrayObject,
              // ] = temp[a].layerContent
              let tempArrayObject = temp[a].layerContent
              if (tempArrayObject !== JSON.stringify(mainObject)) {
                this.saveLayerList.push(temp[a])
              }
            }
          }
        }
      }else if(mainObject.id === 'move'){
        let movingObject = JSON.stringify(mainObject.__originalState)
        let movingJsonObject = JSON.parse(movingObject)
        delete movingJsonObject.left
        delete movingJsonObject.top
        delete movingJsonObject.scaleX
        delete movingJsonObject.scaleY


        for(let i = 0; i < this.saveLayerList.length; i++){
          let layerContent = JSON.parse(this.saveLayerList[i].layerContent)
          delete layerContent.left
          delete layerContent.top
          delete layerContent.scaleX
          delete layerContent.scaleY

          if(JSON.stringify(movingJsonObject) === JSON.stringify(layerContent)){
            this.saveLayerList[i].layerContent = movingObject
          }

        }

      } else if (mainObject.id !== 'pan' || mainObject.id === null){
          this.redoList = []
          this.originalList.push(obj)
          this.saveLayerList.push({
            layerType: mainObject.type,
            layerNumber: this.count,
            layerContent: JSON.stringify(mainObject),
            templateFK: null,
          })
   
          this.count = 0
          console.log("********* ", this.originalList)
          console.log("******** " , this.saveLayerList)
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
      let [
        mainObject,
      ] = this.current
      if (this.current) {
        this.redoList.push(this.current)
        for (let i = 0; i < this.saveLayerList.length; i++) {
          if (this.saveLayerList[i].layerContent === JSON.stringify(mainObject)) {
            let temp = this.saveLayerList
            this.saveLayerList = []
            for (let a = 0; a < temp.length; a++) {
              if (temp[a].layerContent !== JSON.stringify(mainObject)) {
                this.saveLayerList.push(temp[a])
              }
            }
          }
        }

        if(this.saveLayerList === []){
          this.saveLayerList.push({
            layerType: mainObject.type,
            layerNumber: this.count,
            layerContent: JSON.stringify(mainObject),
            templateFK: null,
          })
        }

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
        let [
          mainObject,
        ] = this.current
        this.saveLayerList.push({
          layerType: mainObject.type,
          layerNumber: this.count,
          layerContent: JSON.stringify(mainObject),
          templateFK: null,
        })
        this.count = 0
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
    return this.undoList.length > 0 || this.current !== null
  }

  /**
   * Clears the history maintained, can be undone
   */
  clear () {
    // this.undoList = []
    for(let i = 0 ; i < this.undoList.length ; i++){
      let [
        undoObj,
      ] = this.undoList[i]

      undoObj.__removed = true
    }

    let [
      originalObj,
    ] = this.originalList[this.originalList.length - 1]


    originalObj.__removed = true    

    this.current = this.originalList[this.originalList.length - 1]
    this.originalList = []
    this.redoList = []
    this.saveLayerList = []
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
