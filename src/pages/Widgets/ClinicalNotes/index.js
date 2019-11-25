import React, { PureComponent, Component } from 'react'
import { FieldArray } from 'formik'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
import IconButton from '@material-ui/core/IconButton'
import InsertPhoto from '@material-ui/icons/InsertPhoto'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Yup from '@/utils/yup'
import {
  RichEditor,
  withFormikExtend,
  FastField,
  CommonModal,
  Button,
  Field,
  GridContainer,
  GridItem,
  ScribbleNoteItem,
  TextField,
} from '@/components'
import { Attachment } from '@/components/_medisys'
import UploadAttachment from './UploadAttachment'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'
import model from './models'
import {
  errMsgForOutOfRange as errMsg,
  navigateDirtyCheck,
} from '@/utils/utils'

let size = 0

const styles = (theme) => ({
  editor: {
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    zIndex: 1,
    left: 305,
    right: 0,
    top: 25,
  },
  linkBtn: {
    position: 'absolute',
    zIndex: 1,
    left: 410,
    right: 0,
    top: 25,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    // transform: 'translateZ(0)',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',

    backgroundColor: theme.palette.background.paper,
  },
})

window.g_app.replaceModel(model)

// @withFormikExtend({
//   mapPropsToValues: ({ clinicalnotes }) => {
//     return clinicalnotes.entity || clinicalnotes.default
//   },
//   validationSchema: Yup.object().shape({
//     type: Yup.string().required(),
//     to: Yup.string().when('type', {
//       is: (val) => val !== '2',
//       then: Yup.string().required(),
//     }),
//     from: Yup.string().required(),
//     date: Yup.date().required(),
//     subject: Yup.string().required(),

//     // 3->MC

//     days: Yup.number().when('type', {
//       is: (val) => val === '3',
//       then: Yup.number().required(),
//     }),
//     fromto: Yup.array().when('type', {
//       is: (val) => val === '3',
//       then: Yup.array().of(Yup.date()).min(2).required(),
//     }),
//   }),

