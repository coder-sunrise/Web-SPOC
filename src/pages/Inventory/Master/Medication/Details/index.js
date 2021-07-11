import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import {
  Radio,
  Card,
  Anchor,
  Select,
  Menu,
  PageHeader,
  Button as AntBtn,
} from 'antd'
import { UserOutlined, DownOutlined, LinkOutlined } from '@ant-design/icons'
import {
  errMsgForOutOfRange as errMsg,
  navigateDirtyCheck,
  roundTo,
} from '@/utils/utils'
import {
  ProgressButton,
  Button,
  withFormikExtend,
  Tabs,
  Switch,
  CardContainer,
} from '@/components'
import Yup from '@/utils/yup'
import { headerHeight } from 'mui-pro-jss'
import { getBizSession } from '@/services/queue'
import { AuthorizationWrapper } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'
const { Secured } = Authorized
import DetailPanel from './Detail'
import Pricing from '../../Pricing'
import Stock from '../../Stock'
import Setting from './Setting'

const styles = () => ({
  actionDiv: {
    textAlign: 'center',
    marginTop: '22px',
    position: 'sticky',
    bottom: 0,
    width: '100%',
    paddingBottom: 10,
  },
})

const currentScrollStyle = {
  color: '#40a9ff',
  backgroundColor: '#fff',
  borderColor: '#40a9ff',
}

const sections = ['General', 'Setting', 'Pricing', 'Stock']

const CardTitle = ({ children }) => (
  <div style={{ fontWeight: 500, fontSize: '1.2rem' }}> {children}</div>
)

function validateIndication(item) {
  const context = this.parent
  return (
    (!context.isMultiLanguage && indication) ||
    (context.isMultiLanguage &&
      context.indication &&
      context.indicationSecondary)
  )
}

