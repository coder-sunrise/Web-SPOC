import React, { PureComponent } from 'react'
import {
  TextField,
  GridContainer,
  GridItem,
  FastField,
  withFormikExtend,
} from '@/components'

@withFormikExtend({
  displayName: 'PurchasingReceivingWriteOffDetail',
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
                  <TextField label='Reason' autoFocused {...args} />
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
