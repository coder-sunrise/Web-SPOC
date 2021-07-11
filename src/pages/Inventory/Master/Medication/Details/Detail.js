import React, { useState, useEffect } from 'react'
import { formatMessage } from 'umi'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { compose } from 'redux'
import { useSelector } from 'react-redux'
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
import { MultiLangCodeSelect } from '../Components'
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
  language,
  isMultiLanguage,
  ...props
}) => {
  const [toggle, setToggle] = useState(false)
  const { primaryPrintoutLanguage, secondaryPrintoutLanguage } = clinicSettings
  const [languageLabel, setLanguageLabel] = useState('')
  const [attachments, setAttachments] = useState([])
  useEffect(() => {
    setLanguageLabel(isMultiLanguage ? `(${language})` : '')
  }, [language])
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
              {primaryPrintoutLanguage === language ? (
                <Field
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
              ) : (
                <Field
                  name='indicationSecondary'
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
              )}
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
                code='ctGenericMedication'
                labelField='displayValue'
                {...args}
              />
            )}
          />
        </GridItem>

        <GridItem xs={12} md={4}>
          <Field
            name='routeOfAdministrationFK'
            render={args => (
              <MultiLangCodeSelect
                label={
                  formatMessage({
                    id: 'inventory.master.medication.routeOfAdministration',
                  }) + languageLabel
                }
                code='ctMedicationGroup'
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='drugAllergyFK'
            render={args => (
              <CodeSelect
                label={formatMessage({
                  id: 'inventory.master.medication.drugAllergy',
                })}
                code='ctclinicdrugallergy'
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='medicationIngredientFK'
            render={args => (
              <CodeSelect
                label={formatMessage({
                  id: 'inventory.master.medication.medicationIngredient',
                })}
                code='ctMedicationIngredient'
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
        <GridItem md={12} style={{ padding: '0px 8px' }}>
          <GridContainer>
            <GridItem md={4}>
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

            <GridItem md={7} style={{ paddingRight: 0 }}>
              <Field
                name='sddDescription'
                render={args => {
                  return (
                    <TextField
                      multiline
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
            <GridItem md={1} style={{ textAlign: 'right', margin: 'auto' }}>
              <Button variant='contained' color='primary' onClick={toggleModal}>
                Search
              </Button>
            </GridItem>
          </GridContainer>
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
                          id: 'isOnlyClinicInternalUsage',
                          name: 'Only Internal Usage',
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
                          id: 'isOnlyClinicInternalUsage',
                          name: 'Only Internal Usage',
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
          <Field
            name='attachment'
            render={args => (
              <AttachmentWithThumbnail
                extenstions='.png, .jpg, .jpeg'
                fieldName='attachment'
                label='Images'
                isReadOnly={false}
                allowedMultiple={false}
                disableScanner
                handleUpdateAttachments={updateAttachments}
                attachments={attachments}
                simple
              />
            )}
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
