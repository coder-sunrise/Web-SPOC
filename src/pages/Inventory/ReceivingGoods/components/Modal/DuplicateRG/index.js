import React from 'react'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import { Button, GridContainer, GridItem } from '@/components'

const styles = (theme) => ({
  reason: {
    marginBottom: theme.spacing(2),
  },
})

const DuplicateRG = ({
  classes,
  onClose,
  receivingGoodsList,
  actions: { handleNavigate },
}) => {
  const { entity } = receivingGoodsList
  return (
    <div>
      <GridContainer justify='center' alignItems='center'>
        <GridItem md={10} className={classes.reason}>
          <h4>
            {formatMessage({
              id: 'inventory.rg.duplicateRGConfirmation',
            })}
            <b>{entity.receivingGoodsNo}</b>
            ?
          </h4>
        </GridItem>
        <Button color='danger' onClick={onClose}>
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

export default withStyles(styles, { name: 'DuplicateRG' })(DuplicateRG)
