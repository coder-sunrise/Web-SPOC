import React from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import { NavPills, ProgressButton, Button } from '@/components'
import { compose } from 'redux'
import { withFormik } from 'formik'
import Yup from '@/utils/yup'
import DetailPanel from './Detail'
import Pricing from '../../Pricing'
import Stock from '../../Stock'
import Setting from '../../Setting'

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
  medication,
  medicationDetail,
  history,
  handleSubmit,
  setFieldValue,
}) => {
  const { currentTab } = medication

  const detailProps = {
    medicationDetail,
    dispatch,
    setFieldValue,
    showTransfer: true,
  }
  return (
    <React.Fragment>
      <div className={classes.actionDiv}>
        <Button
          color='danger'
          onClick={() => {
            history.push('/inventory/master?t=1')
          }}
        >
          Cancel
        </Button>
        <ProgressButton
          submitKey='medicationDetail/submit'
          onClick={handleSubmit}
        />
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
            tabButton: 'Setting',
            tabContent: <Setting {...detailProps} />,
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
  connect(({ medication, medicationDetail }) => ({
    medication,
    medicationDetail,
  })),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ medicationDetail }) => {
      return medicationDetail.entity ? medicationDetail.entity : {}
    },
    handleSubmit: (values, { props }) => {
      console.log(values)
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
    validationSchema: Yup.object().shape(
      {
        // code: Yup.string().required(),
        // displayValue: Yup.string().required(),
        // // revenueCategory: Yup.string().required(),
        // effectiveStartDate: Yup.string().required(),
        // effectiveEndDate: Yup.string().required(),
        // SellingPrice: Yup.number().required(),
      },
    ),
    displayName: 'InventoryMedicationDetail',
  }),
)(Detail)
