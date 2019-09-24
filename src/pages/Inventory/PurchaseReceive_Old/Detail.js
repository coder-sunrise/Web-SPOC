import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import Yup from '@/utils/yup'
import {
  TextField,
  GridContainer,
  GridItem,
  FastField,
  withFormikExtend,
} from '@/components'

@withFormikExtend({
  displayName: 'PurchasingReceivingWriteOffDetail',
  validationSchema: Yup.object().shape({
    reason: Yup.string().required(),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm } = props
    onConfirm()
    dispatch({
      type: 'purchasingReceiving/query',
    })
  },
})
class Detail extends PureComponent {
  render () {
    const { props } = this
    const { theme, footer, purchasingReceiving } = props

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={12}>
              <FastField
                name='reason'
                render={(args) => (
                  <TextField
                    label={formatMessage({
                      id: 'inventory.pr.reason',
                    })}
                    autoFocused
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Write-Off',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default Detail
