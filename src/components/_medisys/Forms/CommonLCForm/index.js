import React, { PureComponent } from 'react'
import $ from 'jquery'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import { CardContainer, Accordion } from '@/components'
import PatientParticulars from './PatientParticulars'
import Diagnosis from './Diagnosis'
import Procedures from './Procedures'
import Certification from './Certification'
import NonSurgical from './NonSurgical'

class CommonLCForm extends PureComponent {
  constructor (props) {
    super(props)

    this.myRef = React.createRef()
  }

  render () {
    const {
      values,
      height,
      diagnosisSchema,
      surgicalChargesSchema,
      nonSurgicalChargesSchema,
    } = this.props

    const { formData } = values
    if (formData && formData.nonSurgicalCharges.length > 0) {
      let div = $(this.myRef.current).find('div[aria-expanded]:eq(0)')
      if (div.attr('aria-expanded') === 'false') div.click()
    }
    return (
      <div
        style={{
          overflow: 'auto',
          height: height - 200,
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <div>
          <h5>A - PATIENT PARTICULARS</h5>
          <CardContainer hideHeader>
            <PatientParticulars {...this.props} />
          </CardContainer>
        </div>
        <div>
          <h5>B - DIAGNOSIS (In Order of Priority)</h5>
          <CardContainer hideHeader>
            <Diagnosis {...this.props} diagnosisSchema={diagnosisSchema} />
          </CardContainer>
        </div>
        <div>
          <h5>
            C - PROCEDURE - SPECIFIC CHARGES TO BE REIMBURSED TO THE SURGEON(S)
          </h5>
          <CardContainer hideHeader>
            <Procedures
              {...this.props}
              surgicalChargesSchema={surgicalChargesSchema}
            />
          </CardContainer>
        </div>
        <div>
          <h5>D – CERTIFICATION</h5>
          <CardContainer hideHeader>
            <Certification {...this.props} />
          </CardContainer>
        </div>
        <div ref={this.myRef}>
          <Accordion
            leftIcon
            expandIcon={<SolidExpandMore fontSize='large' />}
            mode='multiple'
            collapses={[
              {
                title:
                  "E - DOCTORS' NON-SURGICAL AND TREATMENT-RELATED CHARGES TO BE REIMBURSED",
                content: (
                  <NonSurgical
                    {...this.props}
                    nonSurgicalChargesSchema={nonSurgicalChargesSchema}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    )
  }
}
export default CommonLCForm
