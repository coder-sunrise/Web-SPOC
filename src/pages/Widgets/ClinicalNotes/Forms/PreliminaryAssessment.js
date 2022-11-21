import { TextField, Button, MultipleTextField, DatePicker } from '@/components'
import { FastField } from 'formik'
import Edit from '@material-ui/icons/Edit'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'

const _styles = withStyles(
  theme => ({
    containerTable: {
      width: '100%',
      border: '1px solid #ccc',
      borderCollapse: 'separate',
      borderSpacing: '15px',
      '& > tr > td': {
        height: theme.spacing(10),
      },
    },
    itemTable: {
      width: '100%',
      '& > tr > td': {
        border: '1px solid #ccc',
        height: theme.spacing(10),
      },
      '& > tr > td > div': {
        height: '100%',
        position: 'relative',
      },
      '& td[width="5%"]': {
        textAlign: 'center',
      },
    },
    itemTitle: {
      position: 'absolute',
      top: '5px',
      left: '5px',
    },
  }),
  { withTheme: true },
)
let PreliminaryAssessment = props => {
  let { prefixProp, classes, theme } = props
  return (
    <table className={classes.containerTable}>
      <tr>
        <span style={{ fontWeight: 500, fontSize: '1rem' }}>
          Preliminary Assessment
        </span>
      </tr>

      {/* Pupillary Assessment */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr height={theme.spacing(15)}>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Pupillary Assessment
                  </span>
                </div>
              </td>
              <td width='70%'>
                <div>
                  <Button
                    justIcon
                    color='primary'
                    style={{ top: '5px', left: '5px' }}
                    onClick={() => {}}
                  >
                    <Edit />
                  </Button>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Pupillary Size (Bright / dm)  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Pupillary Size (Bright / dm){' '}
                  </span>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.pupillarySizeRe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>LE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.pupillarySizeLe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Keratometry Reading  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Keratometry Reading</span>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.keratometryReadingRe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>LE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.keratometryReadingLe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Tonometry Instrument  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Tonometry Instrument{' '}
                  </span>
                  <div
                    style={{
                      width: '80%',
                      position: 'absolute',
                      top: '15px',
                      left: '5px',
                    }}
                  >
                    <FastField
                      name={`${prefixProp}.tonometryInstrument`}
                      render={args => <TextField label='' {...args} />}
                    />
                  </div>
                  <div
                    style={{
                      width: '80%',
                      position: 'absolute',
                      top: '35px',
                      left: '5px',
                    }}
                  >
                    <FastField
                      name={`${prefixProp}.tonometryInstrumentTime`}
                      render={args => <DatePicker label='Time' {...args} />}
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.tonometryInstrument`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>LE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.peratometryReadingLe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Confrontation  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Confrontation</span>
                </div>
              </td>

              <td width='70%'>
                <div>
                  <Button
                    justIcon
                    color='primary'
                    style={{ top: '5px', left: '5px' }}
                    onClick={() => {}}
                  >
                    <Edit />
                  </Button>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Amsler  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Amsler</span>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.amslerRe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>LE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.amslerLe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Colour Vision  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>Colour Vision</span>
                  <div
                    style={{
                      width: '80%',
                      position: 'absolute',
                      top: '15px',
                      left: '5px',
                    }}
                  >
                    <FastField
                      name={`${prefixProp}.colourVisionTot`}
                      render={args => (
                        <TextField label='Type of test' {...args} />
                      )}
                    />
                  </div>
                </div>
              </td>
              <td width='5%'>RE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.colourVisionRe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
              <td width='5%'>LE</td>
              <td width='30%'>
                <FastField
                  name={`${prefixProp}.colourVisionLe`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>

      {/* Other relevant Tests  */}
      <tr>
        <td>
          <table className={classes.itemTable}>
            <tr>
              <td width='30%'>
                <div>
                  <span className={classes.itemTitle}>
                    Other relevant Tests
                  </span>
                </div>
              </td>

              <td width='70%'>
                <FastField
                  name={`${prefixProp}.otherRelevantTests`}
                  render={args => (
                    <MultipleTextField
                      maxLength={2000}
                      bordered={false}
                      autoSize={{ minRows: 3 }}
                      {...args}
                    />
                  )}
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  )
}
export default compose(_styles)(PreliminaryAssessment)
