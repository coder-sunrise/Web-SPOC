import {
  GridContainer,
  GridItem,
  TextField,
  MultipleTextField,
} from '@/components'
import { FastField } from 'formik'
import { Input } from 'antd'
import withStyles from '@material-ui/core/styles/withStyles'

const style = theme => ({
  inputSplit: {
    backgroundColor: '#fff !important',
    width: '16px !important',
    borderLeft: 0,
    borderRight: 0,
    pointerEvents: 'none',
    textAlign: 'center !important',
    margin: '4px 0 !important',
    lineHeight: '1.3',
  },
  inputLeft: {
    width: '60px !important',
    textAlign: 'center !important',
    borderRightWidth: '0 !important',
    margin: '4px 0 !important',
    lineHeight: '1.3',
  },
  inputRight: {
    width: '60px !important',
    textAlign: 'center !important',
    borderLeftWidth: '0 !important',
    margin: '4px 0 !important',
    lineHeight: '1.3',
  },
})

const InputGroup = (leftProp, rightProp, classes) => (
  <Input.Group compact>
    <FastField
      name={leftProp}
      render={args => (
        <Input className={classes.inputLeft} {...args} {...args.field} />
      )}
    />
    <Input className={classes.inputSplit} placeholder='/' disabled />
    <FastField
      name={rightProp}
      render={args => (
        <Input className={classes.inputRight} {...args} {...args.field} />
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
              {...args}
              maxLength={2000}
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <div style={{ fontWeight: 500 }}> Vision</div>
      </GridItem>
      <GridContainer md={12}>
        <GridItem md={6} container>
          <GridItem md={1} />
          <GridItem md={2} style={{ paddingTop: 8 }}>
            Aided
          </GridItem>
          <GridItem md={9} container>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              RE
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              VA
            </GridItem>
            <GridItem md={10}>
              {InputGroup(
                `${prefixProp}.aided_RE_VA`,
                `${prefixProp}.aided_RE_VA_Comments`,
                classes,
              )}
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              LE
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              VA
            </GridItem>
            <GridItem md={10}>
              {InputGroup(
                `${prefixProp}.aided_LE_VA`,
                `${prefixProp}.aided_LE_VA_Comments`,
                classes,
              )}
            </GridItem>
          </GridItem>
        </GridItem>
        <GridItem md={6} container>
          <GridItem md={1} />
          <GridItem md={2} style={{ paddingTop: 8 }}>
            Unaided
          </GridItem>
          <GridItem md={9} container>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              RE
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              VA
            </GridItem>
            <GridItem md={10}>
              {InputGroup(
                `${prefixProp}.unaided_RE_VA`,
                `${prefixProp}.unaided_RE_VA_Comments`,
                classes,
              )}
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              LE
            </GridItem>
            <GridItem md={1} style={{ paddingTop: 8 }}>
              VA
            </GridItem>
            <GridItem md={10}>
              {InputGroup(
                `${prefixProp}.unaided_LE_VA`,
                `${prefixProp}.unaided_LE_VA_Comments`,
                classes,
              )}
            </GridItem>
          </GridItem>
        </GridItem>
      </GridContainer>
    </GridContainer>
  )
}
export default withStyles(style, { name: 'FollowUp' })(FollowUp)
