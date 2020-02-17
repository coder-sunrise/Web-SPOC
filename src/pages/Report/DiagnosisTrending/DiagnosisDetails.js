import React, { PureComponent } from 'react'
import { ReportDataGrid, AccordionTitle } from '@/components/_medisys'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import { Accordion } from '@/components'
class DiagnosisDetails extends PureComponent {
  render() {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas || !reportDatas.ListingDetails[0].showDetails) return null
    if (reportDatas.DiagnosisDetails) {
      listData = reportDatas.DiagnosisDetails.map((item, index) => ({
        ...item,
        id: `DiagnosisDetails-${index}-${item.diagnosisCode}`,
        groupName: `${item.diagnosisName} (${item.diagnosisCode})`,
        genderAge: `${item.gender}/${item.age}`,
      }))
    }
    const FuncProps = {
      pager: false,
      grouping: true,
      groupingConfig: {
        state: {
          grouping: [
            { columnName: 'groupName' },
          ],
        },
      },
    }

    const DiagnosisDetailsColumns = [
      { name: 'groupName', title: 'Diagnosis' },
      { name: 'visitDate', title: 'Visit Date' },
      { name: 'doctorName', title: 'Visit Doctor' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'genderAge', title: 'Gender/Age' },
    ]
    const DiagnosisDetailsExtensions = [
      { columnName: 'groupName', sortingEnabled: false },
      { columnName: 'visitDate', sortingEnabled: false },
      { columnName: 'doctorName', sortingEnabled: false },
      { columnName: 'patientName', sortingEnabled: false },
      { columnName: 'genderAge', sortingEnabled: false },
    ]

    return (
      <Accordion
        leftIcon
        expandIcon={<SolidExpandMore fontSize='large' />}
        collapses={[
          {
            title: <AccordionTitle title='Diagnosis Details' />,
            content: <ReportDataGrid
              data={listData}
              columns={DiagnosisDetailsColumns}
              columnExtensions={DiagnosisDetailsExtensions}
              FuncProps={FuncProps}
            />,
          },
        ]}
      />
    )
  }
}
export default DiagnosisDetails
