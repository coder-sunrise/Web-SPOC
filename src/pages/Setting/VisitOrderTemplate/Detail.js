import React, { PureComponent, Fragment } from 'react'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
} from '@/components'
import { InventoryItemList } from '@/components/_medisys'
import { visitOrderTemplateItemTypes } from '@/utils/codes'

@withFormikExtend({
  mapPropsToValues: ({ settingVisitOrderTemplate }) =>
    settingVisitOrderTemplate.entity || settingVisitOrderTemplate.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props }) => {
    const { effectiveDates, rows, ...restValues } = values
    const { dispatch, onConfirm } = props

    let itemTypesArray = []
    visitOrderTemplateItemTypes.forEach((type) => {
      const currentTypeRows = rows.filter((row) => row.type === type.id)
      const updatedRows = currentTypeRows.map((row) => {
        return {
          ...row,
          [type.dtoName]: {
            ...row,
          },
        }
      })
      itemTypesArray = [
        ...itemTypesArray,
        ...updatedRows,
      ]
    })

    const payload = {
      ...restValues,
      visitOrderTemplateItemDtos: itemTypesArray,
      effectiveStartDate: effectiveDates[0],
      effectiveEndDate: effectiveDates[1],
    }

    // console.log(payload)

    dispatch({
      type: 'settingVisitOrderTemplate/upsert',
      payload,
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingVisitOrderTemplate/query',
        })
      }
    })
  },
  displayName: 'VisitOrderTemplateDetail',
})
class Detail extends PureComponent {
  render () {
    const { theme, footer, values, handleSubmit } = this.props
    return (
      <Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => {
                  return (
                    <TextField
                      label='Code'
                      autoFocus
                      disabled={!!values.id}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={(args) => {
                  return <TextField label='Display Value' {...args} />
                }}
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
            <GridItem md={12}>
              <FastField
                name='description'
                render={(args) => {
                  return (
                    <TextField
                      label='Description'
                      multiline
                      rowsMax={4}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>

          <InventoryItemList {...this.props} includeOrderSet />
        </div>
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </Fragment>
    )
  }
}

export default Detail
