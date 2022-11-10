import React, { PureComponent } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Checkbox } from 'antd'
import $ from 'jquery'
import { Button, Popover, CommonModal, FieldArray } from '@/components'
import { scribbleTypes } from '@/utils/codes'
import {
  navigateDirtyCheck,
  getUniqueId,
  getDefaultLayerContent,
} from '@/utils/utils'
import { CLINICALNOTE_FORM } from '@/utils/constants'
import { getIn, setIn } from 'formik'
import { formConfigs } from './config'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'

const styles = theme => ({
  checkFormCheckBox: {
    display: 'inline-block',
    position: 'relative',
    top: '-6px',
  },
  checkFormLabel: {
    display: 'inline-block',
    maxWidth: 170,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginLeft: 6,
    cursor: 'pointer',
  },
  popoverContainer: {
    textAlign: 'center',
  },
  popoverMessage: {
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
  symbolText: {
    position: 'relative',
    top: 8,
    textAlign: 'center',
  },
  cellStyle: {
    border: '1px solid #CCCC',
    padding: '0px 4px',
  },
  centerCellStyle: {
    border: '1px solid #CCCC',
    padding: '0px 4px',
    textAlign: 'center',
  },
})

class ClinicalNotes extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      editScriblenotes: undefined,
      unSelectFormID: undefined,
    }
  }

  onClickFormType = formType => {
    const { setFieldValue, values } = this.arrayHelpers?.form
    let newSelectForms = [...values.selectForms]
    if (formType.isSelected) {
      newSelectForms = newSelectForms.filter(
        selectForm => selectForm !== formType.id,
      )
      setFieldValue(formType.prefixProp, undefined)
    } else {
      newSelectForms.push(formType.id)
      newSelectForms = _.sortBy(newSelectForms)
      setFieldValue(formType.prefixProp, { ...(formType.defaultValue || {}) })
    }

    setFieldValue('selectForms', newSelectForms)
    setTimeout(() => {
      this.clickScrollTo(formType.id)
    }, 500)
  }

  clickScrollTo = formID => {
    const { values } = this.arrayHelpers?.form
    let height = 0
    let totalHeight = 0
    values.selectForms.forEach(selectForm => {
      const formHeight = $(`.from${selectForm}`).height() || 0
      if (selectForm < formID) {
        height = height + formHeight
      }
      totalHeight = totalHeight + formHeight
    })

    const formDiv = document.getElementById('ClinicalNoteForms')
    if (height === 0) {
      formDiv?.scrollTo({ top: 0 })
      return
    }
    const diffHeight =
      (formDiv.scrollHeight - totalHeight) * (height / totalHeight)
    formDiv?.scrollTo({ top: height + diffHeight })
  }

  formHeight = () => {
    const { dispatch, global } = this.props
    const formTypesHeight = $('.formTypes').height() || 0
    const formsHeight = global.mainDivHeight - 216 - formTypesHeight
    return formsHeight
  }

  editScribbleNote = async (
    prefixProp,
    scribbleNoteProp,
    scribbleNoteFKProp,
    formId,
    defaultImage,
    cavanSize,
    imageSize,
    thumbnailSize,
    position,
  ) => {
    const { dispatch } = this.props
    const { values } = this.arrayHelpers?.form
    let preScriblenote = getIn(values, `${prefixProp}.${scribbleNoteProp}`) || {
      scribbleNoteLayers: [],
    }
    if (!preScriblenote.scribbleNoteLayers) {
      const layerContent = await getDefaultLayerContent(
        defaultImage,
        imageSize,
        position,
      )
      preScriblenote.scribbleNoteLayers = [
        { layerType: 'image', layerNumber: -100, layerContent },
      ]
    }
    this.setState({
      editScriblenotes: {
        prefixProp: prefixProp,
        selectedData: preScriblenote,
        scribbleNoteProp,
        scribbleNoteFKProp,
      },
    })
    dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        entity: { ...preScriblenote },
        showScribbleModal: true,
        editEnable: false,
        cavanSize,
        thumbnailSize,
      },
    })
  }

  toggleScribbleModal = () => {
    const { dispatch, scriblenotes } = this.props
    dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        showScribbleModal: !scriblenotes.showScribbleModal,
      },
    })
  }

  scribbleNoteDrawing = async ({
    subject,
    temp,
    thumbnail = null,
    origin = null,
  }) => {
    const { dispatch } = this.props
    const { setFieldValue, values } = this.arrayHelpers?.form
    const { editScriblenotes } = this.state
    const scribbleNoteProp = `${editScriblenotes.prefixProp}.${editScriblenotes.scribbleNoteProp}`
    const scribbleNoteFKProp = `${editScriblenotes.prefixProp}.${editScriblenotes.scribbleNoteFKProp}`
    const preScriblenote = getIn(values, scribbleNoteProp)
    if (preScriblenote && preScriblenote.id) {
      dispatch({
        type: 'scriblenotes/upsert',
        payload: {
          id: preScriblenote.id,
          scribbleNoteTypeFK: 1,
          scribbleNoteLayers: temp.map(t => {
            return {
              ...t,
              scribbleNoteFK: preScriblenote.id,
            }
          }),
          subject,
          thumbnail,
          origin,
        },
      })

      setFieldValue(scribbleNoteProp, {
        ...preScriblenote,
        subject,
        scribbleNoteLayers: temp.map(t => ({
          ...t,
          scribbleNoteFK: preScriblenote.id,
        })),
        thumbnail,
        origin,
      })
    } else {
      const newData = {
        subject,
        thumbnail,
        origin,
        scribbleNoteTypeFK: 1,
        scribbleNoteTypeName: '',
        scribbleNoteLayers: temp,
      }

      const response = await dispatch({
        type: 'scriblenotes/upsert',
        payload: newData,
      })
      if (response) {
        newData.id = response.id
        newData.origin = undefined
      }

      setFieldValue(scribbleNoteFKProp, response.id)
      setFieldValue(scribbleNoteProp, { ...newData })
    }
  }

  render() {
    const { classes, global, scriblenotes, dispatch } = this.props
    const { editScriblenotes, unSelectFormID } = this.state
    return (
      <div style={{ margin: 6 }}>
        <FieldArray
          name='selectForms'
          render={arrayHelpers => {
            this.arrayHelpers = arrayHelpers
            const { values } = arrayHelpers.form

            const fromTypes = () =>
              formConfigs.map(form => ({
                id: form.id,
                name: form.name,
                prefixProp: form.prefixProp,
                isSelected: values.selectForms.indexOf(form.id) >= 0,
              }))

            return (
              <div>
                <div className='formTypes'>
                  {fromTypes().map(formType => {
                    return (
                      <div
                        style={{
                          width: 200,
                          display: 'inline-block',
                          margin: '4px 0px',
                        }}
                      >
                        <div className={classes.checkFormCheckBox}>
                          <Popover
                            title='Remove this form?'
                            trigger='click'
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            visible={unSelectFormID === formType.id}
                            onVisibleChange={isvisible => {
                              if (!isvisible) {
                                this.setState({
                                  unSelectFormID: undefined,
                                })
                              }
                            }}
                            content={
                              <div className={classes.popoverContainer}>
                                <p className={classes.popoverMessage}>
                                  Confirm to remove this form?
                                </p>
                                <Button
                                  size='sm'
                                  color='danger'
                                  onClick={() => {
                                    this.setState({
                                      unSelectFormID: undefined,
                                    })
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size='sm'
                                  color='primary'
                                  onClick={() => {
                                    this.onClickFormType(formType)
                                    this.setState({
                                      unSelectFormID: undefined,
                                    })
                                  }}
                                >
                                  Confirm
                                </Button>
                              </div>
                            }
                          >
                            <Checkbox
                              label=''
                              inputLabel=''
                              checked={formType.isSelected}
                              onClick={e => {
                                if (formType.isSelected) {
                                  this.setState({
                                    unSelectFormID: formType.id,
                                  })
                                } else {
                                  this.onClickFormType(formType)
                                }
                              }}
                            />
                          </Popover>
                        </div>
                        <span
                          className={classes.checkFormLabel}
                          onClick={() => {
                            if (formType.isSelected) {
                              this.clickScrollTo(formType.id)
                            }
                          }}
                        >
                          {formType.name}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div
                  id='ClinicalNoteForms'
                  style={{
                    maxHeight: this.formHeight(),
                    overflow: 'auto',
                    borderTop: '1px solid #CCCCCC',
                  }}
                >
                  {values.selectForms.map(selectForm => {
                    const formTemplate = formConfigs.find(
                      form => form.id === selectForm,
                    )
                    const LoadableComponent = formTemplate.component
                    return (
                      <div className={`from${selectForm}`}>
                        <LoadableComponent
                          {...this.props}
                          prefixProp={formTemplate.prefixProp}
                          editScribbleNote={this.editScribbleNote}
                          formId={formTemplate.id}
                          defaultImage={formTemplate.defaultImage}
                          cavanSize={formTemplate.cavanSize}
                          imageSize={formTemplate.imageSize}
                          thumbnailSize={formTemplate.thumbnailSize}
                          position={formTemplate.position}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }}
        />
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
            toggleScribbleModal={this.toggleScribbleModal}
            scribbleData={editScriblenotes?.selectedData}
            //deleteScribbleNote={deleteScribbleNote}
            scribbleNoteType={scribbleTypes.find(x => x.typeFK === 1)?.type}
          />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(ClinicalNotes)
