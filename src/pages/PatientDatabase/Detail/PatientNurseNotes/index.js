import React, { PureComponent, Component } from 'react'
import connect from 'dva'
import $ from 'jquery'

// models
// utils

import {
  GridContainer,
  GridItem,
  CardContainer,
  Card,
  Button,
  notification,
  FastField,
  Field,
  OutlinedTextField,
} from '@/components'
import { withStyles, TextField } from '@material-ui/core'
import model from './models'
import PatientNurseNotesContent from './content'

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

window.g_app.replaceModel(model)

@connect(({ patient }) => ({
  patient,
}))
class PatientNurseNotes extends Component {
  constructor (props) {
    super(props)
    this.divElement = React.createRef()
    this.hisoryElement = React.createRef()
  }

  componentDidMount () {
    console.log('componentDidMount')
    this.props.dispatch({
      type: 'patientNurseNotes/query',
      payload: {
        PatientProfileFK: 1,
      },
    })
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  resize () {
    if (
      this.divElement &&
      this.divElement.current &&
      this.hisoryElement &&
      this.hisoryElement.current
    ) {
      const hisotoryHeight = $(this.hisoryElement.current).find('div')[0]
        .clientHeight
      // console.log($(this.divElement.current).find('textarea[name=Notes]'))
      let currentTextArea = $(this.divElement.current).find(
        'textarea[name=Notes]',
      )[0]

      currentTextArea.style.cssText = `height:${hisotoryHeight - 45}px`
    }
  }

  render () {
    setTimeout(() => {
      this.resize()
    }, 100)

    return (
      <div ref={this.divElement}>
        <GridContainer>
          <GridItem md={8}>
            {/* <GridItem md={12}>
            <h4>History</h4>
          </GridItem> */}
            <div ref={this.hisoryElement}>
              <CardContainer
                md={12}
                hideHeader
                title='History'
                style={{
                  height: 'calc(100vh - 220px)',
                }}
              >
                <PatientNurseNotesContent />
              </CardContainer>
            </div>
          </GridItem>
          <GridItem md={4}>
            <Field
              name='Notes'
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Current'
                    multiline
                    rowsMax={2}
                    rows={2}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientNurseNotes)
