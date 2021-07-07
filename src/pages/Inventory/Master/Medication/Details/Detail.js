import React, { useState } from 'react'
import { formatMessage } from 'umi'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { compose } from 'redux'
import { Radio } from 'antd'
import {
  CodeSelect,
  TextField,
  GridContainer,
  GridItem,
  DateRangePicker,
  Button,
  CommonModal,
  Field,
  dateFormatLong,
  CheckboxGroup,
} from '@/components'
import { AttachmentWithThumbnail } from '@/components/_medisys'
import SharedContainer from '../../SharedContainer'
import Sdd from '../../Sdd'

const styles = () => ({})

const Detail = ({
  medicationDetail,
  dispatch,
  setFieldValue,
  sddDetail,
  theme,
  hasActiveSession,
  clinicSettings,
  languageLabel,
  ...props
}) => {
  const [toggle, setToggle] = useState(false)
  const [attachments, setAttachments] = useState([])
  const toggleModal = () => {
    setToggle(!toggle)
  }
  const handleSelectSdd = row => {
    const { id, code, name } = row
    setToggle(!toggle)

    setFieldValue('sddfk', id)
    setFieldValue('sddCode', code)
    setFieldValue('sddDescription', name)
  }

  const updateAttachments = ({ added, deleted }) => {
    let updated = [...attachments]

    if (added) updated = [...updated, ...added]

    if (deleted)
      updated = updated.reduce((items, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [...items, { ...item, isDeleted: true }]

        return [...items, { ...item }]
      }, [])

    setAttachments(updated)
    setFieldValue('attachment', updated)
  }

  return (
    <div
      style={{
        margin: theme.spacing(1),
      }}
    >
      <GridContainer gutter={15}>
        <GridItem xs={12} md={4}>
          <Field
            name='code'
            render={args => {
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
        <GridItem xs={12} md={4}>
          <FastField
            name='displayValue'
            render={args => {
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
        <GridItem xs={12} md={4}>
          <FastField
            name='favouriteSupplierFK'
            render={args => (
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
        <GridItem xs={12} md={4}>
          <FastField
            name='description'
            render={args => {
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
        <GridItem xs={12} md={4}>
          <FastField
            name='caution'
            render={args => (
              <TextField
                label={formatMessage({
                  id: 'inventory.master.medication.caution',
                })}
                maxLength={200}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <GridContainer>
            <GridItem md={12} style={{ padding: 0 }}>
              <FastField
                name='indication'
                render={args => {
                  return (
                    <TextField
                      label={
                        formatMessage({
                          id: 'inventory.master.medication.indication',
                        }) + languageLabel
                      }
                      multiline
                      rowsMax='5'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={12} style={{ padding: 0 }}>
              <div style={{ fontWeight: 100, fontSize: '0.8rem' }}>
                <span style={{ color: 'blue', fontStyle: 'italic' }}>
                  Hint:
                </span>
                <span>パラセタモールは神のためのものです</span>
              </div>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='medicationGroupFK'
            render={args => (
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
        <GridItem xs={12} md={4}>
          <FastField
            name='genericMedicationFK'
            render={args => (
              <CodeSelect
                label={formatMessage({
                  id: 'inventory.master.medication.genericMedication',
                })}
                code='ctRevenueCategory' //TODO:: replace with actual codeset
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='revenueCategoryFK'
            render={args => (
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
        <GridItem xs={12} md={4}>
          <Field
            name='effectiveDates'
            render={args => (
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
        <GridItem xs={12} md={4}>
          <FastField
            name='remarks'
            render={args => {
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
        <GridItem md={12}>
          <div style={{ padding: '5px 0px' }}>
            <span>Type: </span>
            <Radio.Group onChange={() => {}} value={1}>
              <Radio value={1}>Oral</Radio>
              <Radio value={2}>External</Radio>
            </Radio.Group>
          </div>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} />
        <GridItem md={12}>
          <FastField
            name='chas'
            render={args => (
              <CheckboxGroup
                style={{
                  margin: theme.spacing(1),
                }}
                simple
                valueField='id'
                textField='name'
                options={
                  clinicSettings.isEnableMedisave
                    ? [
                        {
                          id: 'isChasAcuteClaimable',
                          name: 'CHAS Acute Claimable',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: 'isChasChronicClaimable',
                          name: 'CHAS Chronic Claimable',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: 'isDisplayedInleaflet',
                          name: 'Display in Leaflet',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: 'isExclusive',
                          name: 'Exclusive',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: 'isMedisaveClaimable',
                          name: 'CDMP Claimable',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: 'isMedisaveClaimable',
                          name: 'CDMP Claimable',
                          layoutConfig: {
                            style: {},
                          },
                        },
                      ]
                    : [
                        {
                          id: 'isChasAcuteClaimable',
                          name: 'CHAS Acute Claimable',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: 'isChasChronicClaimable',
                          name: 'CHAS Chronic Claimable',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: 'isDisplayedInleaflet',
                          name: 'Display in Leaflet',
                          layoutConfig: {
                            style: {},
                          },
                        },
                        {
                          id: 'isExclusive',
                          name: 'Exclusive',
                          layoutConfig: {
                            style: {},
                          },
                        },
                      ]
                }
                onChange={(e, s) => {}}
                {...args}
              />
            )}
          />
        </GridItem>

        <GridItem md={12}>
          <GridContainer>
            <GridItem md={4}>
              <Field
                name='attachment'
                render={args => (
                  <AttachmentWithThumbnail
                    extenstions='.png, .jpg, .jpeg'
                    fieldName='attachment'
                    label='Images'
                    local
                    isReadOnly={false}
                    allowedMultiple={true}
                    disableScanner
                    handleUpdateAttachments={updateAttachments}
                    attachments={attachments}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>

      <h4 style={{ marginLeft: 10, marginTop: 20, fontWeight: 300 }}>
        <b>SDD</b>
      </h4>
      <GridContainer>
        <GridItem xs={5}>
          <Field
            name='sddCode'
            render={args => {
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
          <Field
            name='sddDescription'
            render={args => {
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

      <CommonModal
        open={toggle}
        observe='MedicationDetail'
        title='Standard Drug Dictionary'
        maxWidth='md'
        bodyNoPadding
        onClose={toggleModal}
        onConfirm={toggleModal}
      >
        <Sdd
          dispatch={dispatch}
          handleSelectSdd={handleSelectSdd}
          theme={theme}
          {...props}
        />
      </CommonModal>
    </div>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
)(Detail)
