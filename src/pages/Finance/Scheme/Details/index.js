import React, { useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { ProgressButton, Button, withFormikExtend, Tabs } from '@/components'
import { navigateDirtyCheck } from '@/utils/utils'
import Yup from '@/utils/yup'
import { InventoryTypes } from '@/utils/codes'
import { SchemeDetailOption } from './variables'

const styles = (theme) => ({
  actionDiv: {
    margin: theme.spacing(1),
    textAlign: 'center',
    // float: 'right',
    // textAlign: 'center',
    // marginTop: '22px',
    // marginRight: '10px',
  },
  rdoInput: {
    marginBottom: 30,
    marginLeft: 30,
  },
})

const Detail = (props) => {
  useEffect(() => {
    if (props.schemeDetail.currentId) {
      props.dispatch({
        type: 'schemeDetail/querySchemeDetails',
        payload: {
          id: props.schemeDetail.currentId,
        },
      })
    }
  }, [])

  const { classes, schemeDetail, history, handleSubmit } = props
  const detailProps = {
    height: 'calc(100vh - 183px)',
    ...props,
  }
  const { currentTab } = schemeDetail
  return (
    <div>
      {/* <NavPills
        color='primary'
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
      /> */}
      {/* <Divider /> */}

      <Tabs
        style={{ marginTop: 20 }}
        defaultActiveKey='0'
        options={SchemeDetailOption(detailProps)}
      />
      <div className={classes.actionDiv}>
        <Button color='danger' onClick={navigateDirtyCheck('/finance/scheme')}>
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
      schemeCategoryFK: Yup.number().required(),
      companyCoPaymentSchemeDto: Yup.array().of(
        Yup.object().shape({
          companyFk: Yup.number().required(),
        }),
      ),
    }),
    enableReinitialize: true,
    handleSubmit: (values, { props }) => {
      InventoryTypes.forEach((p) => {
        values[p.prop] = values.rows.filter((o) => o.type === p.value)
      })

      const { effectiveDates, ...restValues } = values
      const { dispatch, history, onConfirm } = props

      dispatch({
        type: 'schemeDetail/upsert',
        payload: {
          ...restValues,
          effectiveStartDate: effectiveDates[0],
          effectiveEndDate: effectiveDates[1],
        },
      }).then((r) => {
        if (r) {
          if (onConfirm) onConfirm()
          dispatch({
            type: 'schemeDetail/query',
          })
          history.push('/finance/scheme')
        }
      })
    },
    displayName: 'FinanceSchemeDetail',
  }),
)(Detail)