//   handleSubmit: () => {},
//   displayName: 'WidgetClinicalNotes',
// })
@connect(
  ({ clinicalnotes, scriblenotes, consultation, visitRegistration }) => ({
    clinicalnotes,
    scriblenotes,
    consultation,
    visitRegistration,
  }),
)
class ClinicalNotes extends Component {
  state = {
    test: this.props.clinicalnotes,
    categoryIndex: '',
    category: '',
    arrayName: '',
    selectedData: '',
    runOnce: false,
    width: 0,
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        entity: '',
        selectedIndex: '',
        ClinicianNote: {
          notesScribbleArray: [],
        },
        ChiefComplaints: {
          chiefComplaintsScribbleArray: [],
        },
        Plan: {
          planScribbleArray: [],
        },
      },
    })

    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize = () => {
    if (window.innerWidth <= 1785) {
      this.setState({
        width: window.innerWidth / 11,
      })
    } else {
      this.setState({
        width: window.innerWidth / 5.8,
      })
    }
  }

  scribbleNoteDrawing = (values, temp) => {
    const { scriblenotes, dispatch } = this.props
    const { category, arrayName, categoryIndex } = this.state
    let previousData = this.form.values.corScribbleNotes
    let clinicianArray = scriblenotes.ClinicianNote.notesScribbleArray
    let chiefComplaintsArray =
      scriblenotes.ChiefComplaints.chiefComplaintsScribbleArray
    let planArray = scriblenotes.Plan.planScribbleArray

    if (scriblenotes.editEnable) {
      const newArrayItems = [
        ...scriblenotes[category][arrayName],
      ]
      // newArrayItems[scriblenotes.selectedIndex] = {
      //   scribbleNoteTypeFK: categoryIndex,
      //   scribbleNoteTypeName: category,
      //   subject: values,
      //   scribbleNoteLayers: temp,
      // }

      newArrayItems[scriblenotes.selectedIndex].subject = values
      newArrayItems[scriblenotes.selectedIndex].scribbleNoteLayers = temp

      dispatch({
        type: 'scriblenotes/updateState',
        payload: {
          ...scriblenotes,
          [category]: {
            [arrayName]: newArrayItems,
          },
        },
      })

      if (category === 'ClinicianNote') {
        clinicianArray = newArrayItems
      } else if (category === 'ChiefComplaints') {
        chiefComplaintsArray = newArrayItems
      } else if (category === 'Plan') {
        planArray = newArrayItems
      }

      previousData = []

      for (let i = 0; i < clinicianArray.length; i++) {
        previousData.push(clinicianArray[i])
      }

      for (let i = 0; i < chiefComplaintsArray.length; i++) {
        previousData.push(chiefComplaintsArray[i])
      }

      for (let i = 0; i < planArray.length; i++) {
        previousData.push(planArray[i])
      }
    } else {
      dispatch({
        type: 'scriblenotes/updateState',
        payload: {
          ...scriblenotes,
          [category]: {
            [arrayName]: [
              ...scriblenotes[category][arrayName],
              {
                scribbleNoteTypeFK: categoryIndex,
                scribbleNoteTypeName: category,
                subject: values,
                scribbleNoteLayers: temp,
              },
            ],
          },
        },
      })
      previousData.push({
        scribbleNoteTypeFK: categoryIndex,
        scribbleNoteTypeName: category,
        subject: values,
        scribbleNoteLayers: temp,
      })
    }

    this.form.setFieldValue('corScribbleNotes', previousData)
  }

  deleteScribbleNote = () => {
    const { scriblenotes, dispatch } = this.props
    const { category, arrayName } = this.state
    let previousData = this.form.values.corScribbleNotes
    let clinicianArray = scriblenotes.ClinicianNote.notesScribbleArray
    let chiefComplaintsArray =
      scriblenotes.ChiefComplaints.chiefComplaintsScribbleArray
    let planArray = scriblenotes.Plan.planScribbleArray
    const tempArrayItems = [
      ...scriblenotes[category][arrayName],
    ]
    const newArrayItems = []
    const deleteItem = tempArrayItems[scriblenotes.selectedIndex]

    for (let i = 0; i < tempArrayItems.length; i++) {
      if (tempArrayItems[i] !== deleteItem) {
        newArrayItems.push(tempArrayItems[i])
      }
    }

    dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        ...scriblenotes,
        [category]: {
          [arrayName]: newArrayItems,
        },
      },
    })

    if (category === 'ClinicianNote') {
      clinicianArray = newArrayItems
    } else if (category === 'ChiefComplaints') {
      chiefComplaintsArray = newArrayItems
    } else if (category === 'Plan') {
      planArray = newArrayItems
    }

    dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        ...scriblenotes,
        [category]: {
          [arrayName]: newArrayItems,
        },
      },
    })

    // previousData = []

    // for (let i = 0; i < clinicianArray.length; i++) {
    //   previousData.push(clinicianArray[i])
    // }

    // for (let i = 0; i < chiefComplaintsArray.length; i++) {
    //   previousData.push(chiefComplaintsArray[i])
    // }

    // for (let i = 0; i < planArray.length; i++) {
    //   previousData.push(planArray[i])
    // }

    for (let i = 0; i < previousData.length; i++) {
      if (JSON.stringify(previousData[i]) === JSON.stringify(deleteItem)) {
        if (previousData[i].isDeleted !== undefined) {
          previousData[i].isDeleted = true
        } else {
          previousData.splice(i, 1)
        }
      }
    }

    this.form.setFieldValue('corScribbleNotes', previousData)

    this.toggleScribbleModal()
  }

  toggleAttachmentModal = () => {
    const { clinicalnotes } = this.props

    this.props.dispatch({
      type: 'clinicalnotes/updateState',
      payload: {
        showAttachmentModal: !clinicalnotes.showAttachmentModal,
      },
    })
  }

  toggleScribbleModal = () => {
    const { scriblenotes } = this.props
    this.props.dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        showScribbleModal: !scriblenotes.showScribbleModal,
      },
    })
  }

  scribbleNoteUpdateState = (
    categoryValue,
    arrayNameValue,
    categoryIndexValue,
    selectedDataValue,
  ) => {
    this.setState({
      category: categoryValue,
      arrayName: arrayNameValue,
      categoryIndex: categoryIndexValue,
      selectedData: selectedDataValue,
    })
  }

  getScribbleValue = (test) => {}

  updateAttachments = (args) => ({ added, deleted }) => {
    // console.log({ added, deleted }, args)
    const { form, field } = args

    let updated = [
      ...(field.value || []),
    ]
    if (added)
      updated = [
        ...updated,
        ...added.map((o) => {
          const { id, ...resetProps } = o
          return {
            ...resetProps,
            fileIndexFK: o.id,
          }
        }),
      ]

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [
            ...attachments,
            { ...item, isDeleted: true },
          ]

        return [
          ...attachments,
          { ...item },
        ]
      }, [])

    form.setFieldValue('corAttachment', updated)
  }

  editRow = () => {
    this.props.dispatch({
      type: 'clinicalnotes/updateState',
      payload: {
        entity: {
          subject: 'chin wai',
        },
      },
    })
    window.g_app._store.dispatch({
      type: 'clinicalnotes/updateState',
      payload: {
        showScribbleModal: true,
      },
    })
  }

  onEditorChange = (type) => (v) => {
    const { entity } = this.props.consultation
    entity.corDoctorNote = [
      {
        ...entity.corDoctorNote[0],
        [type]: v,
      },
    ]
    this.props.dispatch({
      type: 'consultation/updateState',
      payload: {
        entity,
      },
    })
  }

  render () {
    const {
      prefix = 'corDoctorNote[0].',
      clinicalnotes,
      classes,
      scriblenotes,
      theme,
      dispatch,
      consultation,
      visitRegistration,
    } = this.props
    const { visit } = visitRegistration.entity
    return (
      <div>
        <div className={classes.editor}>
          {/* <h6>Clinical Notes</h6> */}

          <FieldArray
            name='corScribbleNotes'
            render={(arrayHelpers) => {
              const { form } = arrayHelpers
              this.form = form
              const { values } = form

              if (!values || !values.corScribbleNotes) return null
              let chiefComplaints = values.corScribbleNotes.filter(
                (o) => o.scribbleNoteTypeFK === 1,
              )
              let clinicianNote = values.corScribbleNotes.filter(
                (o) => o.scribbleNoteTypeFK === 2,
              )
              let plan = values.corScribbleNotes.filter(
                (o) => o.scribbleNoteTypeFK === 3,
              )

              if (this.state.runOnce === false) {
                setTimeout(() => {
                  dispatch({
                    type: 'scriblenotes/updateState',
                    payload: {
                      entity: '',
                      selectedIndex: '',
                      ClinicianNote: {
                        notesScribbleArray: clinicianNote,
                      },
                      ChiefComplaints: {
                        chiefComplaintsScribbleArray: chiefComplaints,
                      },
                      Plan: {
                        planScribbleArray: plan,
                      },
                    },
                  })
                }, 500)
                this.setState({
                  runOnce: true,
                })
              }

              return null
            }}
          />

          <Field
            name={`${prefix}clinicianNote`}
            render={(args) => {
              return (
                <div>
                  <ScribbleNoteItem
                    scribbleNoteUpdateState={this.scribbleNoteUpdateState}
                    category='ClinicianNote'
                    arrayName='notesScribbleArray'
                    categoryIndex={2}
                    scribbleNoteArray={
                      scriblenotes.ClinicianNote.notesScribbleArray
                    }
                    gridItemWidth={this.state.width}
                  />

                  <RichEditor
                    strongLabel
                    autoFocus
                    onBlur={this.onEditorChange('clinicianNote')}
                    label='Clinical Notes'
                    {...args}
                  />
                </div>
              )
            }}
          />
        </div>

        <div className={classes.editor}>
          {/* <h6>Clinical Notes</h6> */}
          <Field
            name={`${prefix}chiefComplaints`}
            render={(args) => {
              return (
                <div>
                  <ScribbleNoteItem
                    scribbleNoteUpdateState={this.scribbleNoteUpdateState}
                    category='ChiefComplaints'
                    arrayName='chiefComplaintsScribbleArray'
                    categoryIndex={1}
                    scribbleNoteArray={
                      scriblenotes.ChiefComplaints.chiefComplaintsScribbleArray
                    }
                    gridItemWidth={this.state.width}
                  />

                  <RichEditor
                    strongLabel
                    onBlur={this.onEditorChange('chiefComplaints')}
                    label='Chief Complaints'
                    {...args}
                  />
                </div>
              )
            }}
          />
        </div>

        <div className={classes.editor}>
          {/* <h6>Clinical Notes</h6> */}

          <Field
            name={`${prefix}plan`}
            render={(args) => {
              return (
                <div>
                  <ScribbleNoteItem
                    scribbleNoteUpdateState={this.scribbleNoteUpdateState}
                    category='Plan'
                    arrayName='planScribbleArray'
                    categoryIndex={3}
                    scribbleNoteArray={scriblenotes.Plan.planScribbleArray}
                    gridItemWidth={this.state.width}
                  />

                  <RichEditor
                    strongLabel
                    onBlur={this.onEditorChange('plan')}
                    label='Plan'
                    {...args}
                  />
                </div>
              )
            }}
          />
        </div>

        <div style={{ marginTop: theme.spacing(1) }}>
          <UploadAttachment updateAttachments={this.updateAttachments} />
        </div>
        <div
          style={{
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
          }}
        >
          <GridContainer>
            <GridItem>
              <span>Visit Remarks:</span>
            </GridItem>
            <GridItem xs md={12}>
              <TextField
                noUnderline
                multiline
                disabled
                value={visit.visitRemarks}
              />
            </GridItem>
          </GridContainer>
        </div>
        {/* <CommonModal
          open={clinicalnotes.showAttachmentModal}
          title='Upload Attachment'
          maxWidth='sm'
          bodyNoPadding
          onClose={() => this.toggleAttachmentModal()}
        >
          <UploadAttachment updateAttachments={this.updateAttachments} />
        </CommonModal> */}

        <CommonModal
          open={scriblenotes.showScribbleModal}
          title='Scribble'
          fullScreen
          bodyNoPadding
          observe='ScribbleNotePage'
          onClose={() =>
            navigateDirtyCheck({
              onProceed: this.toggleScribbleModal(),
            })}
        >
          <ScribbleNote
            {...this.props}
            addScribble={this.scribbleNoteDrawing}
            toggleScribbleModal={this.toggleScribbleModal}
            scribbleData={this.state.selectedData}
            deleteScribbleNote={this.deleteScribbleNote}
          />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(ClinicalNotes)
// export default ClinicalNotes
