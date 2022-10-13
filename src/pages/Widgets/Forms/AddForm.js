import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
import _ from 'lodash'

import { SizeContainer } from '@/components'
import Form from './Form'

const styles = theme => ({
  editor: {
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    zIndex: 1,
    right: 3,
    top: 12,
  },
})

@connect(({ forms, user, codetable, visitRegistration, patient }) => ({
  forms,
  user,
  codetable,
  visitEntity: visitRegistration.entity || {},
  patient,
}))
class AddForm extends PureComponent {
  getNextSequence = () => {
    const {
      forms: { rows, type },
    } = this.props
    const allForms = rows.filter(s => !s.isDeleted)
    let nextSequence = 1
    if (allForms && allForms.length > 0) {
      const { sequence } = _.maxBy(allForms, 'sequence')
      nextSequence = sequence + 1
    }
    return nextSequence
  }

  render() {
    const { props } = this
    const { theme, forms, types } = props
    const { type, formName, templateContent } = forms
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
