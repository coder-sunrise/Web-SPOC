import React, { PureComponent } from 'react'
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
  render () {
    const procuderes = [
      { name: '111', index: 1 },
      { name: '222', index: 2 },
    ]

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
            {procuderes.map((o) => {
              return (
                <GridContainer>
                  <GridItem md={6}>
                    <div>Procedure {o.index}</div>
                  </GridItem>
                  <GridItem md={6} container justify='flex-end'>
                    {o.index !== 1 && (
                      <Popconfirm
                        title='Are you sure delete this item?'
                        onConfirm={() => {
                          // setFieldValue(`${prop}[${i}].isDeleted`, true)
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
                            name='procedureDate'
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
                            name='procedureDate'
                            render={(args) => {
                              return (
                                <TimePicker
                                  {...args}
                                  label='Time'
                                  format={_timeFormat}
                                  use12Hours
                                />
                              )
                            }}
                          />
                        </GridItem>
                        <GridItem xs={4}>
                          <FastField
                            name='procedureDate'
                            render={(args) => {
                              return (
                                <TimePicker
                                  {...args}
                                  label='Time'
                                  format={_timeFormat}
                                  use12Hours
                                />
                              )
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12}>
                          <FastField
                            name='natureOfOpertation'
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
