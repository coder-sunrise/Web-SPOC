import React, { PureComponent, Component } from 'react'
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
    top: 27,
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
    transform: 'translateZ(0)',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    width: 450,
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
    category: '',
    arrayName: '',
    selectedData: '',
  }

  scribbleNoteDrawing = (values, temp) => {
    const { scriblenotes } = this.props
    console.log('))))', scriblenotes)
    const { category, arrayName } = this.state
    if (scriblenotes.editEnable) {
      const newArrayItems = [
        ...scriblenotes[category][arrayName],
      ]
      newArrayItems[scriblenotes.selectedIndex] = {
        subject: values,
        lineData: temp,
      }

      this.props.dispatch({
        type: 'scriblenotes/updateState',
        payload: {
          ...scriblenotes,
          [this.state.category]: {
            [this.state.arrayName]: newArrayItems,
          },
        },
      })
    } else {
      this.props.dispatch({
        type: 'scriblenotes/updateState',
        payload: {
          ...scriblenotes,
          [this.state.category]: {
            [this.state.arrayName]: [
              ...scriblenotes[this.state.category][this.state.arrayName],
              { subject: values, lineData: temp },
            ],
          },
        },
      })
    }
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
    console.log({ scriblenotes })
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
    console.log({ added, deleted }, args)
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

  componentDidMount () {
    this.props.dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        entity: '',
        selectedIndex: '',
        notes: {
          notesScribbleArray: [],
        },
        ChiefComplaints:{
          chiefComplaintsScribbleArray: [],
        },
        Plan:{
          planScribbleArray: [],
        },
      },
    })
  }

  render () {
    console.log('ClinicalNotes', this.props)
    const {
      prefix = 'corDoctorNote[0].',
      clinicalnotes,
      classes,
      scriblenotes,
    } = this.props
    console.log(this.state)
    return (
      <div>
        <div className={classes.editor}>
          {/* <h6>Clinical Notes</h6> */}

          <Field
            name={`${prefix}clinicianNote`}
            render={(args) => {
              return (
                <div>
                  <div className={classes.editorBtn}>
                    <IconButton
                      onClick={() => {
                        this.setState({
                          category: 'notes',
                          arrayName: 'notesScribbleArray',
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
                      <InsertPhoto />
                    </IconButton>
                    
                    <div style={{ display: 'inline-block', marginLeft: 150 }}>
                      {scriblenotes.notes.notesScribbleArray.length > 0 ? (
                        <GridContainer>
                          <div className={classes.root}>
                            <GridList
                              className={classes.gridList}
                              cols={1.5}
                              cellHeight={20}
                            >
                              {scriblenotes.notes.notesScribbleArray.map(
                                (item, i) => {
                                  return (
                                    <GridListTile key={i} cols={1}>
                                      <GridItem md={2}>
                                        <Button
                                          link
                                          // className={classes.linkBtn}
                                          value={item}
                                          onClick={() => {
                                            this.setState({
                                              category: 'notes',
                                              arrayName: 'notesScribbleArray',
                                              selectedData: item,
                                            })
                                            window.g_app._store.dispatch({
                                              type: 'scriblenotes/updateState',
                                              payload: {
                                                entity: item,
                                                selectedIndex: i,
                                                showScribbleModal: true,
                                                editEnable: true,
                                              },
                                            })
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

                  <RichEditor label='Clinical Notes' {...args} />
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
                    <IconButton
                      onClick={() => {
                        this.setState({
                          category: 'ChiefComplaints',
                          arrayName: 'chiefComplaintsScribbleArray',
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
                      <InsertPhoto />
                    </IconButton>
                    <div style={{ display: 'inline-block', marginLeft: 150 }}>
                      {scriblenotes.ChiefComplaints.chiefComplaintsScribbleArray
                        .length > 0 ? (
                        <GridContainer>
                          <div className={classes.root}>
                            <GridList
                              className={classes.gridList}
                              cols={1.5}
                              cellHeight={20}
                            >
                              {scriblenotes.ChiefComplaints.chiefComplaintsScribbleArray.map(
                                (item, i) => {
                                  return (
                                    <GridListTile key={i} cols={1}>
                                      <GridItem md={2}>
                                        <Button
                                          link
                                          // className={classes.linkBtn}
                                          value={item}
                                          onClick={() => {
                                            this.setState({
                                              category: 'ChiefComplaints',
                                              arrayName:
                                                'chiefComplaintsScribbleArray',
                                              selectedData: item,
                                            })
                                            window.g_app._store.dispatch({
                                              type: 'scriblenotes/updateState',
                                              payload: {
                                                entity: item,
                                                showScribbleModal: true,
                                                selectedIndex: i,
                                                editEnable: true,
                                              },
                                            })
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

                  <RichEditor label='Chief Complaints' {...args} />
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
                    <IconButton
                      onClick={() => {
                        this.setState({
                          category: 'Plan',
                          arrayName: 'planScribbleArray',
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
                      <InsertPhoto />
                    </IconButton>
                    <div style={{ display: 'inline-block', marginLeft: 150 }}>
                      {scriblenotes.Plan.planScribbleArray.length > 0 ? (
                        <GridContainer>
                          <div className={classes.root}>
                            <GridList
                              className={classes.gridList}
                              cols={1.5}
                              cellHeight={20}
                            >
                              {scriblenotes.Plan.planScribbleArray.map(
                                (item, i) => {
                                  return (
                                    <GridListTile key={i} cols={1}>
                                      <GridItem md={2}>
                                        <Button
                                          link
                                          // className={classes.linkBtn}
                                          value={item}
                                          onClick={() => {
                                            this.setState({
                                              category: 'Plan',
                                              arrayName: 'planScribbleArray',
                                              selectedData: item,
                                            })
                                            window.g_app._store.dispatch({
                                              type: 'scriblenotes/updateState',
                                              payload: {
                                                entity: item,
                                                showScribbleModal: true,
                                                selectedIndex: i,
                                                editEnable: true,
                                              },
                                            })
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

                  <RichEditor label='Plan' {...args} />
                </div>
              )
            }}
          />
        </div>

        <h6 style={{ marginTop: 10 }}>Attachment</h6>
        <FastField
          name='corAttachment'
          render={(args) => (
            <Attachment
              attachmentType='ClinicalNotes'
              handleUpdateAttachments={this.updateAttachments(args)}
              attachments={args.field.value}
              label=''
              isReadOnly
            />
          )}
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
          />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(ClinicalNotes)
// export default ClinicalNotes
