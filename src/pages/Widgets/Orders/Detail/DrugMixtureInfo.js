import { compose } from 'redux'
import LocalHospital from '@material-ui/icons/LocalHospital'
import { IconButton, Popover, Tooltip } from '@/components'

const DrugMixtureInfo = ({ values = {}, isShowTooltip = true }) => {
  const drugMixtureDetails = (rows = []) => {
    if (rows.length > 0) {
      let number = 0
      return rows.map((row) => {
        number += 1
        return (
          <p>
            {number}. {row.drugName} - {row.quantity} {row.uomCode}
          </p>
        )
      })
    }
    return null
  }

  return (
    <Popover
      icon={null}
      placement='bottomLeft'
      arrowPointAtCenter
      content={
        <div
          style={{
            fontSize: 14,
          }}
        >
          {drugMixtureDetails(values)}
        </div>
      }
    >
      <Tooltip title={isShowTooltip ? 'Drug Mixture' : ''}>
        <IconButton
          style={{
            position: 'absolute',
            bottom: 2,
            right: -5,
          }}
          size='medium'
        >
          <LocalHospital color='primary' />
        </IconButton>
      </Tooltip>
    </Popover>
  )
}

export default DrugMixtureInfo
