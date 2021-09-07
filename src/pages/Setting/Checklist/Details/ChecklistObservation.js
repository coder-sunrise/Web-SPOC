import React, { PureComponent } from 'react'
import $ from 'jquery'
import _ from 'lodash'
import { withStyles, Divider } from '@material-ui/core'
import { FastField, withFormik } from 'formik'
import Add from '@material-ui/icons/Add'
import Close from '@material-ui/icons/Close'
import {
  GridContainer,
  GridItem,
  TextField,
  Popconfirm,
  CardContainer,
  CommonModal,
  FieldArray,
  Field,
  Checkbox,
  NumberInput,
  Button,
  withSettingBase,
  withFormikExtend,
} from '@/components'
import ChecklistNature from './ChecklistNature'

const checklistBorderStyle = {
  borderRadius: 4,
  border: '#cdcdcd solid 1px',
  marginBottom: '5px',
  paddingTop: '5px',
  paddingLeft: '5px',
}

class ChecklistObservation extends PureComponent {
  componentDidMount() {}

  removeObservation = item => {
    const { values, subjectKey, classes } = this.props
    const checklistSubject = values.checklistSubject || []

    const currentSubject = _.find(checklistSubject, ['key', subjectKey])

    const currentSubjectIndex = _.indexOf(checklistSubject, currentSubject)
    if (currentSubjectIndex >= 0) {
      if (item.id) {
        item.isDeleted = true
      } else {
        const index = _.indexOf(
          checklistSubject[currentSubjectIndex].checklistObservation,
          item,
        )

        if (index >= 0) {
          checklistSubject[currentSubjectIndex].checklistObservation.splice(
            index,
            1,
          )
        }
      }
    }
  }

  render() {
    const {
      values,
      subjectKey,
      addObservation,
      removeObservation,
      theme,
      classes,
    } = this.props
    const checklistSubject = values.checklistSubject || []

    const currentSubject = _.find(checklistSubject, ['key', subjectKey])

    const currentSubjectIndex = _.indexOf(checklistSubject, currentSubject)
    if (currentSubjectIndex < 0) {
      return <></>
    }

    return (
      <CardContainer hideHeader>
        <GridContainer>
          <GridItem md={12}>
            <FieldArray
              name={`checklistSubject[${currentSubjectIndex}].checklistObservation`}
              render={arrayHelpers => {
                this.arrayHelpers = arrayHelpers

                return (
                  <div>
                    {currentSubject.checklistObservation.map(
                      (observationItem, i) => {
                        if (observationItem.isDeleted) {
                          return <></>
                        }

                        return (
                          <GridContainer
                            key={observationItem.id || i}
                            style={checklistBorderStyle}
                          >
                            <GridContainer md={12}>
                              <GridItem md={9}>
                                <FastField
                                  name={`checklistSubject[${currentSubjectIndex}].checklistObservation[${i}].displayValue`}
                                  render={args => {
                                    return (
                                      <TextField
                                        label='Observation'
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem md={2}>
                                <FastField
                                  name={`checklistSubject[${currentSubjectIndex}].checklistObservation[${i}].sortOrder`}
                                  render={args => {
                                    return (
                                      <NumberInput
                                        label='Sort Order'
                                        precision={0}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem md={1} align='right'>
                                <Button
                                  color='danger'
                                  size='sm'
                                  aria-label='Delete'
                                  justIcon
                                  onClick={() => {
                                    removeObservation(observationItem)
                                  }}
                                  className={classes.btnContainer}
                                >
                                  <Close />
                                </Button>
                              </GridItem>
                            </GridContainer>
                            <GridContainer md={3}>
                              <GridItem md={12}>
                                <Field
                                  name={`checklistSubject[${currentSubjectIndex}].checklistObservation[${i}].isHasRemark`}
                                  render={args => (
                                    <Checkbox
                                      label='Remarks'
                                      inputLabel=' '
                                      {...args}
                                    />
                                  )}
                                />
                              </GridItem>
                              <GridItem md={12}>
                                <Field
                                  name={`checklistSubject[${currentSubjectIndex}].checklistObservation[${i}].isHasMultiNature`}
                                  style={{ fontSize: '14px !important' }}
                                  render={args => (
                                    <Checkbox
                                      label='Allow select multiple nature'
                                      inputLabel=' '
                                      {...args}
                                    />
                                  )}
                                />
                              </GridItem>
                              <GridItem md={12}>
                                <Field
                                  name={`checklistSubject[${currentSubjectIndex}].checklistObservation[${i}].isWithTitleForInterpretation`}
                                  render={args => (
                                    <Checkbox
                                      label='Display observation title'
                                      inputLabel=' '
                                      {...args}
                                    />
                                  )}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer md={9}>
                              <GridItem md={12}>
                                <ChecklistNature
                                  {...this.props}
                                  subjectIndex={currentSubjectIndex}
                                  observationIndex={i}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridContainer>
                        )
                      },
                    )}
                  </div>
                )
              }}
            />
          </GridItem>
          <GridItem md={12}>
            <Button
              link
              href=''
              key='addObservation'
              color='danger'
              onClick={() => addObservation(subjectKey)}
            >
              <Add />
              Add Observation
            </Button>
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default ChecklistObservation
