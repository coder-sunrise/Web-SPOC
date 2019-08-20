import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import {
  NavPills,
  ProgressButton,
  Button,
  withFormikExtend,
} from '@/components'

import { Divider } from '@material-ui/core'
import Yup from '@/utils/yup'
import { compose } from 'redux'
import DetailPanel from './Detail'
import Setting from './Setting'

const styles = (theme) => ({
  actionDiv: {
    margin: theme.spacing(1),
    textAlign: 'center',
    // float: 'right',
    // textAlign: 'center',
    // marginTop: '22px',
    // marginRight: '10px',
  },
})

const Detail = ({
  classes,
  dispatch,
  schemeDetail,
  history,
  height,
  handleSubmit,
  ...restProps
}) => {
  const detailProps = {
    schemeDetail,
    dispatch,
    height: 'calc(100vh - 183px)',
  }
  const { currentTab } = schemeDetail
  console.log(restProps)
  return (
    <div>
      <NavPills
        color='info'
        onChange={(event, active) => {
          history.push(
            getAppendUrl({
              t: active,
            }),
          )
        }}
        index={currentTab}
        contentStyle={{}}
        tabs={[
          {
            tabButton: 'Detail',
            tabContent: <DetailPanel {...detailProps} />,
          },
          {
            tabButton: 'Setting',
            tabContent: <Setting {...detailProps} />,
          },
        ]}
      />
      <Divider />
      <div className={classes.actionDiv}>
        <Button
          color='danger'
          onClick={() => {
            history.push('/finance/scheme')
          }}
        >
          Cancel
        </Button>
        <ProgressButton
          submitKey='schemeDetail/submit'
          onClick={handleSubmit}
        />
      </div>
    </div>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ schemeDetail }) => ({
    schemeDetail,
  })),
  withFormikExtend({
    mapPropsToValues: ({ schemeDetail }) => {
      return schemeDetail.entity ? schemeDetail.entity : schemeDetail.default
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      name: Yup.string().required(),
      // effectiveStartDate: Yup.string().required(),
      // effectiveEndDate: Yup.string().required(),
    }),
    handleSubmit: (values, { props }) => {
      const { effectiveDates, ...restValues } = values
      const { dispatch, onConfirm } = props
      dispatch({
        type: 'schemeDetail/upsert',
        payload: {
          ...restValues,
          effectiveStartDate: effectiveDates[0],
          effectiveEndDate: effectiveDates[1],
          roomStatusFK: 1,
        },
      }).then((r) => {
        if (r) {
          if (onConfirm) onConfirm()
          dispatch({
            type: 'schemeDetail/query',
            payload: {
              id: r.id,
            },
          })
        }
      })
    },
    displayName: 'FinanceSchemeDetail',
  }),
)(Detail)
