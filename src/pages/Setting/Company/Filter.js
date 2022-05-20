import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { status } from '@/utils/codes'
import Authorized from '@/utils/Authorized'
import { ableToViewByAuthority } from '@/utils/utils'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Select,
  ProgressButton,
  CodeSelect,
  Field,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingCompany }) => ({
    ...(settingCompany.filter || {}),
    isActive: true,
  }),
  handleSubmit: () => {},
  displayName: 'CompanyFilter',
})
class Filter extends PureComponent {
  state = {
    isCopayer: undefined,
    isSupplier: undefined,
  }

  checkIsCopayer(name) {
    this.setState({
      isCopayer: name === 'copayer',
    })
  }

  checkIsSupplier(name) {
    this.setState({
      isSupplier: name === 'supplier',
    })
  }

  render() {
    const { classes, history, route, settingCompany } = this.props
    const { name } = route
    const { companyType } = settingCompany
    this.checkIsCopayer(name)
    this.checkIsSupplier(name)
    const { isCopayer, isSupplier } = this.state
    const newCopayerAccessRight = Authorized.check('copayer.newcopayer') || {
      rights: 'hidden',
    }
    const newSupplierAccessRight = Authorized.check(
      'settings.supplier.newsupplier',
    ) || {
      rights: 'hidden',
    }
    const newManufacturerAccessRight = Authorized.check(
      'settings.manufacturer.newmanufacturer',
    ) || {
      rights: 'hidden',
    }
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <Field
              name='codeDisplayValue'
              render={args => {
                return (
                  <TextField
                    label={
                      isCopayer
                        ? 'Co-Payer Code/Name'
                        : isSupplier
                        ? 'Supplier Code/Name'
                        : 'Manufacturer Code/Name'
                    }
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={isCopayer ? 6 : 0} md={isCopayer ? 3 : 0}>
            {isCopayer ? (
              <FastField
                name='coPayerTypeFK'
                render={args => {
                  return (
                    <CodeSelect
                      label='Co-Payer Type'
                      code='ctCopayerType'
                      {...args}
                    />
                  )
                }}
              />
            ) : (
              []
            )}
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='isActive'
              render={args => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
          <GridContainer>
            <GridItem>
              <div className={classes.filterBtn}>
                <ProgressButton
                  color='primary'
                  icon={<Search />}
                  onClick={() => {
                    const {
                      codeDisplayValue,
                      isActive,
                      coPayerTypeFK,
                    } = this.props.values
                    this.props.dispatch({
                      type: 'settingCompany/query',
                      payload: {
                        companyTypeFK: companyType.id,
                        coPayerTypeFK,
                        isActive,
                        group: [
                          {
                            code: codeDisplayValue,
                            displayValue: codeDisplayValue,
                            combineCondition: 'or',
                          },
                        ],
                      },
                    })
                  }}
                >
                  <FormattedMessage id='form.search' />
                </ProgressButton>
                {isCopayer
                  ? newCopayerAccessRight.rights === 'enable' && (
                      <Button
                        color='primary'
                        onClick={() => {
                          this.props.dispatch({
                            type: 'copayerDetail/updateState',
                            payload: {
                              entity: undefined,
                            },
                          })
                          history.push('/finance/copayer/newcopayer')
                        }}
                      >
                        <Add />
                        Add New
                      </Button>
                    )
                  : isSupplier
                  ? newSupplierAccessRight.rights === 'enable' && (
                      <Button
                        color='primary'
                        onClick={() => {
                          this.props.dispatch({
                            type: 'settingCompany/updateState',
                            payload: {
                              entity: undefined,
                            },
                          })
                          this.props.toggleModal()
                        }}
                      >
                        <Add />
                        Add New
                      </Button>
                    )
                  : !(
                      newManufacturerAccessRight.rights == 'disable' ||
                      newManufacturerAccessRight.rights == 'hidden'
                    ) && (
                      <Button
                        color='primary'
                        onClick={() => {
                          this.props.dispatch({
                            type: 'settingCompany/updateState',
                            payload: {
                              entity: undefined,
                            },
                          })
                          this.props.toggleModal()
                        }}
                      >
                        <Add />
                        Add New
                      </Button>
                    )}
              </div>
            </GridItem>
          </GridContainer>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
