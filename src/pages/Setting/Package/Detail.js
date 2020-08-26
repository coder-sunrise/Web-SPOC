import React, { PureComponent, Fragment } from 'react'
import Yup from '@/utils/yup'
import { withFormikExtend, notification } from '@/components'
import DetailPanel from './Details/Detail'
import PackageItemListing from './Details/PackageItemListing'

@withFormikExtend({
  mapPropsToValues: ({ settingPackage }) =>
    settingPackage.entity || settingPackage.default,

  validationSchema: Yup.object().shape({
    code: Yup.string().trim().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm } = props

    const serviceItems = values.servicePackageItem.filter(
      (item) => item.isDeleted === false && item.isActive === false,
    )
    const consumableItems = values.consumablePackageItem.filter(
      (item) => item.isDeleted === false && item.isActive === false,
    )
    const medicationItems = values.medicationPackageItem.filter(
      (item) => item.isDeleted === false && item.isActive === false,
    )
    const vaccinationItems = values.vaccinationPackageItem.filter(
      (item) => item.isDeleted === false && item.isActive === false,
    )

    if (
      serviceItems.length > 0 ||
      consumableItems.length > 0 ||
      medicationItems.length > 0 ||
      vaccinationItems.length > 0
    ) {
      notification.warn({
        message: 'One or more items in the package are inactive.',
      })
      return
    }

    dispatch({
      type: 'settingPackage/upsert',
      payload: {
        ...values,
        effectiveStartDate: values.effectiveDates[0],
        effectiveEndDate: values.effectiveDates[1],
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingPackage/query',
        })
      }
    })
  },
  displayName: 'PackageDetail',
})
class Detail extends PureComponent {
  componentWillUnmount () {
    this.props.dispatch({
      type: 'settingPackage/reset',
    })
  }

  render () {
    const { theme, footer, values, handleSubmit } = this.props

    return (
      <Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <DetailPanel {...this.props} />
          <PackageItemListing {...this.props} />
        </div>
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </Fragment>
    )
  }
}

export default Detail
