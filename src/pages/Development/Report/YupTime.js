import * as Yup from 'yup'
import moment from 'moment'

const DateSchema = Yup.date

class TimeSchemaType extends DateSchema {
  constructor () {
    super()
    this._validFormats = []

    this.withMutation(() => {
      this.transform(function (value, originalValue) {
        if (this.isType(value))
          // we have a valid value
          return value
        return moment(originalValue, this._validFormats, true)
      })
    })
  }

  _typeCheck (value) {
    return (
      super._typeCheck(value) || (moment.isMoment(value) && value.isValid())
    )
  }

  format (formats) {
    if (!formats) throw new Error('must enter a valid format')
    let next = this.clone()
    next._validFormats = {}.concat(formats)
  }
}

export default TimeSchemaType
