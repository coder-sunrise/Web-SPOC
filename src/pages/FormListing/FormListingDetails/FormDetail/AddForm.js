import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
import _ from 'lodash'

import { SizeContainer } from '@/components'
import Form from './Form/index'

const styles = theme => ({
  editor: {
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    zIndex: 1,
    right: 3,
    top: 8,
  },
})

@connect(({ formListing, user, codetable, visitRegistration, patient }) => ({
  formListing,
  user,
  codetable,
  visitEntity: visitRegistration.entity || {},
  patient,
}))
class AddForm extends PureComponent {
  getNextSequence = () => {
    const {
      formListing: { list, type },
    } = this.props
    const allForms = list.filter(s => !s.isDeleted)
    let nextSequence = 1
    if (allForms && allForms.length > 0) {
      const { sequence } = _.maxBy(allForms, 'sequence')
      nextSequence = sequence + 1
    }
    return nextSequence
  }

  render() {
    const { props } = this
    const { theme, formListing, types } = props
    const { type } = formListing
    const cfg = {
      ...props,
      currentType: types.find(o => o.value === type),
      templateLoader: this.getLoader,
      getNextSequence: this.getNextSequence,
    }
    return (
      <div
        style={{
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
        }}
      >
        {type === '2' && <Form {...cfg} />}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })((props) => (
  <SizeContainer size='sm'>
    {(extraProps) => {
      return <AddForm {...props} {...extraProps} />
    }}
  </SizeContainer>
))
