import React from 'react'
// formik
import { withFormik } from 'formik'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common component
import {
  GridContainer,
  GridItem,
  FastField,
  Select,
  Field,
  Checkbox,
} from '@/components'
// sub components
import request from '@/utils/request'

const styles = (theme) => ({
  verticalSpacing: {
    // marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& > h4': {
      fontWeight: 500,
    },
  },
})
class UserRoleForm extends React.PureComponent {
  state = {
    showSelectField: false,
    selectFieldOption: [],
    selectedValue: undefined,
  }

  onSwitchClick = async (e) => {
    const response = await request('/api/Role', {
      method: 'GET',
    })
    const { data } = response
    if (data) {
      const option = data.data.map((d) => {
        return {
          name: d.name,
          value: d.id,
        }
      })
      this.setState({
        showSelectField: e.target.value,
        selectFieldOption: option,
      })
    }
  }

  onSelect = (value) => {
    this.setState({ selectedValue: value })
  }

  handleClickAddNew = () => {
    const { selectedValue } = this.state
    if (selectedValue) {
      this.props.history.push(`/setting/userrole/new`, { id: selectedValue })
    }
  }

  render () {
    const { classes, footer, handleSubmit, history } = this.props
    const { showSelectField, selectFieldOption, selectedValue } = this.state
    return (
      <React.Fragment>
        <div className={classes.verticalSpacing}>
          <GridContainer>
            <GridItem md={4} />
            <GridItem md={4} className={classes.verticalSpacing}>
              <Field
                name='createNewRole'
                render={(args) => (
                  <Checkbox
                    label='Creating new from existing?'
                    onChange={this.onSwitchClick}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>

          {showSelectField && (
            <GridContainer>
              <GridItem md={4} />
              <GridItem md={4} className={classes.verticalSpacing}>
                <FastField
                  name='status'
                  render={(args) => (
                    <Select
                      {...args}
                      options={selectFieldOption}
                      onChange={this.onSelect}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          )}
        </div>

        <GridItem md={4} />
        {footer &&
          footer({
            confirmBtnText: 'Add New',
            onConfirm: this.handleClickAddNew,
            confirmProps: {
              disabled: showSelectField && !selectedValue,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withFormik({
  mapPropsToValues: () => ({}),
  handleSubmit: () => {},
})(withStyles(styles, { name: 'UserRoleForm' })(UserRoleForm))
