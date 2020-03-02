import React, { useState, useEffect, useRef } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { connect } from 'dva'

import { GridContainer, GridItem } from '@/components'

import DiagnosisPanel from './DiagnosisPanel'
import TreatmentForm from './TreatmentForm'
import RightPanel from './RightPanel/index.js'
import Chart from './Chart'
import model from './models'
import modelSetup from './models/setup'

window.g_app.replaceModel(model)
window.g_app.replaceModel(modelSetup)

const styles = (theme) => ({
  paper: {
    display: 'flex',
    border: `1px solid ${theme.palette.divider}`,
    flexWrap: 'wrap',
    height: '100%',
  },
  divider: {
    alignSelf: 'stretch',
    height: 'auto',
    margin: theme.spacing(1, 0.5),
    padding: 0,
    width: 0,
  },

  toothJournal: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  toothJournalItem: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: theme.spacing(1),
  },
  toothJournalItemSecondaryAction: {
    paddingRight: theme.spacing(3),
  },
  toothJournalItemText: {
    margin: theme.spacing(0),
  },
  // toothJournalSecondaryAction: {
  //   right: theme.spacing(1),
  //   display: 'none',
  // },
  toothIcon: {
    minWidth: 'auto',
  },
  sortableContainer: {
    // overflow: 'hidden',
    // backgroundColor: 'red',
  },
  attachmentContainer: {
    margin: 0,
    width: 'auto',
  },
  treatmentListItem: {
    padding: 0,
  },

  groupBtns: {
    display: 'block',
  },

  groupBtnRoot: {
    '&.Mui-disabled': {
      color: 'inherit',
    },
  },
  groupBtnGroupRoot: {
    display: 'block',
    marginBottom: theme.spacing(1),
  },
  buttonIcon: {
    position: 'absolute',
    left: -1,
    top: -1,
  },
  grouped: {
    fontSize: '0.75rem',
    margin: theme.spacing(0.25, 0, 0.25, 0.5),
    // border: 'none',
    '&:not(:first-child)': {
      marginLeft: theme.spacing(0.5),
      borderRadius: Number(theme.shape.borderRadius),
      borderLeft: '1px solid rgba(0, 0, 0, 0.38)',
    },
    '&:first-child': {
      borderRadius: Number(theme.shape.borderRadius),
    },
    height: 33,
    lineHeight: 1,
    // whiteSpace: 'nowrap',
    paddingLeft: 37,
    overflow: 'hidden',
    width: 194,
    border: '1px solid rgba(0, 0, 0, 0.38)',
    // borderRadius: '8px',
  },
})

@connect(
  ({
    dentalChartComponent,
    dentalChartSetup,
    orders,
    codetable,
    consultation,
    global,
  }) => ({
    dentalChartComponent,
    dentalChartSetup,
    orders,
    codetable,
    consultation,
    global,
  }),
)
class DentalChart extends React.Component {
  constructor (props) {
    super(props)
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'ctchartmethod' },
    })
    this.props.dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'cttreatment' },
    })
  }

  componentWillReceiveProps (np) {
    if (
      this.props.dentalChartComponent.data.length === 0 &&
      np.consultation.entity &&
      np.consultation.entity.corDentalCharts[0]
    ) {
      const data = JSON.parse(
        np.consultation.entity.corDentalCharts[0].dentalChart,
      )
      if (data.length > 0) {
        const d = {
          ...np.consultation.entity.corDentalCharts[0],
          data,
        }
        delete d.dentalChart
        this.props.dispatch({
          type: 'dentalChartComponent/updateState',
          payload: d,
        })
      }
    }
  }

  render () {
    const {
      className,
      canvasDivStyle,
      theme,
      index,
      arrayHelpers,
      diagnosises,
      classes,
      form,
      field,
      style,
      onChange,
      value,
      onDataSouceChange,
      dentalChartComponent,
      dispatch,
      ...props
    } = this.props
    const { mode } = dentalChartComponent
    return (
      <div className={className} style={{ padding: `${theme.spacing(1)}px 0` }}>
        <GridContainer gutter={theme.spacing(0.5)}>
          <GridItem md={8}>
            <div style={{ marginBottom: theme.spacing(1) }}>
              <Chart {...this.props} />
            </div>
            {mode === 'diagnosis' && (
              <DiagnosisPanel searchable {...this.props} />
            )}
            {mode === 'treatment' && <TreatmentForm {...this.props} />}
          </GridItem>
          <GridItem md={4}>
            <RightPanel {...this.props} />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(DentalChart)
