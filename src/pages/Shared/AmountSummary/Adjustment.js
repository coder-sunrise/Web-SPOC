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
  adjValue,
  adjRemark,
  onDelete,
  amountProps,
  type,
}) => {
  // console.log('Adjustment', amountProps)
  const isExactAmount = type === 'ExactAmount'
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
            <span>
              {adjRemark}
              {/* {adjRemark} {!isExactAmount && `(${Math.abs(adjValue)}%)`} */}
            </span>
          </Tooltip>
        </div>
      </GridItem>
      <GridItem xs={3}>
        <NumberInput
          value={adjAmount}
          {...amountProps}
          // currency={isExactAmount}
          // percentage={!isExactAmount}
        />
      </GridItem>
    </GridContainer>
  )
}

export default Adjustment
