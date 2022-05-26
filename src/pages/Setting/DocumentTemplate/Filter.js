import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { status, documentCategorys } from '@/utils/codes'
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
} from '@/components'
import { DOCUMENTCATEGORY_DOCUMENTTYPE } from '@/utils/constants'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

@withFormikExtend({
  mapPropsToValues: ({ settingDocumentTemplate }) =>
    settingDocumentTemplate.filter || {},
  handleSubmit: () => {},
  displayName: 'DocumentTemplateFilter',
})
class Filter extends PureComponent {
  state = {
    anchorEl: null,
    confirmDocumentCateogry: false,
  }

  handleMenuClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
      confirmDocumentCateogry: true,
    })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null, confirmDocumentCateogry: false })
  }

  handleMenuItemClick = documentCategoryFK => {
    this.props.dispatch({
      type: 'settingDocumentTemplate/updateState',
      payload: {
        entity: undefined,
        documentCategoryFK,
      },
    })
    this.handleMenuClose()
    this.props.toggleModal()
  }

  render() {
    const { classes, values, setFieldValue } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='codeDisplayValue'
              render={args => {
                return <TextField label='Code / Display Value' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='documentCategoryFK'
              render={args => {
                return (
                  <CodeSelect
                    code='LTDocumentCategory'
                    label='Document Category'
                    onChange={() =>
                      setFieldValue('documentTemplateTypeFK', undefined)
                    }
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              shouldUpdate={() => true}
              name='documentTemplateTypeFK'
              render={args => {
                const filterTemplateTypes =
                  DOCUMENTCATEGORY_DOCUMENTTYPE.find(
                    y => y.documentCategoryFK === values.documentCategoryFK,
                  )?.templateTypes || []
                return (
                  <CodeSelect
                    localFilter={x => filterTemplateTypes.some(y => x.id == y)}
                    code='LTDocumentTemplateType'
                    label='Document Type'
                    orderBy={[['name'],['asc']]}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='isActive'
              render={args => {
                return <Select label='Status' options={status} {...args} />
              }}
            />
          </GridItem>
        </GridContainer>

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
                    documentTemplateTypeFK,
                    documentCategoryFK,
                  } = this.props.values
                  this.props.dispatch({
                    type: 'settingDocumentTemplate/query',
                    payload: {
                      isActive,
                      documentTemplateTypeFK,
                      documentCategoryFK,
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

              <Button
                color='primary'
                onClick={() => {}}
                id='pp-positioned-button'
                aria-haspopup='true'
                aria-expanded={
                  this.state.confirmDocumentCateogry ? 'true' : undefined
                }
                onClick={this.handleMenuClick}
              >
                <Add />
                Add New
              </Button>
              <Menu
                id='pp-positioned-menu'
                aria-labelledby='pp-positioned-button'
                disableAutoFocusItem
                anchorEl={this.state.anchorEl}
                open={this.state.confirmDocumentCateogry}
                onClose={this.handleMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {documentCategorys.map(x => (
                  <MenuItem onClick={() => this.handleMenuItemClick(x.value)}>
                    {x.name}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
