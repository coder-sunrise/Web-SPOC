import React from 'react'
import Delete from '@material-ui/icons/Delete'
import {
  GridContainer,
  GridItem,
  Button,
  NumberInput,
  Popconfirm,
  Field,
  Tooltip,
} from '@/components'

const Adjustment = ({
  index,
  adjustments,
  dispatch,
  adjAmount,
  adjRemark,
  onDelete,
  amountProps,
}) => {
  // console.log('Adjustment', amountProps)
  return (
    <GridContainer style={{ margin: '4px 0' }}>
      <GridItem xs={9}>
        <div
          style={{
            width: '90%',
            overflow: 'hidden',
            display: 'inline-block',
            textOverflow: 'ellipsis',
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
          }}
        >
          <Popconfirm
            title='Do you want to remove this adjustment?'
            onConfirm={() => {
              onDelete(index)
            }}
          >
            <Tooltip title='Delete Adjustment'>
              <Button color='danger' size='sm' aria-label='Delete' justIcon>
                <Delete />
              </Button>
            </Tooltip>
          </Popconfirm>
          <Tooltip title={adjRemark}>
            <span>{adjRemark}</span>
          </Tooltip>
        </div>
      </GridItem>
      <GridItem xs={3}>
        <NumberInput value={adjAmount} {...amountProps} />
      </GridItem>
    </GridContainer>
  )
}

export default Adjustment
