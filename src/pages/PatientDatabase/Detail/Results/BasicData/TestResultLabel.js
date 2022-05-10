import { withStyles } from '@material-ui/core'
import { Tooltip } from '@/components'
import { compose } from 'redux'
import numeral from 'numeral'
import { TESTTYPES, GENDER } from '@/utils/constants'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'
const styles = theme => ({})
const TestResultLabel = ({
  testCode,
  value,
  format,
  tooltip,
  valueType,
  genderFK,
}) => {
  let showWarnning
  let showValue = value
  if (hasValue(value) && value !== 'NA') {
    if (valueType === 'boolean') {
      showValue = value ? 'Yes' : 'No'
    } else {
      showValue = `${format ? numeral(value).format(format) : value}`
    }

    switch (testCode) {
      case TESTTYPES.BPSYS:
        if (value >= 130) {
          showWarnning = true
        }
        break
      case TESTTYPES.BPDIA:
        if (value >= 85) {
          showWarnning = true
        }
        break
      case TESTTYPES.BMI:
        if (value < 18.5 || value > 25) {
          showWarnning = true
        }
        break
      case TESTTYPES.ROHRER:
        if (value < 120 || value > 160) {
          showWarnning = true
        }
        break
      case TESTTYPES.KAUP:
        if (value < 15 || value > 18) {
          showWarnning = true
        }
        break
      case TESTTYPES.WAIST:
        if (genderFK === GENDER.FEMALE && value >= 90) {
          showWarnning = true
        } else if (genderFK === GENDER.MALE && value >= 85) {
          showWarnning = true
        }
        break
      case TESTTYPES.IOP:
        if (value < 8 || value > 20) {
          showWarnning = true
        }
        break
      case TESTTYPES.AUDIOMETRY:
        if (value > 30) {
          showWarnning = true
        }
        break
      case TESTTYPES.COLORVISIONTEST:
        if (value === 'Abnormal') {
          showWarnning = true
        }
        break
    }
  }
  return (
    <span>
      <Tooltip title={tooltip}>
        <span
          style={{
            color: showWarnning ? 'red' : 'black',
            cursor: tooltip ? 'pointer' : 'default',
          }}
        >
          {showValue}
        </span>
      </Tooltip>
    </span>
  )
}
export default compose(withStyles(styles))(TestResultLabel)
