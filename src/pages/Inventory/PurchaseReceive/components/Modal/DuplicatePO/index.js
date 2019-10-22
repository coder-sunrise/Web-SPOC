import React from 'react'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import { Button, GridContainer, GridItem } from '@/components'
import styles from './styles'

const DuplicatePO = ({ classes, onClose, purchaseReceiveList, actions: { handleNavigate } }) => {
  const { entity } = purchaseReceiveList
  return (
    <div>
      <GridContainer justify='center' alignItems='center'>
        <GridItem md={10} className={classes.reason}>
          <h4>
            {formatMessage({
              id: 'inventory.pr.duplicatePOConfirmation',
            })}
            <b>{entity.purchaseOrderNo}</b>
            {'?'}
          </h4>
        </GridItem>
        <Button
          color='danger'
          onClick={onClose}
        >
          Close
        </Button>
        <GridItem>
          <Button
            color='primary'
            onClick={() => handleNavigate('dup', entity.id)}
          >
            Confirm
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { name: 'DuplicatePO' })(DuplicatePO)

