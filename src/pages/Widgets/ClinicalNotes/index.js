import React, { Component } from 'react'
import { FieldArray } from 'formik'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import {
  Accordion,
  CommonModal,
  Field,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'
import { navigateDirtyCheck } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import CannedText from './CannedText'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'
// import cannedTextModel from './models/cannedText'
import { getDefaultActivePanel, getConfig, getContent } from './utils'
import NoteDetails from './noteDetails'
import { scribbleTypes } from '@/utils/codes'

const styles = theme => ({
  editor: {
    width: '100%',
    // marginTop: theme.spacing(1),
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    zIndex: 1,
    left: 305,
    right: 0,
    top: 3,
  },
  linkBtn: {
    position: 'absolute',
    zIndex: 1,
    left: 410,
    right: 0,
    top: 3,
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

// window.g_app.replaceModel(model)
// window.g_app.replaceModel(cannedTextModel)

@connect(
  ({
    clinicInfo,
    clinicalnotes,
    scriblenotes,
    consultation,
    visitRegistration,
    loading,
    clinicSettings
  }) => ({
    clinicInfo,
    clinicalnotes,
    scriblenotes,
    consultation,
    visitRegistration,
    loading,
    clinicSettings: clinicSettings.settings || clinicSettings.default,
  }),
)
class ClinicalNotes extends Component {
  static defaultProps = {
    prefix: 'corDoctorNote',
  }

  constructor(props) {
    super(props)
    const { clinicSettings } = props
    const config = getConfig(clinicSettings)
    const contents = getContent(config)
    this.state = {
      showCannedText: false,
      runOnce: false,
      categoryIndex: '',
      category: '',
      arrayName: '',
      selectedData: '',
      width: 0,
      config,
      contents,
    }
  }

  componentDidMount() {
    const { config } = this.state
    const { fields } = config
    const payload = {
      entity: '',
      selectedIndex: '',
      ...fields.reduce(
        (_result, field) => ({
          ..._result,
          [field.fieldName]: { [field.scribbleField]: [] },
        }),
        {},
      ),
    }

    this.props.dispatch({
      type: 'scriblenotes/updateState',
      payload,
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

  scribbleNoteDrawing = ({ subject, temp, thumbnail = null }) => {
    const { scriblenotes, dispatch } = this.props
    const { category, arrayName, categoryIndex, config } = this.state
    const { fields } = config

    const scribbleNoteData = fields.reduce(
      (result, field) => ({
        ...result,
        [field.fieldName]: scriblenotes[field.fieldName][field.scribbleField],
      }),
      {},
    )

    let previousData = this.form.values.corScribbleNotes

    if (scriblenotes.editEnable) {
      const newArrayItems = [...scriblenotes[category][arrayName]]
      newArrayItems[scriblenotes.selectedIndex].subject = subject
      newArrayItems[scriblenotes.selectedIndex].scribbleNoteLayers = temp
      newArrayItems[scriblenotes.selectedIndex].thumbnail = thumbnail

      dispatch({
        type: 'scriblenotes/updateState',
        payload: {
          ...scriblenotes,
          [category]: {
            [arrayName]: newArrayItems,
          },
        },
      })

      dispatch({
        type: 'scriblenotes/upsert',
        payload: {
          id: newArrayItems[scriblenotes.selectedIndex].scribbleNoteFK,
          scribbleNoteTypeFK: newArrayItems[scriblenotes.selectedIndex].scribbleNoteTypeFK,
          scribbleNoteLayers: temp.map(t => {
            return {
              ...t,
              scribbleNoteFK: newArrayItems[scriblenotes.selectedIndex].scribbleNoteFK,
            }
          }),
          subject,
          thumbnail,
        },
      })

      scribbleNoteData[category] = newArrayItems
      previousData = Object.keys(scribbleNoteData).reduce((result, key) => {
        return [...result, ...scribbleNoteData[key]]
      }, [])
    } else {
      const newData = {
        subject,
        thumbnail,
        scribbleNoteTypeFK: categoryIndex,
        scribbleNoteTypeName: category,
        scribbleNoteLayers: temp,
      }
      dispatch({
        type: 'scriblenotes/upsert',
        payload: newData,
      }).then((o) => {
        if(o) {
          newData.scribbleNoteFK = o.id
        }
      })

      dispatch({
        type: 'scriblenotes/updateState',
        payload: {
          ...scriblenotes,
          [category]: {
            [arrayName]: [...scriblenotes[category][arrayName], newData],
          },
        },
      })
      previousData.push(newData)
    }

    this.form.setFieldValue('corScribbleNotes', previousData)
  }

  deleteScribbleNote = () => {
    const { scriblenotes, dispatch } = this.props
    const { category, arrayName, config } = this.state
    const { fields } = config
    let previousData = this.form.values.corScribbleNotes

    const currentScribbleNoteData = fields.reduce(
      (result, field) => ({
        ...result,
        [field.category]: scriblenotes[field.category][field.scribbleField],
      }),
      {},
    )
    const tempArrayItems = [...scriblenotes[category][arrayName]]
    const deleteItem = tempArrayItems[scriblenotes.selectedIndex]
    const updatedCategoryScribbleArray = currentScribbleNoteData[
      category
    ].filter((_, index) => index !== scriblenotes.selectedIndex)

    dispatch({
      type: 'scriblenotes/removeScribble',
      payload: deleteItem.scribbleNoteFK,
    })

    dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        ...scriblenotes,
        [category]: {
          [arrayName]: updatedCategoryScribbleArray,
        },
      },
    })

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

  updateAttachments = args => ({ added, deleted }) => {
    const { form, field } = args

    let updated = [...(field.value || [])]
    if (added)
      updated = [
        ...updated,
        ...added.map(o => {
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
          return [...attachments, { ...item, isDeleted: true }]

        return [...attachments, { ...item }]
      }, [])

    form.setFieldValue('corAttachment', updated)
  }

  onEditorChange = type => v => {
    const { consultation, prefix } = this.props
    const { entity } = consultation

    entity[prefix] = [{ ...entity[prefix][0], [type]: v }]

    this.props.dispatch({
      type: 'consultation/updateState',
      payload: {
        entity,
      },
    })
  }

  closeCannedText = () => {
    this.props.dispatch({
      type: 'cannedText/setSelectedNote',
      payload: undefined,
    })
    this.setState({
      showCannedText: false,
      cannedTextRow: undefined,
    })
  }

  openCannedText = note => {
    this.props.dispatch({
      type: 'cannedText/setSelectedNote',
      payload: note,
    })
    this.setState({
      cannedTextRow: note,
      showCannedText: true,
    })
  }

  insertPrevDoctorNotes = async cannedTextTypeFK => {
    const { visitRegistration } = this.props
    let previousDoctorNote = await this.props.dispatch({
      type: 'cannedText/queryPrevDoctorNotes',
      payload: { visitId: visitRegistration.entity.visit.id },
    })
    const { cannedTextRow } = this.state
    const { consultation, prefix } = this.props
    const { entity } = consultation
    let text = ''
    if (previousDoctorNote) {
      if (cannedTextTypeFK === 1) {
        text = previousDoctorNote.note || ''
      } else if (cannedTextTypeFK === 6) {
        text = previousDoctorNote.plan || ''
      } else if (cannedTextTypeFK === 2) {
        text = previousDoctorNote.chiefComplaints || ''
      } else if (cannedTextTypeFK === 3) {
        text = previousDoctorNote.history || ''
      }
    }
    const note = entity[prefix] || []
    const prevData = note.length > 0 ? note[0][cannedTextRow.fieldName] : ''
    const value = `${prevData || ''}${text}`

    this.onEditorChange(cannedTextRow.fieldName)(value)
    const name = `${prefix}[0][${cannedTextRow.fieldName}]`
    this.form.setFieldValue(name, value)

    this.setState({
      showCannedText: false,
      cannedTextRow: undefined,
    })
  }

  handleAddCannedText = cannedText => {
    const { cannedTextRow } = this.state
    const { authority } = cannedTextRow
    const accessRight = Authorized.check(authority)

    if (accessRight && accessRight.rights !== 'enable') return

    const { consultation, prefix } = this.props

    const { entity } = consultation
    const { text } = cannedText

    const note = entity[prefix] || []
    const prevData = note.length > 0 ? note[0][cannedTextRow.fieldName] : ''

    const value = `${prevData || ''}${text}`

    this.onEditorChange(cannedTextRow.fieldName)(value)
    const name = `${prefix}[0][${cannedTextRow.fieldName}]`
    this.form.setFieldValue(name, value)
  }

  insertIntoClinicalNote = dataUrl => {
    const { selectedData, config } = this.state
    const { fields = [] } = config
    const { consultation, prefix } = this.props

    const { entity } = consultation
    const contents = `<img src=${dataUrl} alt='scribbleNote' />`

    const note = entity[prefix] || []
    const scribbleNoteField = fields.find(
      field => field.scribbleNoteTypeFK === selectedData.scribbleNoteTypeFK,
    )

    const prevData = note.length > 0 ? note[0][scribbleNoteField.fieldName] : ''

    const value = `${prevData} ${contents}`

    this.onEditorChange(scribbleNoteField.fieldName)(value)

    this.form.setFieldValue(`${prefix}[0]${scribbleNoteField.fieldName}`, value)
  }

  handleCannedTextButtonClick = note => {
    this.setState({
      cannedTextRow: note,
    })
  }

  render() {
    const {
      prefix,
      classes,
      scriblenotes,
      theme,
      dispatch,
      consultation,
      clinicInfo,
    } = this.props

    const {
      config,
      contents,
      showCannedText,
      width,
      cannedTextRow,
    } = this.state
    const { entity = {} } = consultation
    const { fields } = config
    const panels = contents.filter(item => {
      const accessRight = Authorized.check(item.authority)
      if (!accessRight || (accessRight && accessRight.rights === 'hidden'))
        return false
      return true
    })

    const defaultActive = getDefaultActivePanel(
      entity,
      config,
      prefix,
      clinicInfo,
      panels,
    )

    return (
      <div>
        <FieldArray
          name='corScribbleNotes'
          render={arrayHelpers => {
            const { form } = arrayHelpers
            this.form = form
            const { values } = form

            if (!values || !values.corScribbleNotes) return null

            const payload = {
              entity: '',
              selectedIndex: '',
              ...fields.reduce((_result, field) => {
                const scribbles = values.corScribbleNotes.filter(
                  o => o.scribbleNoteTypeFK === field.scribbleNoteTypeFK,
                )

                return {
                  ..._result,
                  [field.category]: {
                    [field.scribbleField]: scribbles,
                  },
                }
              }, {}),
            }

            if (this.state.runOnce === false) {
              setTimeout(() => {
                dispatch({
                  type: 'scriblenotes/updateState',
                  payload,
                })
              }, 500)
              this.setState({
                runOnce: true,
              })
            }

            return null
          }}
        />
        <Accordion
          leftIcon
          expandIcon={<SolidExpandMore fontSize='large' />}
          defaultActive={defaultActive}
          mode='multiple'
          collapses={panels.map((item, index) => {
            const onCannedTextClick = () =>
              this.handleCannedTextButtonClick(item)
            const onSettingClick = () => this.openCannedText(item)
            return {
              title: item.fieldTitle,
              content: (
                <div className={classes.editor}>
                  <Field
                    name={`${prefix}[0]${item.fieldName}`}
                    render={args => {
                      return (
                        <Authorized authority={item.authority}>
                          <NoteDetails
                            width={width}
                            item={item}
                            args={args}
                            index={index}
                            cannedTextRow={cannedTextRow}
                            scribbleNoteUpdateState={
                              this.scribbleNoteUpdateState
                            }
                            onSettingClick={onSettingClick}
                            onCannedTextClick={onCannedTextClick}
                            onRichEditorBlur={this.onEditorChange(
                              item.fieldName,
                            )}
                            {...this.props}
                          />
                        </Authorized>
                      )
                    }}
                  />
                </div>
              ),
            }
          })}
        />

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
                value={entity.visitRemarks || ''}
              />
            </GridItem>
          </GridContainer>
        </div>

        <CommonModal
          open={showCannedText}
          title='Canned Text'
          observe='CannedText'
          onClose={this.closeCannedText}
        >
          <CannedText />
        </CommonModal>

        <CommonModal
          open={scriblenotes.showScribbleModal}
          title='Scribble'
          fullScreen
          bodyNoPadding
          observe='ScribbleNotePage'
          onClose={() =>
            navigateDirtyCheck({
              onProceed: this.toggleScribbleModal(),
            })
          }
        >
          <ScribbleNote
            {...this.props}
            addScribble={this.scribbleNoteDrawing}
            // exportToClinicalNote={this.insertIntoClinicalNote}
            toggleScribbleModal={this.toggleScribbleModal}
            scribbleData={this.state.selectedData}
            deleteScribbleNote={this.deleteScribbleNote}
            scribbleNoteType={scribbleTypes.find(x=>x.typeFK === this.state.categoryIndex)?.type}
          />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(ClinicalNotes)
