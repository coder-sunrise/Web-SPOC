import { Checkbox } from '@/components'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'

const _styles = withStyles(
  theme => ({
    itemTable: {
      width: '100%',
      marginBottom: theme.spacing(1),
      '& > tr > td': {
        border: '1px solid #ccc',
        height: theme.spacing(8),
      },
      '& > tr > td > div': {
        height: '100%',
        position: 'relative',
      },
      '& td[width="5%"]': {
        textAlign: 'center',
      },
    },
  }),
  { withTheme: true },
)

const CoverTest = props => {
  let {
    theme: { spacing },
    classes,
  } = props

  return (
    <div>
      <table className={classes.itemTable}>
        <tr>
          <td rowspan='2' width='30%'>
            <div>
              <div
                style={{ position: 'absolute', top: spacing(2), left: '5px' }}
              >
                <p>CoverTest</p>
                <p style={{ fontSize: '0.8rem' }}>
                  <em>(including its magnitude and direction)</em>
                </p>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: spacing(10),
                  left: '5px',
                }}
              >
                <div style={{ display: 'inline-block' }}>
                  <Checkbox label='with Rx' disabled checked={props?.withRx} />
                </div>
                <div
                  style={{ display: 'inline-block', marginLeft: spacing(3) }}
                >
                  <Checkbox
                    label='without Rx'
                    disabled
                    checked={props?.withoutRx}
                  />
                </div>
              </div>
            </div>
          </td>
          <td width='5%'>D</td>
          <td>
            <div>{props?.coverTestD}</div>
          </td>
        </tr>
        <tr>
          <td width='5%'>N</td>
          <td>
            <div>{props?.coverTestN}</div>
          </td>
        </tr>
      </table>
    </div>
  )
}

export default compose(_styles)(CoverTest)
