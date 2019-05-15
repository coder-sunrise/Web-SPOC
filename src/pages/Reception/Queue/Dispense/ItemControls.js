import React, { PureComponent } from 'react'
import classnames from 'classnames'
// formik
import { withFormik } from 'formik'
// material ui
import { Paper, withStyles } from '@material-ui/core'
// Custom Components
import { NavPills, GridContainer, GridItem, Button } from '@/components'
// sub components
import DrugItem from './DrugItem'
import ServiceItem from './ServiceItem'
import ConsumableItem from './ConsumablesItem'
import PackageItem from './PackageItem'
import OtherItem from './OtherItem'

const STYLES = () => ({
  paperSpacing: {
    margin: '10px 5px',
    paddingBottom: '5px',
  },
})

const drugFormInitialValue = {
  Drug: '',
  Stock: '',
  Instruction: '',
  ConsumptionMethod: '',
  Dosage: '',
  DosageUnit: '',
  Frequency: '',
  PeriodAmount: undefined,
  Period: '',
  PRN: false,
  PrecautionOne: '',
  PrecautionTwo: '',
  PrecautionThree: '',
  BatchNo: '',
  ExpireDate: '',
  Remark: '',
}
const packageFormInitialValue = {
  packageType: undefined,
}

@withFormik({
  mapPropsToValues: () => ({
    drugFormValues: { ...drugFormInitialValue },
    packageFormValues: { ...packageFormInitialValue },
  }),
})
class ItemControls extends PureComponent {
  state = {
    activeTab: 0,
  }

  onTabChange = (event, value) => {
    const { handleReset } = this.props
    this.setState({ activeTab: value }, () => handleReset())
  }

  render () {
    const { classes, values } = this.props
    const { activeTab } = this.state
    return (
      <Paper className={classnames(classes.paperSpacing)}>
        <NavPills
          color='rose'
          active={activeTab}
          onChange={this.onTabChange}
          horizontal={{
            tabsGrid: { xs: 12, sm: 12, md: 2 },
            contentGrid: { xs: 12, sm: 12, md: 10 },
          }}
          tabs={[
            {
              tabButton: 'Drug',
              tabContent: activeTab === 0 && <DrugItem />,
            },
            {
              tabButton: 'Service',
              tabContent: activeTab === 1 && <ServiceItem />,
            },
            {
              tabButton: 'Consumable',
              tabContent: activeTab === 2 && <ConsumableItem />,
            },
            {
              tabButton: 'Package Item',
              tabContent: activeTab === 3 && (
                <PackageItem formValues={values.packageFormValues} />
              ),
            },
            {
              tabButton: 'Other',
              tabContent: activeTab === 4 && <OtherItem />,
            },
          ]}
        />
      </Paper>
    )
  }
}

export default withStyles(STYLES)(ItemControls)
