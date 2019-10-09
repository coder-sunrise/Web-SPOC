import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { compose } from 'redux'
import { getAppendUrl, navigateDirtyCheck } from '@/utils/utils'
import {
  NavPills,
  ProgressButton,
  Button,
  withFormikExtend,
  Tabs,
} from '@/components'
import AuthorizedContext from '@/components/Context/Authorized'

import Yup from '@/utils/yup'
import DetailPanel from './Detail'
import Setting from './Setting'
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
  const [
    editable,
    setEditable,
  ] = useState(true)

  const [
    data,
    setData,
  ] = useState()

  useEffect(
    () => {
      const { entity } = props.schemeDetail
      if (entity) {
        setEditable(entity.isUserMaintainable)
      } else setEditable(props.schemeDetail.default.isUserMaintainable)
    },
    [
      data,
    ],
  )

  const getSchemeDetails = async (prop) => {
    if (prop.schemeDetail.currentId) {
      await prop.dispatch({
        type: 'schemeDetail/querySchemeDetails',
        payload: {
          id: prop.schemeDetail.currentId,
        },
      })
      setData(props.schemeDetail)
    }
  }

  useEffect(() => {
    getSchemeDetails(props)
  }, [])

  const { classes, schemeDetail, history, handleSubmit, theme } = props
  const detailProps = {
    height: `calc(100vh - ${183 + theme.spacing(1)}px)`,
    ...props,
  }

  return (
    <AuthorizedContext.Provider
      value={{
        rights: editable ? 'enable' : 'disable',
      }}
    >
      <Tabs
        style={{ marginTop: theme.spacing(1) }}
        defaultActiveKey='0'
        options={SchemeDetailOption(detailProps)}
      />

      <div className={classes.actionDiv}>
        <Button
          authority='none'
          color='danger'
          onClick={navigateDirtyCheck('/finance/scheme')}
        >
          Cancel
        </Button>
        <ProgressButton
          submitKey='schemeDetail/submit'
          onClick={handleSubmit}
        />
      </div>
    </AuthorizedContext.Provider>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ schemeDetail }) => ({
    schemeDetail,
  })),
  withFormikExtend({
    authority: 'finance/scheme',
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
