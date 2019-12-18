import React, { useState, useEffect } from 'react'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { Field, FastField } from 'formik'
import _ from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
import History from '@material-ui/icons/History'
import moment from 'moment'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  Checkbox,
  Popover,
  Tooltip,
  Select,
  ButtonSelect,
  Tabs,
} from '@/components'
import Diagnosis from './Diagnosis'

const RightPanel = (props) => {
  const {
    dispatch,
    theme,
    index,
    arrayHelpers,
    classes,
    form,
    field,
    style,
    onChange,
    value,
    mode,
    onDataSouceChange,
    dentalChartComponent,
    ...restProps
  } = props
  const { data = {}, pedoChart, surfaceLabel } = dentalChartComponent

  return (
    <Paper elevation={0} className={classes.paper}>
      <div>
        <GridContainer style={{ height: 'auto' }}>
          <GridItem xs={5}>
            <Checkbox
              label='Pedo Chart'
              checked={pedoChart}
              style={{ marginLeft: 8 }}
              onChange={(v) => {
                dispatch({
                  type: 'dentalChartComponent/updateState',
                  payload: {
                    pedoChart: v.target.value,
                  },
                })
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <Checkbox
              label='Surface Label'
              checked={surfaceLabel}
              onChange={(v) => {
                dispatch({
                  type: 'dentalChartComponent/updateState',
                  payload: {
                    surfaceLabel: v.target.value,
                  },
                })
              }}
            />
          </GridItem>
          <GridItem
            xs={1}
            gutter={0}
            style={{ lineHeight: theme.props.singleRowHeight }}
          >
            <Tooltip title='History' placement='left'>
              <Button size='sm' onClick={() => {}} justIcon color='primary'>
                <History />
              </Button>
            </Tooltip>
          </GridItem>
          <GridItem xs={12}>
            <Tabs
              // style={{ marginTop: 20 }}
              defaultActiveKey='0'
              options={[
                {
                  id: 1,
                  name: 'Diagnosis',
                  content: <Diagnosis {...props} />,
                },
                {
                  id: 2,
                  name: 'Treatment',
                  content: <div>2</div>,
                },
              ]}
            />
          </GridItem>
        </GridContainer>
      </div>
    </Paper>
  )
}

export default RightPanel
