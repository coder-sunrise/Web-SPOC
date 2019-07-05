import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import { NavPills, ProgressButton, Button } from '@/components'
import { withFormik } from 'formik'
import Yup from '@/utils/yup'
import { compose } from 'redux'
import DetailPanel from './Detail'

const styles = () => ({
  actionDiv: {
    float: 'right',
    textAlign: 'center',
    marginTop: '22px',
    marginRight: '10px',
  },
})

const Detail = ({
  classes,
  dispatch,
  scheme,
  schemeDetail,
  history,
  handleSubmit,
}) => {
  const detailProps = {
    schemeDetail,
    dispatch,
  }
  const { currentTab } = scheme
  return (
    <React.Fragment>
      <div className={classes.actionDiv}>
        <ProgressButton
          submitKey='schemeDetail/submit'
          onClick={handleSubmit}
        />
        <Button
          color='danger'
          onClick={() => {
            history.push('/finance/scheme')
          }}
        >
          Cancel
        </Button>
      </div>
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
        contentStyle={{ margin: '0 -5px' }}
        tabs={[
          {
            tabButton: 'Detail',
            tabContent: <DetailPanel {...detailProps} />,
          },
        ]}
      />
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ scheme, schemeDetail }) => ({
    scheme,
    schemeDetail,
  })),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ schemeDetail }) => {
      return schemeDetail.entity ? schemeDetail.entity : {}
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      revenueCategory: Yup.string().required(),
      effectiveStartDate: Yup.string().required(),
      effectiveEndDate: Yup.string().required(),
    }),
    handleSubmit: (values, { props }) => {
      const { dispatch } = props
      // dispatch({
      //   type: `${modelType}/submit`,
      //   payload: test,
      // }).then((r) => {
      //   if (r.message === 'Ok') {
      //     notification.success({
      //       message: 'Done',
      //     })
      //   }
      // })
    },
    displayName: 'FinanceSchemeDetail',
  }),
)(Detail)
