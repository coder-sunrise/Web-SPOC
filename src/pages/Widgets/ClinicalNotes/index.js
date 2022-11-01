import React, { useEffect, useState } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Checkbox } from 'antd'
import $ from 'jquery'
import { Button, Popover } from '@/components'
import { formConfigs } from './config'
const styles = theme => ({
  checkFormCheckBox: {
    display: 'inline-block',
    position: 'relative',
    top: '-6px',
  },
  checkFormLabel: {
    display: 'inline-block',
    maxWidth: 180,
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
})
const ClinicalNotes = props => {
  const { values, setFieldValue, classes, global } = props
  const [selectForms, setSelectForms] = useState([])
  const [unSelectFormID, setUnSelectFormID] = useState([])
  useEffect(() => {
    if (values.selectForms && values.selectForms.length) {
      setSelectForms(values.selectForms)
    }
  }, [values.selectForms])

  const fromTypes = () =>
    formConfigs.map(form => ({
      id: form.id,
      name: form.name,
      prefixProp: form.prefixProp,
      isSelected: selectForms.indexOf(form.id) >= 0,
    }))

  const onClickFormType = formType => {
    let newSelectForms = [...selectForms]
    if (formType.isSelected) {
      newSelectForms = newSelectForms.filter(
        selectForm => selectForm !== formType.id,
      )
      setFieldValue(formType.prefixProp, undefined)
    } else {
      newSelectForms.push(formType.id)
      newSelectForms = _.sortBy(newSelectForms)
      setFieldValue(formType.prefixProp, {})
    }
    setSelectForms(newSelectForms)
    setFieldValue('selectForms', newSelectForms)
    setTimeout(() => {
      clickScrollTo(formType.id)
    }, 500)
  }

  const clickScrollTo = formID => {
    let height = 0
    selectForms
      .filter(selectForm => selectForm < formID)
      .forEach(selectForm => {
        const formHeight = $(`.from${selectForm}`).height() || 0
        height = height + formHeight
      })

    const formDiv = document.getElementById('ClinicalNoteForms')
    formDiv.scrollTo({ top: height })
  }

  const formHeight = () => {
    const formTypesHeight = $('.formTypes').height() || 0
    const formsHeight = global.mainDivHeight - 216 - formTypesHeight
    return formsHeight
  }
  return (
    <div style={{ margin: 6 }}>
      <div className='formTypes'>
        {fromTypes().map(formType => {
          return (
            <div
              style={{ width: 220, display: 'inline-block', margin: '4px 0px' }}
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
                      setUnSelectFormID(undefined)
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
                          setUnSelectFormID(undefined)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size='sm'
                        color='primary'
                        onClick={() => {
                          onClickFormType(formType)
                          setUnSelectFormID(undefined)
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
                        setUnSelectFormID(formType.id)
                      } else {
                        onClickFormType(formType)
                      }
                    }}
                  />
                </Popover>
              </div>
              <span
                className={classes.checkFormLabel}
                onClick={() => {
                  if (formType.isSelected) {
                    clickScrollTo(formType.id)
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
        style={{ maxHeight: formHeight(), overflow: 'auto' }}
      >
        {selectForms.map(selectForm => {
          const formTemplate = formConfigs.find(form => form.id === selectForm)
          const LoadableComponent = formTemplate.component
          return (
            <div className={`from${selectForm}`}>
              <LoadableComponent
                {...props}
                prefixProp={formTemplate.prefixProp}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(ClinicalNotes)
