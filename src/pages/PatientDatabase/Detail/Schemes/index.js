import React, { PureComponent } from 'react'

import { GridContainer, GridItem } from '@/components'

import SchemesGrid from './SchemesGrid'
import PayersGrid from './PayersGrid'

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
      ...restProps
    } = this.props
    return (
      <GridContainer>
        <GridItem xs md={12}>
          <h4>Schemes</h4>
        </GridItem>
        <GridItem xs md={12} style={{ marginTop: 8 }}>
          <SchemesGrid
            rows={values.patientScheme}
            schema={schema.patientScheme._subType}
            values={values}
            {...restProps}
          />
        </GridItem>
        <GridItem xs md={12}>
          <h4 style={{ marginTop: 20 }}>Medisave Payer</h4>
        </GridItem>
        <GridItem xs md={12} style={{ marginTop: 8 }}>
          <PayersGrid
            enableAdd={values.patientScheme.find((o) => o.schemeTypeFK === 11)} //TODO: check is medisave added
            rows={values.schemePayer}
            schema={schema.schemePayer._subType}
            values={values}
            {...restProps}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

export default Schemes
