import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import Yup from '@/utils/yup'
import Refresh from '@material-ui/icons/Refresh'
import moment from 'moment'
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
  withFormikExtend,
  Tooltip,
  RichEditor,
} from '@/components'
import { withStyles, TextField } from '@material-ui/core'
// import model from './models'
import PatientNurseNotesContent from './content'

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

// window.g_app.replaceModel(model)

@connect(({ patient, user, patientNurseNotes }) => ({
  patient,
  patientNurseNotes,
  user,
}))
@withFormikExtend({
  authority: ['patientdatabase.patientprofiledetails'],
  enableReinitialize: true,
  mapPropsToValues: ({ patient, patientNurseNotes }) => {
    // console.log('mapPropsToValues', patientNurseNotes)
    const { entity = {} } = patientNurseNotes
    return {
      patientProfileFK: patient.entity.id,
      ...entity,
    }
  },
  validationSchema: Yup.object().shape({}),

  handleSubmit: async (values, component) => {
    const { props, resetForm } = component
    const { dispatch, history, patient, onConfirm } = props

    const { id } = values
    const isEdit = id !== undefined && id > 0
    const response = await dispatch({
      type: 'patientNurseNotes/upsert',
      payload: { ...values },
    })

    const refreshResult = await dispatch({
      type: 'patientNurseNotes/query',
      payload: {
        PatientProfileFK: patient.entity.id,
        pagesize: 999,
        sorting: [{ columnName: 'createDate', direction: 'desc' }],
      },
    })

    if (refreshResult && refreshResult.data) {
      const { data = [] } = refreshResult
      const editingId = isEdit ? id : response.id
      const editEntity = data.find(f => f.id === editingId)
      dispatch({
        type: 'patientNurseNotes/updateState',
        payload: { entity: editEntity },
      })
    }
  },
  displayName: 'PatientNurseNotes',
})
class PatientNurseNotes extends PureComponent {
  constructor(props) {
    super(props)
    this.divElement = React.createRef()
    this.hisoryElement = React.createRef()
  }

  componentDidMount() {
    this.refreshNurseNotes()
    window.addEventListener('resize', this.resize.bind(this))
    // this.resize()

    setTimeout(() => {
      this.resize()
    }, 10)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
    const { dispatch } = this.props
    dispatch({
      type: 'patientNurseNotes/updateState',
      payload: {
        entity: {},
      },
    })
  }

  refreshNurseNotes = async () => {
    const { dispatch, patient } = this.props
    const refreshResult = await dispatch({
      type: 'patientNurseNotes/query',
      payload: {
        PatientProfileFK: patient.entity.id,
        pagesize: 999,
        sorting: [{ columnName: 'createDate', direction: 'desc' }],
      },
    })
    return refreshResult
  }

  // eslint-disable-next-line react/sort-comp
  resize() {
    if (
      this.divElement &&
      this.divElement.current &&
      this.hisoryElement &&
      this.hisoryElement.current
    ) {
      const hisotoryHeight = $(this.hisoryElement.current).find('div')[0]
        .clientHeight
      let currentBox = $(this.divElement.current).find('.rdw-editor-main')[0]
      if (currentBox)
        currentBox.style.cssText = `height:${hisotoryHeight - 75}px`
    }
  }

  handleEdit = entity => {
    const { dispatch, setFieldValue } = this.props

    dispatch({
      type: 'patientNurseNotes/updateState',
      payload: {
        entity,
      },
    })

    setFieldValue('notes', entity.notes || '')
    let currentBox = $(this.divElement.current).find('.rdw-editor-main')[0]
    if (currentBox) currentBox.click()
  }

  onEditorChange = v => {
    const { dispatch, setFieldValue } = this.props
    setFieldValue('notes', v || '')
  }

  render() {
    const {
      dispatch,
      patientNurseNotes: { entity, list = [] },
      user,
    } = this.props
    const { clinicianProfile } = user.data

    return (
      <GridContainer>
        <GridItem md={8}>
          <GridContainer>
            <GridItem md={12}>
              <div ref={this.hisoryElement}>
                <CardContainer
                  md={12}
                  hideHeader
                  title='History'
                  style={{
                    height: 'calc(100vh - 305px)',
                  }}
                >
                  <div
                    style={{
                      height: 'calc(100vh - 330px)',
                      marginTop: '15px',
                      overflow: 'scroll',
                    }}
                  >
                    {list.map(i => {
                      const { createDate, createByUserFK } = i
                      const canEdit =
                        clinicianProfile.userProfileFK === createByUserFK &&
                        moment(createDate)
                          .utc()
                          .formatUTC(true) === moment().formatUTC(true)
                      return (
                        <PatientNurseNotesContent
                          entity={i}
                          dispatch={dispatch}
                          canEdit={canEdit}
                          handleEdit={this.handleEdit}
                        />
                      )
                    })}
                  </div>
                </CardContainer>
              </div>
            </GridItem>
            <GridItem md={6} style={{ textAlign: 'left', fontWeight: 'bold' }}>
              <span>Total: {list.length} Records</span>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem md={4}>
          <GridContainer>
            <GridItem md={12}>
              <CardContainer
                hideHeader
                title='Current'
                style={{
                  height: 'calc(100vh - 305px)',
                }}
              >
                <GridItem md={12}>
                  <Field
                    name='notes'
                    render={args => {
                      return (
                        <div ref={this.divElement}>
                          <RichEditor
                            strongLabel
                            autoFocus
                            onBlur={this.onEditorChange}
                            {...args}
                          />
                        </div>
                      )
                    }}
                  />
                </GridItem>
              </CardContainer>
            </GridItem>

            <GridItem md={12} style={{ textAlign: 'end' }}>
              <Button color='primary' onClick={this.props.handleSubmit}>
                Save
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientNurseNotes)
