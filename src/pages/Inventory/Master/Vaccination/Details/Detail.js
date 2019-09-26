import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import { FastField } from 'formik'
import { connect } from 'dva'
import { compose } from 'redux'
import Sdd from '../../Sdd'
import { getBizSession } from '@/services/query'
import {
  CommonModal,
  CardContainer,
  TextField,
  GridContainer,
  GridItem,
  DateRangePicker,
  Button,
  CodeSelect,
  Field,
  dateFormatLong,
  CheckboxGroup,
} from '@/components'

const styles = () => ({})

const Detail = ({
  vaccinationDetail,
  dispatch,
  theme,
  setFieldValue,
  ...props
}) => {
  const field = vaccinationDetail.entity ? 'entity' : 'default'

  const [
    hasActiveSession,
    setHasActiveSession,
  ] = useState(true)
  const checkHasActiveSession = async () => {
    const result = await getBizSession()
    const { data } = result.data
    // let data = []
    if (!data || data.length === 0) {
      setHasActiveSession(!hasActiveSession)
    }
  }

  useEffect(() => {
    if (vaccinationDetail.currentId) {
      dispatch({
        type: 'vaccinationDetail/query',
        payload: {
          id: vaccinationDetail.currentId,
        },
      }).then((vac) => {
        const { sddfk } = vac
        if (sddfk) {
          dispatch({
            type: 'sddDetail/query',
            payload: {
              id: sddfk,
            },
          }).then((sdd) => {
            const { data } = sdd
            const { code, name } = data[0]
            setFieldValue('sddCode', code)
            setFieldValue('sddDescription', name)
          })
        }
      })
      checkHasActiveSession()
    }
  }, [])

  const [
    toggle,
    setToggle,
  ] = useState(false)

  const toggleModal = () => {
    setToggle(!toggle)
  }
  const handleSelectSdd = (row) => {
    const { values } = props
    const { id, code, name } = row
    setToggle(!toggle)
    dispatch({
      type: 'vaccinationDetail/updateState',
      payload: {
        [field]: {
          ...values,
          sddfk: id,
          sddCode: code,
          sddDescription: name,
        },
      },
    })
  }

  return (
    <CardContainer
      hideHeader
      style={{
        margin: theme.spacing(2),
      }}
    >
      <GridContainer gutter={0}>
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='code'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.vaccination.code',
                      })}
                      disabled={!props.values.isActive}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='displayValue'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.vaccination.name',
                      })}
                      disabled={vaccinationDetail.entity}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='description'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.vaccination.description',
                      })}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='remarks'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.vaccination.remarks',
                      })}
                      multiline
                      rowsMax='5'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>

            <GridItem xs={12} style={{ marginTop: '10px' }} />
          </GridContainer>
        </GridItem>

        <GridItem xs={1} />

        <GridItem xs={12} md={6}>
          <GridContainer>
            <GridItem xs={2} />
            <GridItem xs={10}>
              <FastField
                name='favouriteSupplierFK'
                render={(args) => (
                  <CodeSelect
                    label={formatMessage({
                      id: 'inventory.master.vaccination.supplier',
                    })}
                    code='ctSupplier'
                    labelField='displayValue'
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={2} />
            <GridItem xs={10}>
              <FastField
                name='revenueCategoryFK'
                render={(args) => (
                  <CodeSelect
                    label={formatMessage({
                      id: 'inventory.master.medication.revenueCategory',
                    })}
                    code='ctRevenueCategory'
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={2} />
            <GridItem xs={10}>
              <FastField
                name='effectiveDates'
                render={(args) => (
                  <DateRangePicker
                    format={dateFormatLong}
                    label='Effective Start Date'
                    label2='End Date'
                    disabled={!!(vaccinationDetail.entity && hasActiveSession)}
                    {...args}
                  />
                )}
              />
            </GridItem>
            {/* <GridItem xs={2}>
              <Field
                name='enableVaccinationGroup'
                render={(args) => (
                  <Checkbox style={{ marginTop: 18, right: -100 }} {...args} />
                )}
              />
            </GridItem>

            <GridItem xs={10}>
              <Field
                name='vaccinationGroupFK'
                render={(args) => (
                  <Select
                    label={formatMessage({
                      id: 'inventory.master.vaccination.vaccinationGroup',
                    })}
                    options={[
                      {
                        name: 'Medisave Vaccination',
                        value: '1',
                      },
                      {
                        name: 'Medisave Vaccination1',
                        value: '2',
                      },
                    ]}
                    disabled={!values.enableVaccinationGroup}
                    {...args}
                  />
                )}
              />
            </GridItem> */}
          </GridContainer>
        </GridItem>
        <GridItem>
          <FastField
            name='chas'
            render={(args) => (
              <CheckboxGroup
                style={{
                  margin: theme.spacing(1),
                }}
                vertical
                simple
                valueField='id'
                textField='name'
                options={[
                  {
                    id: 'acute',
                    name: 'CHAS Acute Claimable',

                    layoutConfig: {
                      style: {},
                    },
                  },
                  {
                    id: 'chronic',
                    name: 'CHAS Chronic Claimable',

                    layoutConfig: {
                      style: {},
                    },
                  },
                ]}
                onChange={(e, s) => {}}
                {...args}
              />
            )}
          />
        </GridItem>
      </GridContainer>
      <h4 style={{ marginTop: 15, fontWeight: 400 }}>
        <b>SDD</b>
      </h4>
      <GridContainer>
        <GridItem xs={5}>
          <FastField
            name='sddCode'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.medication.sddID',
                  })}
                  disabled
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={5} style={{ marginTop: 10 }}>
          <Button variant='contained' color='primary' onClick={toggleModal}>
            Search
          </Button>
        </GridItem>
        <GridItem xs={5}>
          <FastField
            name='sddDescription'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.master.medication.sddDescription',
                  })}
                  disabled
                  {...args}
                />
              )
            }}
          />
        </GridItem>
      </GridContainer>
      {/* <Divider style={{ margin: '40px 0 20px 0' }} /> */}

      <CommonModal
        open={toggle}
        observe='VaccinationDetail'
        title='Standard Drug Dictionary'
        maxWidth='md'
        bodyNoPadding
        onClose={toggleModal}
        onConfirm={toggleModal}
      >
        <Sdd dispatch={dispatch} handleSelectSdd={handleSelectSdd} {...props} />
      </CommonModal>
    </CardContainer>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  // connect(({ vaccinationDetail }) => ({
  //   vaccinationDetail,
  // })),
)(Detail)
