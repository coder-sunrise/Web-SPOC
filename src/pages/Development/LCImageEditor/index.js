import React, { PureComponent, Suspense } from 'react'
import { SketchField, Tools } from '@/components'

// const { SketchField } = rs
console.log(SketchField, Tools)
class ControlTest extends PureComponent {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <SketchField tool='rectangle' />
        {/* <SketchField
          width='1024px'
          height='768px'
          tool={Tools.Pencil}
          lineColor='black'
          lineWidth={3}
        /> */}
        test
      </div>
    )
  }
}

export default ControlTest
