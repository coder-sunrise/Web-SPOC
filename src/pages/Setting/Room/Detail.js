import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import _ from 'lodash'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { withStyles, Tooltip } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  Select,
  ProgressButton,
  DateRangePicker,
  Switch,
  EditableTableGrid2,
  notification,
  SizeContainer,
} from '@/components'

const styles = (theme) => ({})

const itemSchema = Yup.object().shape({
  serviceCenter: Yup.string().required(),
  sellingPrice: Yup.number().required(),
})

@withFormikExtend({
  a: 134,
  mapPropsToValues: ({ settingRoom }) =>
    settingRoom.entity || settingRoom.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    items: Yup.array().compact((v) => v.isDeleted).of(itemSchema),
  }),
  handleSubmit: (values, { props }) => {
    const { effectiveDates, ...restValues } = values
    props
      .dispatch({
        type: 'settingRoom/upsert',
        payload: {
          ...restValues,
          effectiveStartDate: effectiveDates[0],
          effectiveEndDate: effectiveDates[1],
          roomStatusFK: 1,
        },
      })
      .then((r) => {
        if (r) {
          if (props.onConfirm) props.onConfirm()
          props.dispatch({
            type: 'settingRoom/query',
          })
        }
      })
  },
  displayName: 'RoomDetail',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const { classes, theme, footer, values } = props
    // console.log('detail', props)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => (
                  <TextField label='Code' autoFocused {...args} />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={(args) => <TextField label='Display Value' {...args} />}
              />
            </GridItem>
            <GridItem md={12}>
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
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default Detail
