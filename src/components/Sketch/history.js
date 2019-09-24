/**
 * Maintains the history of an object
 */
import { stringify } from 'qs'

class History {
  constructor (undoLimit = 200, debug = false) {
    this.undoLimit = undoLimit
    this.originalList = []
    this.undoList = []
    this.redoList = []
    this.allList = []
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

  getAllList () {
    return this.allList
  }

  getInitializeList (data, count) {
    this.allList = data
    // this.count = count + 1
  }

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
      //   console.log("not equal")
      //   this.redoList = []
      //   this.allList.push({
      //     data: obj,
      //     type: mainObject.type,
      //     sequence: this.count,
      //   })
      //   this.count = this.count + 1
      // } else
      if (mainObject.id === 'delete' || mainObject.id === 'oldTemplate') {
        for (let i = 0; i < this.allList.length; i++) {
          // let [
          //   arrayobject,
          // ] = this.allList[i].layerContent
          let arrayobject = this.allList[i].layerContent
          if (arrayobject === JSON.stringify(mainObject)) {
            let temp = this.allList
            this.allList = []
            for (let a = 0; a < temp.length; a++) {
              // let [
              //   tempArrayObject,
              // ] = temp[a].layerContent
              let tempArrayObject = temp[a].layerContent
              if (tempArrayObject !== JSON.stringify(mainObject)) {
                this.allList.push(temp[a])
              }
            }
          }
        }
      } else {
        this.redoList = []
        this.originalList.push(obj)
        this.allList.push({
          layerType: mainObject.type,
          layerNumber: this.count,
          layerContent: JSON.stringify(mainObject),
          templateFK: null,
        })

        // console.log('********mainObject**************')
        // console.dir(mainObject)
        // console.log({ obj, mainObject })
        // const shallow = { ...mainObject }
        // console.log({ shallow })
        // // console.log('qs', {qs: stringify(mainObject)})
        // window.mainObject = mainObject
        // window.temp = this.allList

        // console.log('**********this.allList************')
        // console.dir(this.allList[0])

        // this.count = this.count + 1
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
      let [
        mainObject,
      ] = this.current
      if (this.current) {
        this.redoList.push(this.current)
        for (let i = 0; i < this.allList.length; i++) {
          if (this.allList[i].layerContent === JSON.stringify(mainObject)) {
            let temp = this.allList
            this.allList = []
            for (let a = 0; a < temp.length; a++) {
              if (temp[a].layerContent !== JSON.stringify(mainObject)) {
                this.allList.push(temp[a])
              }else{
                console.log("skip")
              }
            }
          }
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
        this.allList.push({
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
    this.undoList = []
    this.originalList = []
    this.redoList = []
    this.allList = []
    this.current = null
    this.count = 0
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
