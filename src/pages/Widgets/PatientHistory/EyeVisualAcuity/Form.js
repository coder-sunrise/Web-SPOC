import React from 'react'
import { withStyles } from '@material-ui/core'

import {
  GridContainer,
  GridItem,
  TextField,
  Switch,
  Checkbox,
  OutlinedTextField,
} from '@/components'

const styles = (theme) => ({
  table: {
    '& th': {
      textAlign: 'center',
    },
    '& td,th': {
      border: '1px solid rgba(0, 0, 0, 0.42)',
      // verticalAlign: 'top',
    },
  },
  inputRoot: {
    paddingLeft: 2,
    paddingRight: 5,
    '&:before': {
      // right: 30,
      // left: 10,
      left: 2,
      right: 16,
    },
    '&:after': {
      // right: 30,
      // left: 10,
      left: 2,
      right: 16,
    },
    '& > input': {
      textAlign: 'center',
    },
  },
  inputSpecs: {
    '&:before': {
      right: 30,
      left: 74,
    },
    '&:after': {
      right: 30,
      left: 74,
    },
  },
})
const Form = ({ classes, theme, current }) => {
  const cfg = {
    extraClasses: {
      root: classes.inputRoot,
    },
    simple: true,
    disabled: true,
  }
  return (
    <div style={{ minWidth: 700 }}>
      {current.eyeVisualAcuityTestForms.map((val) => {
        return (
          <React.Fragment>
            <table className={classes.table}>
              <colgroup>
                <col width='20%' />
                <col width='40%' />
                <col width='40%' />
              </colgroup>
              <tr style={{ height: 40 }}>
                <th />
                <th>OD</th>
                <th>OS</th>
              </tr>
              <tr>
                <td>
                  <GridContainer>
                    <GridItem
                      xs={12}
                      direction='column'
                      justify='flex-start'
                      alignItems='flex-start'
                      style={{ minWidth: 235 }}
                    >
                      <Switch
                        onOffMode={false}
                        value={val.isAided}
                        prefix='Distance / Near VA'
                        unCheckedChildren='Unaided'
                        checkedChildren='Aided'
                        disabled
                      />
                      <Checkbox
                        label='Own Specs'
                        checked={val.isOwnSpecs}
                        disabled
                      />
                      <div
                        style={{
                          position: 'relative',
                        }}
                      >
                        <Checkbox
                          label='Refraction On'
                          checked={val.isRefractionOn}
                          disabled
                        />
                        <TextField
                          disabled
                          value={val.refractionOnRemarks}
                          style={{
                            position: 'absolute',
                            bottom: 8,
                            left: 130,
                          }}
                          simple
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                </td>
                <td>
                  <GridContainer gutter={0}>
                    <GridItem xs={3}>
                      <div style={{ display: 'flex' }}>
                        <span style={{ marginTop: 5 }}>D</span>
                        <TextField {...cfg} value={val.nearVADOD} />
                      </div>
                    </GridItem>
                    <GridItem xs={3}>
                      <div style={{ display: 'flex' }}>
                        <span style={{ marginTop: 5 }}>PH</span>
                        <TextField {...cfg} value={val.nearVAPHOD} />
                      </div>
                    </GridItem>
                    <GridItem xs={6} />
                    <GridItem xs={3}>
                      <div style={{ display: 'flex' }}>
                        <span style={{ marginTop: 5 }}>N</span>
                        <TextField
                          suffix='@'
                          suffixProps={{ style: { right: -5 } }}
                          {...cfg}
                          value={val.nearVANOD}
                        />
                      </div>
                    </GridItem>
                    <GridItem xs={3}>
                      <TextField
                        suffix='cm'
                        suffixProps={{ style: { right: -10 } }}
                        {...cfg}
                        value={val.nearVAcmOD}
                      />
                    </GridItem>
                    <GridItem xs={6} />
                  </GridContainer>
                </td>
                <td>
                  <GridContainer gutter={0}>
                    <GridItem xs={3}>
                      <div style={{ display: 'flex' }}>
                        <span style={{ marginTop: 5 }}>D</span>
                        <TextField {...cfg} value={val.nearVADOS} />
                      </div>
                    </GridItem>
                    <GridItem xs={3}>
                      <div style={{ display: 'flex' }}>
                        <span style={{ marginTop: 5 }}>PH</span>
                        <TextField {...cfg} value={val.nearVAPHOS} />
                      </div>
                    </GridItem>
                    <GridItem xs={6} />
                    <GridItem xs={3}>
                      <div style={{ display: 'flex' }}>
                        <span style={{ marginTop: 5 }}>N</span>
                        <TextField
                          suffix='@'
                          suffixProps={{ style: { right: -5 } }}
                          {...cfg}
                          value={val.nearVANOS}
                        />
                      </div>
                    </GridItem>
                    <GridItem xs={3}>
                      <TextField
                        suffix='cm'
                        suffixProps={{ style: { right: -10 } }}
                        {...cfg}
                        value={val.nearVAcmOS}
                      />
                    </GridItem>
                    <GridItem xs={6} />
                  </GridContainer>
                </td>
              </tr>

              <tr>
                <td style={{ paddingBottom: theme.spacing(1) }}>
                  <GridContainer>
                    <GridItem
                      xs={12}
                      direction='column'
                      justify='flex-start'
                      alignItems='flex-start'
                    >
                      <Checkbox
                        label='No Specs'
                        checked={val.isNoSpec}
                        disabled
                      />
                      <TextField value='Specs Rx' text />
                      <TextField
                        extraClasses={{
                          root: classes.inputSpecs,
                        }}
                        prefix='Specs Age'
                        suffix='yrs'
                        simple
                        value={val.specsAge}
                      />
                    </GridItem>
                  </GridContainer>
                </td>
                <td>
                  <GridContainer gutter={0}>
                    <GridItem xs={3}>
                      <TextField suffix='/' {...cfg} value={val.specSphereOD} />
                    </GridItem>
                    <GridItem xs={3}>
                      <TextField
                        suffix='X'
                        {...cfg}
                        value={val.specCylinderOD}
                      />
                    </GridItem>
                    <GridItem xs={3}>
                      <TextField suffix='(' {...cfg} value={val.specAxisOD} />
                    </GridItem>
                    <GridItem xs={3}>
                      <TextField suffix=')' {...cfg} value={val.specVaOD} />
                    </GridItem>
                  </GridContainer>
                </td>
                <td>
                  <GridContainer gutter={0}>
                    <GridItem xs={3}>
                      <TextField suffix='/' {...cfg} value={val.specSphereOS} />
                    </GridItem>
                    <GridItem xs={3}>
                      <TextField
                        suffix='X'
                        {...cfg}
                        value={val.specCylinderOS}
                      />
                    </GridItem>
                    <GridItem xs={3}>
                      <TextField suffix='(' {...cfg} value={val.specAxisOS} />
                    </GridItem>
                    <GridItem xs={3}>
                      <TextField suffix=')' {...cfg} value={val.specVaOS} />
                    </GridItem>
                  </GridContainer>
                </td>
              </tr>
            </table>
            <GridContainer gutter={0} style={{ marginTop: theme.spacing(1) }}>
              <GridItem xs={12}>
                <OutlinedTextField
                  label='Remarks'
                  rows={3}
                  multiline
                  value={val.remark}
                />
              </GridItem>
            </GridContainer>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(Form)
