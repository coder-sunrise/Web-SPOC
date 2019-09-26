import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Scribble, Button } from '@/components'
import model from './models'

window.g_app.replaceModel(model)

@connect(({ scriblenotes}) => ({
   scriblenotes,
}))

class ScribbleNote extends PureComponent {
  
  render () {
    return (
      <div>
        <Scribble {...this.props} />
      </div>
    )
  }
}

export default ScribbleNote

// import React, { PureComponent } from 'react'
// import { connect } from 'dva'
// import { Scribble, Button } from '@/components'

// @connect(({ clinicalnotes }) => ({
//   clinicalnotes,
// }))

// class ScribbleNote extends PureComponent {
//   render () {
//     const { toggleScribbleModal, clinicalnotes } = this.props
//     return (
//       <div>
//         <Button
//           color='danger'
//           onClick={() =>
//             this.props.dispatch({
//               type: 'clinicalnotes/updateState',
//               payload: {
//                 clinicNote: {
//                   test: "values.subject",
//                   subject: "values.subject",
//                 },
//                 temp: "hello",
//               },
//             })}
//         >
//           Cancel
//         </Button>
//       </div>
//     )
//   }
// }

// export default ScribbleNote
