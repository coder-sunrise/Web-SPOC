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
} from '@/components'
import { Attachment } from '@/components/_medisys'
import UploadAttachment from './UploadAttachment'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'
import model from './models'

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
@connect(({ clinicalnotes, scriblenotes }) => ({
  clinicalnotes,
  scriblenotes,
}))
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
    if (window.innerWidth >= 1812) {
      this.setState({
        width: window.innerWidth / 4,
      })
    } else {
      this.setState({
        width: window.innerWidth / 7.8,
      })
    }
  }

  scribbleNoteDrawing = (values, temp) => {
    const { scriblenotes } = this.props
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

      this.props.dispatch({
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
      this.props.dispatch({
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
    const { scriblenotes } = this.props
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

    this.props.dispatch({
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

    this.props.dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        ...scriblenotes,
        [category]: {
          [arrayName]: newArrayItems,
        },
      },
    })

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

  getScribbleValue = (test) => {
    console.log(test)
  }

  updateAttachments = (args) => ({ added, deleted }) => {
    // console.log({ added, deleted }, args)
    const { form, field } = args

    let updated = [
      ...(field.value || []),
    ]
    if (added)
      updated = [
        ...updated,
        ...added.map((o) => ({
          ...o,
          fileIndexFK: o.id,
        })),
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

  //   <IconButton
  //   onClick={() => {
  //     this.setState({
  //       category: 'ClinicianNote',
  //       arrayName: 'notesScribbleArray',
  //       categoryIndex: 2,
  //       selectedData: '',
  //     })

  //     window.g_app._store.dispatch({
  //       type: 'scriblenotes/updateState',
  //       payload: {
  //         entity: '',
  //         showScribbleModal: true,
  //         editEnable: false,
  //       },
  //     })
  //   }}
  // >
  //   <InsertPhoto />
  // </IconButton>

  render () {
    const {
      prefix = 'corDoctorNote[0].',
      clinicalnotes,
      classes,
      scriblenotes,
    } = this.props

    return (
      <div>
        <div className={classes.editor}>
          {/* <h6>Clinical Notes</h6> */}

          <FieldArray
            name='corScribbleNotes'
            render={(arrayHelpers) => {
              const { form } = arrayHelpers
              const { values } = form
              // console.log('diagnosis', values)

              // this.arrayHelpers = arrayHelpers
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

              // scriblenotes.ClinicianNote.notesScribbleArray = clinicianNote
              // scriblenotes.ChiefComplaints.chiefComplaintsScribbleArray = chiefComplaints
              // scriblenotes.Plan.planScribbleArray = plan
              if (this.state.runOnce === false) {
                setTimeout(() => {
                  this.props.dispatch({
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
                  // scriblenotes.ClinicianNote.notesScribbleArray = clinicianNote
                  // scriblenotes.ChiefComplaints.chiefComplaintsScribbleArray = chiefComplaints
                  // scriblenotes.Plan.planScribbleArray = plan
                }, 500)
                this.setState({
                  runOnce: true,
                })
              }

              return null
              // if (diagnosises.length === 0) {
              //   this.addDiagnosis()
              //   return null
              // }
              // return diagnosises.map((v, i) => {
              //   return (
              //     <div key={`test${i}`}>
              //       <Item
              //         {...this.props}
              //         index={i}
              //         arrayHelpers={arrayHelpers}
              //       />
              //     </div>
              //   )
              // })
            }}
          />

          <Field
            name={`${prefix}clinicianNote`}
            render={(args) => {
              return (
                <div>
                  <div className={classes.editorBtn}>
                    <Button
                      color='info'
                      onClick={() => {
                        this.setState({
                          category: 'ClinicianNote',
                          arrayName: 'notesScribbleArray',
                          categoryIndex: 2,
                          selectedData: '',
                        })

                        window.g_app._store.dispatch({
                          type: 'scriblenotes/updateState',
                          payload: {
                            entity: '',
                            showScribbleModal: true,
                            editEnable: false,
                          },
                        })
                      }}
                    >
                      Scribble Note
                    </Button>

                    <div
                      style={{ display: 'inline-block', position: 'absolute' }}
                    >
                      {scriblenotes.ClinicianNote.notesScribbleArray.length >
                      0 ? (
                        <GridContainer>
                          <div
                            className={classes.root}
                            style={{ width: this.state.width, paddingLeft: 20 }}
                          >
                            <GridList
                              className={classes.gridList}
                              cols={0}
                              cellHeight={20}
                            >
                              {scriblenotes.ClinicianNote.notesScribbleArray.map(
                                (item, i) => {
                                  return (
                                    <GridListTile key={i} cols={0}>
                                      <GridItem>
                                        <Button
                                          link
                                          style={{
                                            textDecoration: 'underline',
                                            minWidth: 150,
                                          }}
                                          // className={classes.linkBtn}
                                          value={item}
                                          onClick={() => {
                                            if (item.scribbleNoteLayers) {
                                              this.setState({
                                                category: 'ClinicianNote',
                                                arrayName: 'notesScribbleArray',
                                                categoryIndex: 2,
                                                selectedData: item,
                                              })
                                              window.g_app._store.dispatch({
                                                type:
                                                  'scriblenotes/updateState',
                                                payload: {
                                                  selectedIndex: i,
                                                  showScribbleModal: true,
                                                  editEnable: true,
                                                  entity: item,
                                                },
                                              })
                                            } else {
                                              window.g_app._store
                                                .dispatch({
                                                  type: 'scriblenotes/query',
                                                  payload: {
                                                    id: item.id,
                                                  },
                                                })
                                                .then((v) => {
                                                  this.setState({
                                                    category: 'ClinicianNote',
                                                    arrayName:
                                                      'notesScribbleArray',
                                                    categoryIndex: 2,
                                                    selectedData: v,
                                                  })

                                                  const newArrayItems = [
                                                    ...scriblenotes
                                                      .ClinicianNote
                                                      .notesScribbleArray,
                                                  ]
                                                  newArrayItems[
                                                    i
                                                  ].scribbleNoteLayers =
                                                    v.scribbleNoteLayers

                                                  this.props.dispatch({
                                                    type:
                                                      'scriblenotes/updateState',
                                                    payload: {
                                                      ...scriblenotes,
                                                      [this.state.category]: {
                                                        [this.state
                                                          .arrayName]: newArrayItems,
                                                      },
                                                    },
                                                  })

                                                  window.g_app._store.dispatch({
                                                    type:
                                                      'scriblenotes/updateState',
                                                    payload: {
                                                      selectedIndex: i,
                                                      showScribbleModal: true,
                                                      editEnable: true,
                                                      entity: v,
                                                    },
                                                  })
                                                })
                                            }
                                          }}
                                        >
                                          {item.subject}
                                        </Button>
                                      </GridItem>
                                    </GridListTile>
                                  )
                                },
                              )}
                            </GridList>
                          </div>
                        </GridContainer>
                      ) : (
                        ' '
                      )}
                    </div>
                  </div>
                  <RichEditor
                    handlePastedText={() => false}
                    strongLabel
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
                  <div className={classes.editorBtn}>
                    <Button
                      color='info'
                      onClick={() => {
                        this.setState({
                          category: 'ChiefComplaints',
                          arrayName: 'chiefComplaintsScribbleArray',
                          categoryIndex: 1,
                          selectedData: '',
                        })

                        window.g_app._store.dispatch({
                          type: 'scriblenotes/updateState',
                          payload: {
                            entity: '',
                            showScribbleModal: true,
                            editEnable: false,
                          },
                        })
                      }}
                    >
                      Scribble Note
                    </Button>
                    <div
                      style={{ display: 'inline-block', position: 'absolute' }}
                    >
                      {scriblenotes.ChiefComplaints.chiefComplaintsScribbleArray
                        .length > 0 ? (
                        <GridContainer>
                          <div
                            className={classes.root}
                            style={{ width: this.state.width, paddingLeft: 20 }}
                          >
                            <GridList
                              className={classes.gridList}
                              cols={0}
                              cellHeight={20}
                            >
                              {scriblenotes.ChiefComplaints.chiefComplaintsScribbleArray.map(
                                (item, i) => {
                                  return (
                                    <GridListTile key={i} cols={0}>
                                      <GridItem>
                                        <Button
                                          link
                                          // className={classes.linkBtn}
                                          style={{
                                            textDecoration: 'underline',
                                            minWidth: 150,
                                          }}
                                          value={item}
                                          onClick={() => {
                                            if (item.scribbleNoteLayers) {
                                              this.setState({
                                                category: 'ChiefComplaints',
                                                arrayName:
                                                  'chiefComplaintsScribbleArray',
                                                categoryIndex: 1,
                                                selectedData: item,
                                              })
                                              window.g_app._store.dispatch({
                                                type:
                                                  'scriblenotes/updateState',
                                                payload: {
                                                  selectedIndex: i,
                                                  showScribbleModal: true,
                                                  editEnable: true,
                                                  entity: item,
                                                },
                                              })
                                            } else {
                                              window.g_app._store
                                                .dispatch({
                                                  type: 'scriblenotes/query',
                                                  payload: {
                                                    id: item.id,
                                                  },
                                                })
                                                .then((v) => {
                                                  this.setState({
                                                    category: 'ChiefComplaints',
                                                    arrayName:
                                                      'chiefComplaintsScribbleArray',
                                                    categoryIndex: 1,
                                                    selectedData: v,
                                                  })

                                                  const newArrayItems = [
                                                    ...scriblenotes
                                                      .ChiefComplaints
                                                      .chiefComplaintsScribbleArray,
                                                  ]
                                                  newArrayItems[
                                                    i
                                                  ].scribbleNoteLayers =
                                                    v.scribbleNoteLayers

                                                  this.props.dispatch({
                                                    type:
                                                      'scriblenotes/updateState',
                                                    payload: {
                                                      ...scriblenotes,
                                                      [this.state.category]: {
                                                        [this.state
                                                          .arrayName]: newArrayItems,
                                                      },
                                                    },
                                                  })

                                                  window.g_app._store.dispatch({
                                                    type:
                                                      'scriblenotes/updateState',
                                                    payload: {
                                                      selectedIndex: i,
                                                      showScribbleModal: true,
                                                      editEnable: true,
                                                      entity: v,
                                                    },
                                                  })
                                                })
                                            }

                                            // dispatch({
                                            //   type: 'scriblenotes/query',
                                            //   payload: {
                                            //     id: item.id,
                                            //   },
                                            // }).then((v) => {
                                            //   this.setState({
                                            //     category: 'ChiefComplaints',
                                            //     arrayName:
                                            //       'chiefComplaintsScribbleArray',
                                            //     categoryIndex: 1,
                                            //     selectedData: v,
                                            //   })
                                            //   window.g_app._store.dispatch({
                                            //     type:
                                            //       'scriblenotes/updateState',
                                            //     payload: {
                                            //       showScribbleModal: true,
                                            //       selectedIndex: i,
                                            //       editEnable: true,
                                            //     },
                                            //   })
                                            // })
                                          }}
                                        >
                                          {item.subject}
                                        </Button>
                                      </GridItem>
                                    </GridListTile>
                                  )
                                },
                              )}
                            </GridList>
                          </div>
                        </GridContainer>
                      ) : (
                        ' '
                      )}
                    </div>
                  </div>
                  <RichEditor
                    handlePastedText={() => false}
                    strongLabel
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
                  <div className={classes.editorBtn}>
                    <Button
                      color='info'
                      onClick={() => {
                        this.setState({
                          category: 'Plan',
                          arrayName: 'planScribbleArray',
                          categoryIndex: 3,
                          selectedData: '',
                        })

                        window.g_app._store.dispatch({
                          type: 'scriblenotes/updateState',
                          payload: {
                            entity: '',
                            showScribbleModal: true,
                            editEnable: false,
                          },
                        })
                      }}
                    >
                      Scribble Note
                    </Button>

                    <div
                      style={{ display: 'inline-block', position: 'absolute' }}
                    >
                      {scriblenotes.Plan.planScribbleArray.length > 0 ? (
                        <GridContainer>
                          <div
                            className={classes.root}
                            style={{ width: this.state.width, paddingLeft: 20 }}
                          >
                            <GridList
                              className={classes.gridList}
                              cols={0}
                              cellHeight={20}
                            >
                              {scriblenotes.Plan.planScribbleArray.map(
                                (item, i) => {
                                  return (
                                    <GridListTile key={i} cols={0}>
                                      <GridItem>
                                        <Button
                                          link
                                          // className={classes.linkBtn}
                                          style={{
                                            textDecoration: 'underline',
                                            minWidth: 150,
                                          }}
                                          value={item}
                                          onClick={() => {
                                            if (item.scribbleNoteLayers) {
                                              this.setState({
                                                category: 'Plan',
                                                arrayName: 'planScribbleArray',
                                                categoryIndex: 3,
                                                selectedData: item,
                                              })
                                              window.g_app._store.dispatch({
                                                type:
                                                  'scriblenotes/updateState',
                                                payload: {
                                                  selectedIndex: i,
                                                  showScribbleModal: true,
                                                  editEnable: true,
                                                  entity: item,
                                                },
                                              })
                                            } else {
                                              window.g_app._store
                                                .dispatch({
                                                  type: 'scriblenotes/query',
                                                  payload: {
                                                    id: item.id,
                                                  },
                                                })
                                                .then((v) => {
                                                  this.setState({
                                                    category: 'Plan',
                                                    arrayName:
                                                      'planScribbleArray',
                                                    categoryIndex: 3,
                                                    selectedData: v,
                                                  })

                                                  const newArrayItems = [
                                                    ...scriblenotes.Plan
                                                      .planScribbleArray,
                                                  ]
                                                  newArrayItems[
                                                    i
                                                  ].scribbleNoteLayers =
                                                    v.scribbleNoteLayers

                                                  this.props.dispatch({
                                                    type:
                                                      'scriblenotes/updateState',
                                                    payload: {
                                                      ...scriblenotes,
                                                      [this.state.category]: {
                                                        [this.state
                                                          .arrayName]: newArrayItems,
                                                      },
                                                    },
                                                  })

                                                  window.g_app._store.dispatch({
                                                    type:
                                                      'scriblenotes/updateState',
                                                    payload: {
                                                      selectedIndex: i,
                                                      showScribbleModal: true,
                                                      editEnable: true,
                                                      entity: v,
                                                    },
                                                  })
                                                })
                                            }

                                            // dispatch({
                                            //   type: 'scriblenotes/query',
                                            //   payload: {
                                            //     id: item.id,
                                            //   },
                                            // }).then((v) => {
                                            //   this.setState({
                                            //     category: 'Plan',
                                            //     arrayName: 'planScribbleArray',
                                            //     categoryIndex: 1,
                                            //     selectedData: v,
                                            //   })
                                            //   window.g_app._store.dispatch({
                                            //     type:
                                            //       'scriblenotes/updateState',
                                            //     payload: {
                                            //       showScribbleModal: true,
                                            //       selectedIndex: i,
                                            //       editEnable: true,
                                            //     },
                                            //   })
                                            // })
                                          }}
                                        >
                                          {item.subject}
                                        </Button>
                                      </GridItem>
                                    </GridListTile>
                                  )
                                },
                              )}
                            </GridList>
                          </div>
                        </GridContainer>
                      ) : (
                        ' '
                      )}
                    </div>
                  </div>

                  <RichEditor
                    handlePastedText={() => false}
                    strongLabel
                    label='Plan'
                    {...args}

                  />
                </div>
              )
            }}
          />
        </div>

        

        <h6 style={{ marginTop: 10 }}></h6>
        <FastField
          name='corAttachment'
          render={(args) => {
            this.form = args.form

          //   <Attachment
          //   attachmentType='ClinicalNotes'
          //   handleUpdateAttachments={this.updateAttachments(args)}
          //   attachments={args.field.value}
          //   label=''
          //   isReadOnly
          // />

            return (
              <UploadAttachment updateAttachments={this.updateAttachments} />
            )
          }}
        />

        {/*         
        <p>
          <a>Attachment002.pdf</a>
        </p>
        <p>
          <a>Attachment003.docx</a>
        </p>
        <p>
          <a>Scribble 01</a>
        </p> */}
        <CommonModal
          open={clinicalnotes.showAttachmentModal}
          title='Upload Attachment'
          maxWidth='sm'
          bodyNoPadding
          onClose={() => this.toggleAttachmentModal()}
        >
          <UploadAttachment updateAttachments={this.updateAttachments} />
        </CommonModal>
        
        <CommonModal
          open={scriblenotes.showScribbleModal}
          title='Scribble'
          fullScreen
          bodyNoPadding
          onClose={() => this.toggleScribbleModal()}
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
