import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Scribble, Button } from '@/components'

@connect(({ clinicalnotes }) => ({
  clinicalnotes,
}))

class ScribbleNote extends PureComponent {
  render () {
    const { toggleScribbleModal, clinicalnotes } = this.props
    console.log('******************')
    console.log(this.props)
    return (
      <div>
        <Button
          color='danger'
          onClick={() => 
            this.props.dispatch({
              type: 'clinicalnotes/updateState',
              payload: {
                test: "abc",
              }
            })
          }
        >
          Cancel
        </Button>
      </div>
    )
  }
}

export default ScribbleNote

// <Scribble
//           toggleScribbleModal={toggleScribbleModal}
//         />
