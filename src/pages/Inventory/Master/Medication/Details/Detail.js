import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { FastField } from 'formik'
import { compose } from 'redux'
import Sdd from '../../Sdd'
import {
  CodeSelect,
  CardContainer,
  TextField,
  GridContainer,
  GridItem,
  Select,
  DatePicker,
  Switch,
  DateRangePicker,
  Button,
  CommonModal,
  Field,
  dateFormatLong,
} from '@/components'
import { getActiveSession } from '@/pages/Reception/Queue/services'

const styles = () => ({})

const Detail = ({
  medicationDetail,
  dispatch,
  setFieldValue,
  sddDetail,
  ...props
}) => {
  const field = medicationDetail.entity ? 'entity' : 'default'
  const [
    hasActiveSession,
    setHasActiveSession,
  ] = useState(true)
  const checkHasActiveSession = async () => {
    const result = await getActiveSession()
    const { data } = result.data
    // let data = []
    if (!data || data.length === 0) {
      setHasActiveSession(!hasActiveSession)
    }
  }

  useEffect(() => {
    if (medicationDetail.currentId) {
      dispatch({
        type: 'medicationDetail/query',
        payload: {
          id: medicationDetail.currentId,
        },
      }).then((med) => {
        const { sddfk } = med
        if (sddfk) {
          dispatch({
            type: 'sddDetail/queryOne',
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
    const { setFieldTouched } = props
    const { id, code, name } = row
    setToggle(!toggle)
    dispatch({
      type: 'medicationDetail/updateState',
      payload: {
        [field]: {
          ...props.values,
          sddfk: id,
          sddCode: code,
          sddDescription: name,
        },
      },
    })
  }
  // console.log('checking', props)
  return (
    <CardContainer
      hideHeader
      style={{
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <GridContainer gutter={0}>
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <Field
                name='code'
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.master.medication.code',
                      })}
                      {...args}
                      disabled={!props.values.isActive}
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
                        id: 'inventory.master.medication.name',
                      })}
                      disabled={medicationDetail.entity}
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
                        id: 'inventory.master.medication.description',
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
                        id: 'inventory.master.medication.remarks',
                      })}
                      multiline
                      rowsMax='5'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12} md={2} />
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='favouriteSupplierFK'
                render={(args) => (
                  <CodeSelect
                    label={formatMessage({
                      id: 'inventory.master.medication.supplier',
                    })}
                    code='ctSupplier'
                    labelField='displayValue'
                    max={10}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='medicationGroupFK'
                render={(args) => (
                  <CodeSelect
                    label={formatMessage({
                      id: 'inventory.master.medication.medicationGroup',
                    })}
                    code='ctMedicationGroup'
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
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
            <GridItem xs={12}>
              <Field
                name='effectiveDates'
                render={(args) => (
                  <DateRangePicker
                    format={dateFormatLong}
                    label='Effective Start Date'
                    label2='End Date'
                    disabled={!!(medicationDetail.entity && hasActiveSession)}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>

      <h5 style={{ marginTop: 15, marginLeft: 8 }}>SDD</h5>
      <Divider style={{ marginLeft: 8 }} />
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

      <Divider style={{ margin: '40px 0 20px 0' }} />

      <CommonModal
        open={toggle}
        observe='MedicationDetail'
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
  // connect(({ sddDetail }) => ({
  //   sddDetail,
  // })),
)(Detail)
