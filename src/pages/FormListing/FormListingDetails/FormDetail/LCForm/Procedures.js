import React, { PureComponent } from 'react'
import _ from 'lodash'
import { Add, Delete } from '@material-ui/icons'
import {
  GridContainer,
  GridItem,
  TextField,
  FastField,
  DatePicker,
  RadioButtonGroup,
  CodeSelect,
  Tooltip,
  ProgressButton,
  CardContainer,
  Popconfirm,
  Button,
  TimePicker,
} from '@/components'
import { DoctorLabel } from '@/components/_medisys'

class Procedures extends PureComponent {
  addProcedure = () => {
    const { setFieldValue, values } = this.props
    const maxIndev = _.maxBy(values.dataContent.procuderes, 'index').index
    let newProcedure = values.dataContent.procuderes.map((o) => o)
    newProcedure.push({ name: '333', index: maxIndev + 1 })
    setFieldValue('dataContent.procuderes', newProcedure)
  }

  deleteProcedure = (row) => {
    const { setFieldValue, values } = this.props
    let newProcedure = values.dataContent.procuderes.map((o) => o)
    newProcedure = newProcedure.filter((o) => o.index !== row.index)

    newProcedure.forEach((s) => {
      if (s.index > row.index) {
        s.index -= 1
      }
    })
    setFieldValue('dataContent.procuderes', newProcedure)
  }

  render () {
    const { values } = this.props

    const _timeFormat = 'hh:mm a'
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            <span>
              * if there are more than three(3) procedures, Procedure Number
              more 3 will be printed in Annex pages.
            </span>
          </GridItem>
          <GridItem md={12}>
            <span>
              * Refer to Section E for non-surgical procedure related charges.
            </span>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='dataContent.principalSurgeonFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Principal Surgeon'
                    code='doctorProfile'
                    labelField='clinicianProfile.name'
                    valueField='id'
                    renderDropdown={(option) => <DoctorLabel doctor={option} />}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <div>
          <div>
            {values.dataContent.procuderes.map((o) => {
              const i = o.index
              return (
                <GridContainer>
                  <GridItem md={6}>
                    <div>Procedure {o.index}</div>
                  </GridItem>
                  <GridItem md={6} container justify='flex-end'>
                    {i !== 1 && (
                      <Popconfirm
                        title='Are you sure delete this item?'
                        onConfirm={() => {
                          this.deleteProcedure(o)
                        }}
                      >
                        <Button justIcon color='danger'>
                          <Delete />
                        </Button>
                      </Popconfirm>
                    )}
                  </GridItem>
                  <GridItem md={12}>
                    <CardContainer hideHeader>
                      <GridContainer>
                        <GridItem xs={4}>
                          <FastField
                            name={`dataContent.procuderes[${i}].procedureDate`}
                            render={(args) => {
                              return (
                                <DatePicker
                                  label='Date of Procedure'
                                  autoFocus
                                  {...args}
                                />
                              )
                            }}
                          />
                        </GridItem>
                        <GridItem xs={4}>
                          <FastField
                            name={`dataContent.procuderes[${i}].procedureStartTime`}
                            render={(args) => {
                              return (
                                <TimePicker
                                  {...args}
                                  label='Start Time in OT'
                                  format={_timeFormat}
                                  use12Hours
                                />
                              )
                            }}
                          />
                        </GridItem>
                        <GridItem xs={4}>
                          <FastField
                            name={`dataContent.procuderes[${i}].procedureEndTime`}
                            render={(args) => {
                              return (
                                <TimePicker
                                  {...args}
                                  label='End Time in OT'
                                  format={_timeFormat}
                                  use12Hours
                                />
                              )
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12}>
                          <FastField
                            name={`dataContent.procuderes[${i}].natureOfOpertation`}
                            render={(args) => (
                              <RadioButtonGroup
                                label='Nature of Opertation'
                                row
                                itemHorizontal
                                options={[
                                  {
                                    value: '1',
                                    label: 'Medical',
                                  },
                                  {
                                    value: '2',
                                    label: 'Cosmetic',
                                  },
                                  {
                                    value: '3',
                                    label: 'Repeated',
                                  },
                                  {
                                    value: '4',
                                    label: 'Staged',
                                  },
                                ]}
                                {...args}
                              />
                            )}
                          />
                        </GridItem>
                        <GridItem xs={12}>
                          Only{' '}
                          <span
                            style={{
                              fontStyle: 'italic',
                              textDecoration: 'underline',
                            }}
                          >
                            surgical-related
                          </span>{' '}
                          charges to be reimbursed to the doctor need to be
                          filled in below.
                        </GridItem>
                      </GridContainer>
                    </CardContainer>
                  </GridItem>
                </GridContainer>
              )
            })}
          </div>
          <GridContainer>
            <GridItem md={12}>
              <Tooltip title='Add Procedure'>
                <ProgressButton
                  color='primary'
                  icon={<Add />}
                  style={{ marginTop: 10 }}
                  onClick={this.addProcedure}
                >
                  New Procedure
                </ProgressButton>
              </Tooltip>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    )
  }
}
export default Procedures
