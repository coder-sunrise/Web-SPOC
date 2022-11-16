import React from 'react'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  NumberInput,
} from '@/components'
import { compose } from 'redux'
import { useTheme } from '@material-ui/styles'

let _withFormikExtend = withFormikExtend({
  mapPropsToValues: ({ settingTypeOfTest }) =>
    settingTypeOfTest.entity || settingTypeOfTest.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array()
      .of(Yup.date())
      .min(2)
      .required(),
    sortOrder: Yup.number(),
  }),
  handleSubmit: (values, { props: { toggleModal, dispatch }, resetForm }) => {
    let { effectiveDates, ...restValues } = values
    dispatch({
      type: 'settingTypeOfTest/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then(r => {
      if (r) {
        resetForm()
        dispatch({
          type: 'settingTypeOfTest/query',
        })
        toggleModal()
      }
    })
  },
})

let Detail = props => {
  let { footer, settingTypeOfTest, handleSubmit } = props
  let theme = useTheme()
  return (
    <React.Fragment>
      <div style={{ margin: theme.spacing(1) }}>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='code'
              render={args => (
                <TextField
                  label='Code'
                  autoFocus
                  {...args}
                  disabled={!!settingTypeOfTest.entity}
                />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='displayValue'
              render={args => <TextField label='Display Value' {...args} />}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='effectiveDates'
              render={args => {
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
          <GridItem md={6}>
            <FastField
              name='sortOrder'
              render={args => {
                return (
                  <NumberInput label='Sort Order' precision={0} {...args} />
                )
              }}
            />
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='description'
              render={args => {
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
      </div>
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: false,
          },
        })}
    </React.Fragment>
  )
}
export default compose(_withFormikExtend)(Detail)
