import React, { Component } from 'react'
// common components
import { Accordion } from '@/components'
// sub component
import PatientBanner from '../components/PatientBanner'

class Billing extends Component {
  render () {
    return (
      <div>
        <PatientBanner />
        <Accordion
          collapses={[
            {
              title: 'Dispensing Details',
              content: (
                <div>
                  <h4>Dispensing details</h4>
                </div>
              ),
            },
          ]}
        />
      </div>
    )
  }
}

export default Billing
