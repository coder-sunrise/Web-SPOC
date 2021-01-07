import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  RichEditor,
  Field,
  SizeContainer,
  CodeSelect,
  Checkbox,
  Tooltip,
  CommonModal,
} from '@/components'
import { tagList } from '@/utils/codes'

@withFormikExtend({
  mapPropsToValues: ({ settingDocumentTemplate }) =>
    settingDocumentTemplate.entity || settingDocumentTemplate.default,
  validationSchema: Yup.object().shape({
    documentTemplateTypeFK: Yup.string().required(),
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    templateContent: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    const { isDefaultTemplate, id } = restValues
    let message
    if (isDefaultTemplate) {
      message = 'Default template saved successfully.'
    } else if (id) {
      message = 'Template saved successfully.'
    } else {
      message = 'Template created successfully.'
    }
    dispatch({
      type: 'settingDocumentTemplate/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        cfg: { message },
      },
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingDocumentTemplate/query',
        })
      }
    })
  },
  displayName: 'DocumentTemplateDetail',
})
class Detail extends PureComponent {
  state = { isShowSaveDefaultTemplate: false }

  handelSaveDefaultTemplate = () => {
    this.setState((preState) => {
      return { isShowSaveDefaultTemplate: !preState.isShowSaveDefaultTemplate }
    })
  }

  handelConfirm = () => {
    const { values, handleSubmit } = this.props
    const { isDefaultTemplate } = values
    if (isDefaultTemplate) {
      this.handelSaveDefaultTemplate()
    } else {
      handleSubmit()
    }
  }

  render () {
    const { props } = this
    const {
      theme,
      footer,
      settingDocumentTemplate,
      setFieldValue,
      height,
      values,
    } = props
    const { documentTemplateTypeFK, displayValue } = values
    return (
      <SizeContainer size='sm'>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='documentTemplateTypeFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      code='LTDocumentTemplateType'
                      label='Document Type'
                      onChange={(v) => {
                        if (v !== 3) {
                          setFieldValue('isDefaultTemplate', false)
                        }
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => (
                  <TextField
                    label='Code'
                    autoFocus
                    {...args}
                    disabled={!!settingDocumentTemplate.entity}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={(args) => <TextField label='Display Value' {...args} />}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='effectiveDates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      label='Effective Start Date'
                      label2='End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem
              md={6}
              style={{
                position: 'relative',
              }}
            >
              {documentTemplateTypeFK === 3 && (
                <Tooltip title='For auto generate vaccination certificate'>
                  <FastField
                    name='isDefaultTemplate'
                    render={(args) => {
                      return (
                        <Checkbox
                          label='Default Template'
                          {...args}
                          style={{
                            position: 'absolute',
                            bottom: 0,
                          }}
                        />
                      )
                    }}
                  />
                </Tooltip>
              )}
            </GridItem>
            <GridItem md={12}>
              <Field
                name='templateContent'
                render={(args) => {
                  const cfg = {}
                  if (height && height > 538) {
                    cfg.height = height - 440
                  }
                  return (
                    <RichEditor
                      label='Template Message'
                      tagList={
                        documentTemplateTypeFK === 3 ? (
                          tagList.filter(
                            (t) =>
                              [
                                'Order',
                                'ExternalPrescription',
                              ].indexOf(t.value) < 0,
                          )
                        ) : (
                          tagList
                        )
                      }
                      {...cfg}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <CommonModal
            title='Default Template'
            maxWidth='sm'
            open={this.state.isShowSaveDefaultTemplate}
            onClose={this.handelSaveDefaultTemplate}
            onConfirm={() => {
              this.handelSaveDefaultTemplate()
              props.handleSubmit()
            }}
            cancelText='Cancel'
            showFooter
          >
            <div
              style={{
                marginLeft: 20,
                marginRight: 20,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  marginTop: -20,
                }}
              >
                <h3>{`Select ${displayValue || ''} as default template?`}</h3>
              </div>
            </div>
          </CommonModal>
        </div>
        {footer &&
          footer({
            onConfirm: this.handelConfirm,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </SizeContainer>
    )
  }
}

export default Detail
