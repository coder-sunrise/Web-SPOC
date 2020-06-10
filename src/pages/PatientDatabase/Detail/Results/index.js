import React, { PureComponent,Fragment } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import { CardContainer } from '@/components'
import LabTrackingDetails from '@/pages/Widgets/LabTrackingDetails'
import { PATIENT_LAB } from '@/utils/constants'

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

class Results extends PureComponent {

  componentDidMount () {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  resize () {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  render () {

    return (
      <div>
        <CardContainer
          hideHeader
          size='sm'
        >
          <LabTrackingDetails resultType={PATIENT_LAB.PATIENT_PROFILE} />
        </CardContainer>
      </div>
        )
  }
}

export default withStyles(styles, { withTheme: true })(Results)