const Detail = ({
  classes,
  dispatch,
  medication,
  medicationDetail,
  history,
  handleSubmit,
  setFieldValue,
  values,
  theme,
  ...props
}) => {
  const detailProps = {
    medicationDetail,
    dispatch,
    setFieldValue,
    showTransfer: true,
    values,
    hasActiveSession,
    ...props,
  }

  useEffect(() => window.addEventListener('resize', resizeHandler))
  const [windowHeight, setWindowHeith] = useState(window.innerHeight)
  const [currentScrollPosition, setCurrentScrollPosition] = useState('general')

  const { clinicSettings } = props
  const { primaryPrintoutLanguage, secondaryPrintoutLanguage } = clinicSettings
  const [currentLanguage, setCurrentLanguage] = useState(
    primaryPrintoutLanguage ?? 'EN',
  )

  const isMultiLanguage =
    primaryPrintoutLanguage && secondaryPrintoutLanguage ? true : false
  detailProps.isMultiLanguage = isMultiLanguage
  const resizeHandler = () => {
    setWindowHeith(window.innerHeight)
  }

  const { currentTab } = medication

  const [hasActiveSession, setHasActiveSession] = useState(true)

  const stockProps = {
    medicationDetail,
    values,
    setFieldValue,
    dispatch,
    errors: props.errors,
    hasActiveSession,
    authority: 'inventorymaster.medication',
  }

  const checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data

    setHasActiveSession(data.length > 0)
  }

  useEffect(() => {
    if (medicationDetail.currentId) {
      checkHasActiveSession()
      let tempCode
      let tempName
      dispatch({
        type: 'medicationDetail/query',
        payload: {
          id: medicationDetail.currentId,
        },
      }).then(async med => {
        const { sddfk } = med
        if (sddfk) {
          await dispatch({
            type: 'sddDetail/queryOne',
            payload: {
              id: sddfk,
            },
          }).then(sdd => {
            const { data } = sdd
            const { code, name } = data[0]
            tempCode = code
            tempName = name
          })
        }
        dispatch({
          type: 'medicationDetail/updateState',
          payload: {
            sddCode: tempCode,
            sddDescription: tempName,
          },
        })
      })
    }
  }, [])

  const onAnchorClick = id => {
    const parentElement = document.getElementById('card-holder')
    const element = document.getElementById(id)
    try {
      if (parentElement && element) {
        const screenPosition = element.getBoundingClientRect()
        const { scrollTop } = parentElement
        const { top, left } = screenPosition

        parentElement.scrollTo({
          // scrolled top position + element top position - Nav header height
          top: scrollTop + top - 120,
          left,
          behavior: 'smooth',
        })
        setCurrentScrollPosition(id)
      }
    } catch (error) {
      console.error({ error })
    }
  }

  return (
    <React.Fragment>
      <div>
        <PageHeader
          style={{ backgroundColor: 'white' }}
          title={
            <>
              <span>Eye-001</span>
              <span
                style={{ fontSize: '0.9rem', fontWeight: 400, marginLeft: 5 }}
              >
                Allergan Refresh Plus Lubricant Eye Drops
              </span>
            </>
          }
          ghost={false}
          extra={[
            ...sections.map(s => {
              const currentStyle =
                currentScrollPosition === s.toLocaleLowerCase()
                  ? currentScrollStyle
                  : {}
              return (
                <AntBtn
                  id={`btn-${s.toLowerCase()}`}
                  style={{ marginLeft: 3, ...currentStyle }}
                  size='sm'
                  type='link'
                  color='primary'
                  onClick={() => onAnchorClick(s.toLowerCase())}
                >
                  {s} <LinkOutlined />
                </AntBtn>
              )
            }),

            isMultiLanguage && (
              <Select
                defaultValue={currentLanguage}
                onChange={value => {
                  setCurrentLanguage(value)
                }}
                options={[
                  { label: 'JP', value: 'JP' },
                  { label: 'EN', value: 'EN' },
                ]}
              />
            ),
          ]}
        ></PageHeader>
        <div
          id='card-holder'
          style={{
            marginTop: 10,
            height: windowHeight - 200,
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'sticky',
          }}
        >
          <Card
            onMouseEnter={e => {
              setCurrentScrollPosition(e.currentTarget.id)
            }}
            title={<CardTitle>General</CardTitle>}
            id='general'
          >
            <DetailPanel {...detailProps} language={currentLanguage} />
          </Card>
          <Card
            onMouseEnter={e => {
              setCurrentScrollPosition(e.currentTarget.id)
            }}
            title={<CardTitle>Setting</CardTitle>}
            id='setting'
            style={{ marginTop: 16 }}
          >
            <Setting {...detailProps} language={currentLanguage} />
          </Card>
          <Card
            onMouseEnter={e => {
              setCurrentScrollPosition(e.currentTarget.id)
            }}
            title={<CardTitle>Pricing</CardTitle>}
            id='pricing'
            style={{ marginTop: 16 }}
          >
            <Pricing {...detailProps} />
          </Card>
          <Card
            onMouseEnter={e => {
              setCurrentScrollPosition(e.currentTarget.id)
            }}
            title={<CardTitle>Stock</CardTitle>}
            id='stock'
            style={{ marginTop: 16 }}
          >
            <Stock {...detailProps} />
          </Card>
          <div
            onMouseEnter={e => {
              setCurrentScrollPosition('stock')
            }}
            id='scroll-placeholder'
            style={{ height: 500 }}
          ></div>
        </div>
      </div>
      <div className={classes.actionDiv}>
        <Button
          authority='none'
          color='danger'
          onClick={navigateDirtyCheck({
            redirectUrl: '/inventory/master?t=0',
          })}
        >
          Close
        </Button>
        <ProgressButton
          submitKey='medicationDetail/submit'
          onClick={handleSubmit}
        />
      </div>
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ medication, medicationDetail, clinicSettings }) => ({
    medication,
    medicationDetail,
    clinicSettings: clinicSettings.settings,
  })),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ medicationDetail, clinicSettings }) => {
      const returnValue = medicationDetail.entity
        ? medicationDetail.entity
        : medicationDetail.default
      const {
        primaryPrintoutLanguage,
        secondaryPrintoutLanguage,
      } = clinicSettings
      const isMultiLanguage =
        primaryPrintoutLanguage && secondaryPrintoutLanguage ? true : false
      let chas = []
      const {
        isChasAcuteClaimable,
        isChasChronicClaimable,
        isMedisaveClaimable,
      } = returnValue
      if (isChasAcuteClaimable) {
        chas.push('isChasAcuteClaimable')
      }
      if (isChasChronicClaimable) {
        chas.push('isChasChronicClaimable')
      }
      if (isMedisaveClaimable) {
        chas.push('isMedisaveClaimable')
      }

      return {
        ...returnValue,
        isMultiLanguage,
        chas,
        sddCode: medicationDetail.sddCode,
        sddDescription: medicationDetail.sddDescription,
      }
    },
    validationSchema: Yup.object().shape({
      code: Yup.string().when('id', {
        is: id => !!id,
        then: Yup.string()
          .trim()
          .required(),
      }),
      displayValue: Yup.string().required(),
      revenueCategoryFK: Yup.number().required(),
      indication: Yup.string().test(
        'oneOfRequired',
        'Please enter indication in both languages',
        validateIndication,
      ),
      indicationSecondary: Yup.string().test(
        'oneOfRequired',
        'Please enter indication in both languages',
        validateIndication,
      ),
      isMultiLanguage: Yup.boolean(),
      effectiveDates: Yup.array()
        .of(Yup.date())
        .min(2)
        .required(),
      prescribingUOMFK: Yup.number().required(),
      prescriptionToDispenseConversion: Yup.number().required(),
      dispensingUOMFK: Yup.number().required(),
      averageCostPrice: Yup.number()
        .min(0, 'Average Cost Price must between 0 and 999,999.9999')
        .max(999999.9999, 'Average Cost Price must between 0 and 999,999.9999'),

      markupMargin: Yup.number()
        .min(0, 'Markup Margin must between 0 and 999,999.9')
        .max(999999.9, 'Markup Margin must between 0 and 999,999.9'),

      sellingPrice: Yup.number()
        .required()
        .min(0, errMsg('Selling Price'))
        .max(999999.99, errMsg('Selling Price')),

      maxDiscount: Yup.number()
        .min(0, 'Max Discount must between 0 and 999,999.9')
        .max(999999.9, 'Max Discount must between 0 and 999,999.9'),

      reOrderThreshold: Yup.number()
        .min(0, 'Re-Order Threshold must between 0 and 999,999.9')
        .max(999999.9, 'Re-Order Threshold must between 0 and 999,999.9'),

      criticalThreshold: Yup.number()
        .min(0, 'Critical Threshold must between 0 and 999,999.9')
        .max(999999.9, 'Critical Threshold must between 0 and 999,999.9'),
    }),

    handleSubmit: (values, { props, resetForm }) => {
      const { id, medicationStock, effectiveDates, ...restValues } = values
      const { dispatch, history, onConfirm, medicationDetail } = props

      let defaultMedicationStock = medicationStock
      if (medicationStock.length === 0) {
        defaultMedicationStock = [
          {
            inventoryMedicationFK: id,
            batchNo: 'Not Applicable',
            stock: 0,
            isDefault: true,
          },
        ]
      }

      let chas = {
        isChasAcuteClaimable: false,
        isChasChronicClaimable: false,
        isMedisaveClaimable: false,
      }
      values.chas.forEach(o => {
        if (o === 'isChasAcuteClaimable') {
          chas[o] = true
        } else if (o === 'isChasChronicClaimable') {
          chas[o] = true
        } else if (o === 'isMedisaveClaimable') {
          chas[o] = true
        }
      })

      const payload = {
        ...restValues,
        ...chas,
        id,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        medicationStock: defaultMedicationStock,
        suggestSellingPrice: roundTo(restValues.suggestSellingPrice),
      }

      dispatch({
        type: 'medicationDetail/upsert',
        payload,
      }).then(r => {
        if (r) {
          // if (onConfirm) onConfirm()
          // dispatch({
          //   type: 'medicationDetail/query',
          // })
          resetForm()
          history.push('/inventory/master')
        }
      })
    },

    displayName: 'InventoryMedicationDetail',
  }),
)(Secured('inventorymaster.medication')(Detail))
