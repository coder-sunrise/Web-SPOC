import {
  GridContainer,
  GridItem,
  TextField,
  MultipleTextField,
} from '@/components'
import { FastField } from 'formik'
import { Input } from 'antd'
import withStyles from '@material-ui/core/styles/withStyles'

const antdInput = {
  backgroundColor: '#fff !important',
  textAlign: 'center !important',
  margin: '4px 0 !important',
  lineHeight: '1.3',
}
const style = theme => ({
  inputSplit: {
    backgroundColor: '#fff !important',
    width: '10px !important',
    borderLeft: 0,
    borderRight: 0,
    pointerEvents: 'none',
    textAlign: 'center !important',
    margin: '4px 0 !important',
    lineHeight: '1.3',
    padding: '4px 0 ',
  },
  inputLeft: {
    ...antdInput,
    width: 'calc(50% - 5px) !important',
    borderRightWidth: '0 !important',
  },
  inputRight: {
    ...antdInput,
    width: 'calc(50% - 5px) !important',
    borderLeftWidth: '0 !important',
  },
  antdInput,
})

const InputGroup = (leftProp, rightProp, classes) => (
  <Input.Group compact>
    <FastField
      name={leftProp}
      render={args => (
        <Input className={classes.inputLeft} maxLength={500} {...args.field} />
      )}
    />
    <Input className={classes.inputSplit} placeholder='/' disabled />
    <FastField
      name={rightProp}
      render={args => (
        <Input className={classes.inputRight} maxLength={500} {...args.field} />
      )}
    />
  </Input.Group>
)

const FollowUp = props => {
  const { prefixProp, classes } = props
  return (
    <GridContainer style={{ marginTop: 8 }}>
      <GridItem md={12}>
        <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
          Follow-Up
        </span>
      </GridItem>
      <GridItem md={12}>
        <div style={{ fontWeight: 500 }}> History</div>
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.history`}
          render={args => (
            <MultipleTextField
              label=''
              maxLength={2000}
              autoSize={{ minRows: 2 }}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <div style={{ fontWeight: 500 }}> Vision</div>
      </GridItem>
      <GridContainer md={12}>
        <GridItem md={6} container>
          <GridItem md={3} style={{ paddingTop: 8, textAlign: 'right' }}>
            Aided
          </GridItem>
          <GridItem md={9} container>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              RE
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              VA
            </GridItem>
            <GridItem md={10} container>
              <GridItem md={6}>
                {InputGroup(
                  `${prefixProp}.aided_RE_VA`,
                  `${prefixProp}.aided_RE_VA_Comments`,
                  classes,
                )}
              </GridItem>
              <GridItem md={4}>
                <FastField
                  name={`${prefixProp}.aided_RE_PH`}
                  render={args => (
                    <Input
                      maxLength={500}
                      placeholder='PH'
                      className={classes.antdInput}
                      {...args.field}
                    />
                  )}
                />
              </GridItem>
            </GridItem>

            <GridItem md={1} style={{ paddingTop: 8 }}>
              LE
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              VA
            </GridItem>
            <GridItem md={10} container>
              <GridItem md={6}>
                {InputGroup(
                  `${prefixProp}.aided_LE_VA`,
                  `${prefixProp}.aided_LE_VA_Comments`,
                  classes,
                )}
              </GridItem>
              <GridItem md={4}>
                <FastField
                  name={`${prefixProp}.aided_LE_PH`}
                  render={args => (
                    <Input
                      maxLength={500}
                      placeholder='PH'
                      className={classes.antdInput}
                      {...args.field}
                    />
                  )}
                />
              </GridItem>
            </GridItem>
          </GridItem>
        </GridItem>
        <GridItem md={6} container>
          <GridItem md={3} style={{ paddingTop: 8, textAlign: 'right' }}>
            Unaided
          </GridItem>
          <GridItem md={9} container>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              RE
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              VA
            </GridItem>
            <GridItem md={10} container>
              <GridItem md={8}>
                {InputGroup(
                  `${prefixProp}.unaided_RE_VA`,
                  `${prefixProp}.unaided_RE_VA_Comments`,
                  classes,
                )}
              </GridItem>
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              LE
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              VA
            </GridItem>
            <GridItem md={10} container>
              <GridItem md={8}>
                {InputGroup(
                  `${prefixProp}.unaided_LE_VA`,
                  `${prefixProp}.unaided_LE_VA_Comments`,
                  classes,
                )}
              </GridItem>
            </GridItem>
          </GridItem>
        </GridItem>
      </GridContainer>
    </GridContainer>
  )
}
export default withStyles(style, { name: 'FollowUp' })(FollowUp)
