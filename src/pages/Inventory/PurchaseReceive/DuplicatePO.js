import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import {
  TextField,
  GridContainer,
  GridItem,
  FastField,
  withFormikExtend,
} from '@/components'

@withFormikExtend({
  displayName: 'PurchasingReceivingWriteOffDetail',
  mapPropsToValues: ({ purchasingReceiving }) =>
    purchasingReceiving.entity || purchasingReceiving.default,
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, history, purchasingReceiving } = props
    const { id } = purchasingReceiving.entity
    const { location } = history

    onConfirm()
    history.push(`${location.pathname}/pdodetails?id=${id}&type=dup`)
  },
})
class DuplicatePO extends PureComponent {
  render() {
    const { props } = this
    const { theme, footer, purchasingReceiving } = props
    const { entity } = purchasingReceiving

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={12}>
              <h3>
                {formatMessage({
                  id: 'inventory.pr.duplicatePOConfirmation',
                })}
                <b>{entity.poNo}</b>
                {'?'}
              </h3>
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default DuplicatePO
