import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import { CardContainer, CommonModal, notification } from '@/components'
import { DOCUMENT_CATEGORY, FORM_CATEGORY, FORM_FROM } from '@/utils/constants'
import { commonDataReaderTransform } from '@/utils/utils'
import { formTypes } from '@/utils/codes'
import { download } from '@/utils/request'
// import model from './models'
import AddForm from './FormDetail/AddForm'
import FilterBar from './FilterBar'
import FormModuleGrid from './FormModuleGrid'
import VisitFormGrid from './VisitFormGrid'

// window.g_app.replaceModel(model)

export const printRow = async (row, formCategory = '2') => {
  const type = formTypes.find(
    o => o.value === row.type || o.name === row.type || o.code === row.type,
  )
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return
  }
  download(
    `/api/Reports/${downloadConfig.id}?ReportFormat=pdf&ReportParameters={${
      downloadConfig.key
    }:${row.id},FormCategory:"${
      formCategory === FORM_CATEGORY.VISITFORM ? 'VisitForm' : 'CORForm'
    }"}`,
    {
      type: 'pdf',
    },
  )
}

export const viewReport = (row, props) => {
  const type = formTypes.find(
    o => o.value === row.type || o.name === row.type || o.code === row.type,
  )
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return false
  }

  const { codetable } = props
  const { clinicianprofile = [] } = codetable
  const obj =
    clinicianprofile.find(
      o =>
        o.userProfileFK ===
        (row.issuedByUserFK ? row.issuedByUserFK : row.referredByUserFK),
    ) || {}

  const reportParameters = { ...row }
  reportParameters.doctorName = (obj.title ? `${obj.title} ` : '') + obj.name
  reportParameters.doctorMCRNo = obj.doctorProfile
    ? obj.doctorProfile.doctorMCRNo
    : ''

  reportParameters.patientName = row.formData.patientName
  reportParameters.patientAccountNo = row.formData.patientAccountNo
  window.g_app._store.dispatch({
    type: 'report/updateState',
    payload: {
      reportTypeID: downloadConfig.id,
      reportParameters: {
        isSaved: false,
        reportContent: JSON.stringify(
          commonDataReaderTransform(downloadConfig.draft(reportParameters)),
        ),
      },
    },
  })

  return true
}

const styles = () => ({})

@connect(({ formListing, codetable, user, global }) => ({
  formListing,
  codetable,
  user,
  mainDivHeight: global.mainDivHeight,
}))
class FormListingDetails extends PureComponent {
  componentWillMount() {
    const { dispatch, formCategory } = this.props
    dispatch({
      type: 'formListing/initState',
      payload: { formCategory },
    })
  }

  componentDidMount() {
    this.queryFormListing()
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'formListing/updateState',
      payload: {
        list: [],
      },
    })
  }

  queryFormListing = () => {
    const { formListing, formFrom, formCategory } = this.props

    if (formFrom === FORM_FROM.FORMMODULE) {
      this.props.dispatch({
        type: 'formListing/query',
        payload: {
          apiCriteria: {
            visitDateFrom: moment()
              .add(-1, 'month')
              .formatUTC(),
            visitDateTo: moment()
              .endOf('day')
              .formatUTC(false),
          },
        },
      })
    } else if (formFrom === FORM_FROM.QUEUELOG) {
      if (formCategory === FORM_CATEGORY.VISITFORM) {
        this.props.dispatch({
          type: 'formListing/getVisitForms',
          payload: {
            id: formListing.visitID,
          },
        })
      } else {
        this.props.dispatch({
          type: 'formListing/getCORForms',
          payload: {
            id: formListing.visitID,
          },
        })
      }
    }
  }

  toggleModal = () => {
    const { formListing } = this.props
    const { showModal } = formListing
    this.props.dispatch({
      type: 'formListing/updateState',
      payload: {
        showModal: !showModal,
      },
    })
  }

  render() {
    const { formFrom, formListing, user, mainDivHeight = 700 } = this.props
    const { showModal, formTemplates } = formListing

    let height =
      mainDivHeight - 120 - ($('.filterFormListingBar').height() || 0)
    if (height < 300) height = 300
    return (
      <div>
        {formFrom === FORM_FROM.FORMMODULE && (
          <CardContainer hideHeader>
            <React.Fragment>
              <div className='filterFormListingBar'>
                <FilterBar {...this.props} />
              </div>
              <FormModuleGrid
                {...this.props}
                printRow={printRow}
                editRow={this.editRow}
                queryFormListing={this.queryFormListing}
                height={height}
              />
            </React.Fragment>
          </CardContainer>
        )}
        {formFrom === FORM_FROM.QUEUELOG && (
          <VisitFormGrid
            {...this.props}
            printRow={printRow}
            viewReport={viewReport}
            editRow={this.editRow}
            queryFormListing={this.queryFormListing}
          />
        )}
        <CommonModal
          open={showModal}
          title='Add Form'
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
          observe='Form'
          maxWidth='lg'
          bodyNoPadding
        >
          <AddForm {...this.props} types={formTypes} />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles)(FormListingDetails)
