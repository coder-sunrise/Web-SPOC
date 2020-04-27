import React, { PureComponent } from 'react'
import {
  GridContainer,
  GridItem,
  TextField,
  FastField,
  DatePicker,
  RadioButtonGroup,
  CodeSelect,
} from '@/components'

class Diagnosis extends PureComponent {
  render () {
    return (
      <div>
        <span>Principal Diagnosis</span>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='principalDiagnosisFK'
              render={(args) => (
                <CodeSelect
                  label='ICD10-AM Code'
                  labelField='name'
                  {...args}
                  code='CTCaseDescription'
                />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='principalDiagnosisFK'
              render={(args) => (
                <CodeSelect
                  label='Description'
                  labelField='code'
                  {...args}
                  code='CTCaseDescription'
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <span>Second Diagnosis</span>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='secondDiagnosisAFK'
              render={(args) => (
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 4,
                    }}
                  >
                    1)
                  </span>
                  <CodeSelect
                    style={{
                      marginLeft: 20,
                      paddingRight: 20,
                    }}
                    label='ICD10-AM Code'
                    labelField='code'
                    {...args}
                    code='CTCaseDescription'
                  />
                </div>
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='secondDiagnosisAFK'
              render={(args) => (
                <CodeSelect
                  label='Description'
                  labelField='name'
                  {...args}
                  code='CTCaseDescription'
                />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='secondDiagnosisBFK'
              render={(args) => (
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 4,
                    }}
                  >
                    2)
                  </span>
                  <CodeSelect
                    style={{
                      marginLeft: 20,
                      paddingRight: 20,
                    }}
                    label='ICD10-AM Code'
                    labelField='code'
                    {...args}
                    code='CTCaseDescription'
                  />
                </div>
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='secondDiagnosisBFK'
              render={(args) => (
                <CodeSelect
                  label='Description'
                  labelField='name'
                  {...args}
                  code='CTCaseDescription'
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer />
        <span>Other Diagnosis</span>
        <GridContainer />
      </div>
    )
  }
}
export default Diagnosis
