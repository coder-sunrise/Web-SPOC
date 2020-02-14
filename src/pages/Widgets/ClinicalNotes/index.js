import React, { Component } from 'react'
import { FieldArray } from 'formik'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import {
  Accordion,
  Button,
  RichEditor,
  CommonModal,
  Field,
  GridContainer,
  GridItem,
  ScribbleNoteItem,
  TextField,
} from '@/components'
import CannedText from './CannedText'
import CannedTextButton from './CannedText/CannedTextButton'
import UploadAttachment from './UploadAttachment'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'
import model from './models'
import cannedTextModel from './models/cannedText'
import { navigateDirtyCheck } from '@/utils/utils'
import { getDefaultActivePanel, getConfig, getContent } from './utils'
import { CLINIC_TYPE } from '@/utils/constants'

const PREFIX = {
  GP: 'corDoctorNote',
  DENTAL: 'corDentalNotes',
}

const styles = (theme) => ({
  editor: {
    width: '100%',
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
window.g_app.replaceModel(cannedTextModel)

// @withFormikExtend({
//   mapPropsToValues: ({ clinicalnotes }) => {
//     return clinicalnotes.entity || clinicalnotes.default
//   },
//   validationSchema: Yup.object().shape({
//     type: Yup.string().re  quired(),
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
  ({
    clinicInfo,
    clinicalnotes,
    scriblenotes,
    consultation,
    visitRegistration,
  }) => ({
    clinicInfo,
    clinicalnotes,
    scriblenotes,
    consultation,
    visitRegistration,
  }),
)
class ClinicalNotes extends Component {
  constructor (props) {
    super(props)
    const config = getConfig(this.props.clinicInfo)
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

  componentDidMount () {
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
      const newArrayItems = [
        ...scriblenotes[category][arrayName],
      ]
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
      scribbleNoteData[category] = newArrayItems
      previousData = Object.keys(scribbleNoteData).reduce((result, key) => {
        return [
          ...result,
          ...scribbleNoteData[key],
        ]
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
        type: 'scriblenotes/updateState',
        payload: {
          ...scriblenotes,
          [category]: {
            [arrayName]: [
              ...scriblenotes[category][arrayName],
              newData,
            ],
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
        [field.fieldName]: scriblenotes[field.fieldName][field.scribbleField],
      }),
      {},
    )
    const tempArrayItems = [
      ...scriblenotes[category][arrayName],
    ]
    const deleteItem = tempArrayItems[scriblenotes.selectedIndex]
    const updatedCategoryScribbleArray = currentScribbleNoteData[
      category
    ].filter((_, index) => index !== scriblenotes.selectedIndex)

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

  openCannedText = (note) => {
    this.props.dispatch({
      type: 'cannedText/setSelectedNote',
      payload: note,
    })
    this.setState({
      cannedTextRow: note,
      showCannedText: true,
    })
  }

  handleAddCannedText = (cannedText) => {
    const { cannedTextRow } = this.state

    const { consultation, clinicInfo } = this.props
    const _prefix =
      clinicInfo.clinicTypeFK === CLINIC_TYPE.DENTAL ? PREFIX.DENTAL : PREFIX.GP
    const prefix = `${_prefix}[0]`
    const { entity } = consultation
    const { text } = cannedText

    // const { corDoctorNote = [] } = entity
    const note = entity[prefix] || []
    const prevData = note.length > 0 ? note[0][cannedTextRow.fieldName] : ''

    const value = `${prevData || ''}${text}`

    this.onEditorChange(cannedTextRow.fieldName)(value)
    this.form.setFieldValue(`${prefix}${cannedTextRow.fieldName}`, value)
  }

  insertIntoClinicalNote = (dataUrl) => {
    const { selectedData, config } = this.state
    const { fields = [] } = config
    const { consultation, clinicInfo } = this.props
    const _prefix =
      clinicInfo.clinicTypeFK === CLINIC_TYPE.DENTAL ? PREFIX.DENTAL : PREFIX.GP
    const prefix = `${_prefix}[0]`
    const { entity } = consultation
    const contents = `<img src=${dataUrl} alt='scribbleNote' />`

    // const { corDoctorNote = [] } = entity
    const note = entity[prefix] || []
    const scribbleNoteField = fields.find(
      (field) => field.scribbleNoteTypeFK === selectedData.scribbleNoteTypeFK,
    )

    const prevData = note.length > 0 ? note[0][scribbleNoteField.fieldName] : ''

    const value = `${prevData} ${contents}`

    this.onEditorChange(scribbleNoteField.fieldName)(value)

    this.form.setFieldValue(`${prefix}${scribbleNoteField.fieldName}`, value)
  }

  handleCannedTextButtonClick = (note) => {
    this.setState({
      cannedTextRow: note,
    })
  }

  render () {
    const {
      // prefix = 'corDoctorNote[0].',
      classes,
      scriblenotes,
      theme,
      dispatch,
      consultation,
      clinicInfo,
    } = this.props
    const _prefix =
      clinicInfo.clinicTypeFK === CLINIC_TYPE.DENTAL ? PREFIX.DENTAL : PREFIX.GP
    const prefix = `${_prefix}[0]`
    const { config, contents, showCannedText } = this.state
    const { entity = {} } = consultation

    const { fields } = config
    const defaultActive = getDefaultActivePanel(entity, config, _prefix)

    return (
      <div>
        <FieldArray
          name='corScribbleNotes'
          render={(arrayHelpers) => {
            const { form } = arrayHelpers
            this.form = form
            const { values } = form

            if (!values || !values.corScribbleNotes) return null

            const payload = {
              entity: '',
              selectedIndex: '',
              ...fields.reduce(
                (_result, field) => ({
                  ..._result,
                  [field.category]: {
                    [field.scribbleField]: values.corScribbleNotes.filter(
                      (o) => o.scribbleNoteTypeFK === field.scribbleNoteTypeFK,
                    ),
                  },
                }),
                {},
              ),
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
          collapses={contents.map((item) => {
            const onCannedTextClick = () =>
              this.handleCannedTextButtonClick(item)
            const onSettingClick = () => this.openCannedText(item)
            return {
              title: item.fieldTitle,
              content: (
                <div className={classes.editor}>
                  <Field
                    name={`${prefix}${item.fieldName}`}
                    render={(args) => {
                      return (
                        <div>
                          <ScribbleNoteItem
                            editorButtonStyle={{
                              position: 'absolute',
                              zIndex: 1,
                              left: 305,
                              right: 0,
                              top: 10,
                            }}
                            scribbleNoteUpdateState={
                              this.scribbleNoteUpdateState
                            }
                            category={item.category}
                            arrayName={item.scribbleField}
                            categoryIndex={item.scribbleNoteTypeFK}
                            scribbleNoteArray={
                              scriblenotes[item.category][item.scribbleField]
                            }
                            gridItemWidth={this.state.width}
                          />

                          <CannedTextButton
                            onSettingClick={onSettingClick}
                            onCannedTextClick={onCannedTextClick}
                            cannedTextTypeFK={item.cannedTextTypeFK}
                            handleSelectCannedText={this.handleAddCannedText}
                          />

                          <RichEditor
                            strongLabel
                            onBlur={this.onEditorChange(item.fieldName)}
                            // label='Chief Complaints'
                            {...args}
                          />
                        </div>
                      )
                    }}
                  />
                </div>
              ),
            }
          })}
        />

        {config.hasAttachment && (
          <div style={{ marginTop: theme.spacing(1) }}>
            <UploadAttachment updateAttachments={this.updateAttachments} />
          </div>
        )}
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
            })}
        >
          <ScribbleNote
            {...this.props}
            addScribble={this.scribbleNoteDrawing}
            exportToClinicalNote={this.insertIntoClinicalNote}
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
