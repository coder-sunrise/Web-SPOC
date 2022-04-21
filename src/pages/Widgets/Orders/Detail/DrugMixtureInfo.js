import { compose } from 'redux'
import LocalHospital from '@material-ui/icons/LocalHospital'
import { IconButton, Popover, Tooltip } from '@/components'

const DrugMixtureInfo = ({ values = {}, isShowTooltip = true }) => {
  const drugMixtureDetails = (rows = []) => {
    if (rows.length > 0) {
      let number = 0
      return rows.map(row => {
        number += 1
        return (
          <p>
            {number}. {row.drugName} - {row.quantity} {row.uomDisplayValue}
          </p>
        )
      })
    }
    return null
  }

  return (
    <Tooltip
      title={
        isShowTooltip ? (
          <div
            style={{
              fontSize: 14,
            }}
          >
            <strong>Drug Mixture</strong>
            {drugMixtureDetails(values)}
          </div>
        ) : (
          ''
        )
      }
    >
      <IconButton size='medium'>
        <LocalHospital color='primary' />
      </IconButton>
    </Tooltip>
  )
}

export default DrugMixtureInfo
