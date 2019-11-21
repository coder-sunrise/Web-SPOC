import React, { PureComponent } from 'react'

import { withStyles } from '@material-ui/core'
import { GridContainer, GridItem } from '@/components'

import SchemesGrid from './SchemesGrid'
import PayersGrid from './PayersGrid'

const styles = () => ({})
class Schemes extends PureComponent {
  state = {}

  render () {
    const {
      classes,
      schemes,
      payers,
      dispatch,
      values,
      schema,
      theme,
      ...restProps
    } = this.props
    return (
      <div>
        <h4>Schemes</h4>
        <SchemesGrid
          rows={values.patientScheme}
          schema={schema.patientScheme._subType}
          values={values}
          {...restProps}
        />
        {/* TODO: hide medisave payer until feature is fully built */}
        {/* <h4
          style={{
            marginTop: theme.spacing(2),
          }}
        >
          Medisave Payer
        </h4>
        <PayersGrid
          enableAdd={values.patientScheme ? values.patientScheme.find((o) => o.schemeTypeFK === 11): false} // TODO: check is medisave added
          rows={values.schemePayer}
          schema={schema.schemePayer._subType}
          values={values}
          {...restProps}
        /> */}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Schemes)
