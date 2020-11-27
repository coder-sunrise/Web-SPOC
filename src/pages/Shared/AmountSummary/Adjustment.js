import React from 'react'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
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
  onEdit,
  amountProps,
  type,
  theme,
  hiddenDelete = false,
  hideEdit = true,
}) => {
  // console.log('Adjustment', amountProps)
  const isExactAmount = type === 'ExactAmount'
  return (
    <GridContainer>
      <GridItem xs={6}>
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            display: 'inline-block',
            textOverflow: 'ellipsis',
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
            marginLeft: theme.spacing(2),
            textAlign: 'right',
          }}
        >
          <Tooltip title={adjRemark}>
            <span>
              {adjRemark}
              {/* {adjRemark} {!isExactAmount && `(${Math.abs(adjValue)}%)`} */}
            </span>
          </Tooltip>
        </div>
      </GridItem>
      <GridItem xs={2}>
        {(
          <Tooltip title='Edit Adjustment'>
            <Button
              color='primary'
              size='sm'
              aria-label='Edit'
              justIcon
              onClick={() => {
                onEdit(index)
              }}
              style={{
                marginLeft: theme.spacing(2),
              }}
            >
              <Edit />
            </Button>
          </Tooltip>
        )}
        {!hiddenDelete && (
          <Tooltip title='Delete Adjustment'>
            <Button
              color='danger'
              size='sm'
              aria-label='Delete'
              justIcon
              onClick={() => {
                onDelete(index)
              }}
              style={{
                marginLeft: 0,
              }}
            >
              <Delete />
            </Button>
          </Tooltip>
        )}
      </GridItem>
      <GridItem xs={4}>
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
