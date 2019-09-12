import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'
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
  rdoInput: {
    marginBottom: 30,
  },
})

const Detail = (props) => {
  useEffect(() => {
    if (props.schemeDetail.currentId) {
      props
        .dispatch({
          type: 'schemeDetail/query',
          payload: {
            id: props.schemeDetail.currentId,
          },
        })
        .then((o) => {
          return {
            ...o,
            effectiveDates: [
              o.effectiveStartDate,
              o.effectiveEndDate,
            ],
            itemGroupMaxCapacityDtoRdoValue: o.itemGroupMaxCapacityDto
              ? 'sub'
              : 'all',
            itemGroupValueDtoRdoValue: o.itemGroupValueDto ? 'sub' : 'all',
          }
        })
        .then((o) => props.resetForm(o))
    }
  }, [])

  const {
    classes,
    dispatch,
    schemeDetail,
    history,
    height,
    handleSubmit,
    ...restProps
  } = props
  const detailProps = {
    height: 'calc(100vh - 183px)',
    ...props,
  }
  const { currentTab } = schemeDetail
  // console.log(restProps)
  console.log('details/index', props)
  return (
    <div>
      <NavPills
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
      // console.log(1, 2, schemeDetail)
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

      //effectiveStartDate: Yup.string().required(),
      //effectiveEndDate: Yup.string().required(),
    }),
    handleSubmit: (values, { props, resetForm }) => {
      const { effectiveDates, ...restValues } = values
      console.log('restValues', restValues)
      const { dispatch, history, onConfirm, schemeDetail } = props
      dispatch({
        type: 'schemeDetail/upsert',
        payload: {
          ...restValues,
          effectiveStartDate: effectiveDates[0],
          effectiveEndDate: effectiveDates[1],
        },
      }).then((r) => {
        // if (r) {
        //   if (onConfirm) onConfirm()
        //   dispatch({
        //     type: 'schemeDetail/query',
        //     payload: {
        //       id: r.id,
        //     },
        //   })
        // }
        // if (r) {
        //   if (r.id) {
        //     history.push(
        //       getRemovedUrl(
        //         [
        //           'new',
        //         ],
        //         getAppendUrl({
        //           id: r.id,
        //         }),
        //       ),
        //     )
        //   }
        //   dispatch({
        //     type: 'schemeDetail/query',
        //     payload: {
        //       id: r.id || restValues.id,
        //       effectiveDates: [
        //         r.effectiveStartDate,
        //         r.effectiveEndDate,
        //       ],
        //     },
        //   }).then((value) => {
        //     resetForm(value)
        //   })
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
