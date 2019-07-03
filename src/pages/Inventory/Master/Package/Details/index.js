import React from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { getAppendUrl } from '@/utils/utils'
import { withFormik } from 'formik'
import DetailPanel from './Detail'
// import Pricing from '../../DetaPricing'
// import Stock from '../../Details/Stock'
import Grid from '../../Grid'
import { NavPills, ProgressButton, Button } from '@/components'
import Yup from '@/utils/yup'

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
  pack,
  packDetail,
  history,
  handleSubmit,
  setFieldValue,
}) => {
  const { currentTab } = pack
  const detailProps = {
    packDetail,
    dispatch,
    setFieldValue,
    showTransfer: false,
  }

  // const pMedi = {
  //   ...restProps,
  //   modelType: 'Medication',
  //   type: 'Medication',
  // }

  // const pVacc = {
  //   ...restProps,
  //   modelType: 'Vaccination',
  //   type: 'Vaccination',
  // }

  // const pCons = {
  //   ...restProps,
  //   modelType: 'Consumable',
  //   type: 'Consumable',
  // }

  // const pServ = {
  //   ...restProps,
  //   modelType: 'Service',
  //   type: 'Service',
  // }

  return (
    <React.Fragment>
      <div className={classes.actionDiv}>
        <Button
          color='danger'
          onClick={() => {
            history.push('/inventory/master?t=3')
          }}
        >
          Cancel
        </Button>
        <ProgressButton submitKey='packDetail/submit' onClick={handleSubmit} />
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
          // {
          //   tabButton: 'Medication',
          //   tabContent: <Grid {...pMedi} />,
          // },
          // {
          //   tabButton: 'Vaccination',
          //   tabContent: <Grid {...pVacc} />,
          // },
          // {
          //   tabButton: 'Consumable',
          //   tabContent: <Grid {...pCons} />,
          // },
          // {
          //   tabButton: 'Service',
          //   tabContent: <Grid {...pServ} />,
          // },
        ]}
      />
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ pack, packDetail }) => ({
    pack,
    packDetail,
  })),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({ packDetail }) => {
      return packDetail.entity ? packDetail.entity : {}
    },
    handleSubmit: (values, { props }) => {
      console.log(props)
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
    validationSchema: Yup.object().shape({
      code: Yup.string().required(),
      displayValue: Yup.string().required(),
      effectiveStartDate: Yup.string().required(),
      effectiveEndDate: Yup.string().required(),
    }),
    displayName: 'InventoryPackageDetail',
  }),
)(Detail)
