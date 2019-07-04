import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import { NavPills, ProgressButton, Button } from '@/components'
import { withFormik } from 'formik'
import Yup from '@/utils/yup'
import { compose } from 'redux'
import DetailPanel from './Detail'
import Pricing from '../../Pricing'
import Stock from '../../Stock'

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
  consumable,
  consumableDetail,
  history,
  handleSubmit,
}) => {
  const { currentTab } = consumable

  const detailProps = {
    consumableDetail,
    dispatch,
  }
  return (
    <React.Fragment>
      <div className={classes.actionDiv}>
        <ProgressButton
          submitKey='consumableDetail/submit'
          onClick={handleSubmit}
        />
        <Button
          color='danger'
          onClick={() => {
            history.push('/inventory/master?t=1')
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
          {
            tabButton: 'Pricing',
            tabContent: <Pricing />,
          },
          {
            tabButton: 'Stock',
            tabContent: <Stock />,
          },
        ]}
      />
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ consumable, consumableDetail }) => ({
    consumable,
    consumableDetail,
  })),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ consumableDetail }) => {
      return consumableDetail.entity ? consumableDetail.entity : {}
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
    displayName: 'InventoryConsumableDetail',
  }),
)(Detail)
