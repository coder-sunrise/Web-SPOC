import moment from 'moment'
import { commonDataReaderTransform } from '@/utils/utils'
import { dateFormatLong } from '@/components'

export const getMedicalCheckupReportPayload = data => {
  const {
    patientInfo = [],
    basicExamination = [],
    visualAcuity = [],
    intraocularPressure = [],
    audiometry = [],
    individualComment = [],
    summaryComment = [],
    labTestPanel = [],
    reportContext = [],
    reportingDoctor = [],
  } = data
  const printData = {
    PatientInfo: patientInfo.map(p => ({
      ...p,
      patientAge: p.patientAge ? `${p.patientAge} yrs` : '',
      patientDOB: p.patientDOB
        ? moment(p.patientDOB).format(dateFormatLong)
        : '',
      visitDate: p.visitDate ? moment(p.visitDate).format(dateFormatLong) : '',
      currentDate: p.currentDate
        ? moment(p.currentDate).format(dateFormatLong)
        : '',
      lastDate: p.lastDate ? moment(p.lastDate).format(dateFormatLong) : '',
      beforeLastDate: p.beforeLastDate
        ? moment(p.beforeLastDate).format(dateFormatLong)
        : '',
    })),
    BasicExamination: basicExamination,
    VisualAcuity: visualAcuity,
    IntraocularPressure: intraocularPressure,
    Audiometry: audiometry,
    IndividualComment: individualComment,
    SummaryComment: summaryComment,
    LabTestPanel: labTestPanel,
    ReportingDoctor: reportingDoctor.map(x => ({
      ...x,
      japaneseName: x.japaneseName || '',
    })),
    ReportContext: reportContext.map(o => {
      const {
        customLetterHeadHeight = 0,
        isDisplayCustomLetterHead = false,
        standardHeaderInfoHeight = 0,
        isDisplayStandardHeader = false,
        footerInfoHeight = 0,
        isDisplayFooterInfo = false,
        footerDisclaimerHeight = 0,
        isDisplayFooterInfoDisclaimer = false,
        ...restProps
      } = o
      return {
        customLetterHeadHeight,
        isDisplayCustomLetterHead,
        standardHeaderInfoHeight,
        isDisplayStandardHeader,
        footerInfoHeight,
        isDisplayFooterInfo,
        footerDisclaimerHeight,
        isDisplayFooterInfoDisclaimer,
        ...restProps,
      }
    }),
  }
  console.log('11111', printData)
  const payload = [
    {
      ReportId: 93,
      Copies: 1,
      ReportData: JSON.stringify({
        ...commonDataReaderTransform(printData),
      }),
    },
  ]

  return payload
}

export const getVisitOrderTemplateContent = visitOrderTemplateDetails => {
  let indicate
  if (visitOrderTemplateDetails) {
    const temp = JSON.parse(visitOrderTemplateDetails)
    indicate = {
      indicateString: temp.visitPurpose,
      removedItemString: (temp.removedItems || []).join(' - '),
      newItemString: (temp.addedItems || []).join(' + '),
    }
  }
  if (!indicate) return

  const indicateStringContent = (
    <span>
      {indicate?.indicateString ? (
        <span>{indicate.indicateString}</span>
      ) : (
        <span></span>
      )}
      {indicate?.removedItemString ? (
        <span style={{ color: '#FF0000' }}>
          {` - ${indicate.removedItemString}`}
        </span>
      ) : (
        <span></span>
      )}
      {indicate?.newItemString ? (
        <span style={{ color: '#389e0d' }}>
          {` + ${indicate.newItemString}`}
        </span>
      ) : (
        <span></span>
      )}
    </span>
  )

  return indicateStringContent
}
