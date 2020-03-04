import React from 'react'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import { withRouter } from 'react-router'
// common component
import { GridContainer, GridItem, FastField, Select } from '@/components'
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
    selectFieldOption: [],
    selectedValue: undefined,
  }

  componentDidMount = () => {
    this.getSelectOptions()
  }

  getSelectOptions = async () => {
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
    const { classes, footer } = this.props
    const { selectFieldOption, selectedValue } = this.state
    return (
      <div>
        {selectFieldOption.length !== 0 && (
          <React.Fragment>
            <div className={classes.verticalSpacing}>
              <GridContainer>
                <GridItem md={4} />
                <GridItem md={4} className={classes.verticalSpacing}>
                  <FastField
                    name='status'
                    render={(args) => (
                      <Select
                        {...args}
                        label='Existing Role'
                        options={selectFieldOption}
                        onChange={this.onSelect}
                      />
                    )}
                  />
                </GridItem>
              </GridContainer>
            </div>

            <GridItem md={4} />
            {footer &&
              footer({
                confirmBtnText: 'Add New',
                onConfirm: this.handleClickAddNew,
                confirmProps: {
                  disabled: !selectedValue,
                },
              })}
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default withFormik({
  mapPropsToValues: () => ({}),
  handleSubmit: () => {},
})(withStyles(styles, { name: 'UserRoleForm' })(withRouter(UserRoleForm)))
