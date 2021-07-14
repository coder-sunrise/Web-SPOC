import React, { PureComponent } from 'react'
import _ from 'lodash'
import Loadable from 'react-loadable'
import Add from '@material-ui/icons/Add'
import {
  FastEditableTableGrid,
  Button,
  CommonModal,
  notification,
  Tooltip,
  GridContainer,
  GridItem,
  Field
} from '@/components'
import Loading from '@/components/PageLoading/index'
import service from '@/services/patient'
import { getUniqueId } from '@/utils/utils'
import EmergencyContactGrid from './Grid/EmergencyContactGrid'
import FamilyMemberGrid from './Grid/FamilyMemberGrid'

const { query } = service
class EmergencyContact extends PureComponent {
  state = {
    editingRowIds: [],
    showModal: false,
  }


  render() {
    const { classes, dispatch, values, schema, ...restProps } = this.props
    // const { SearchPatient = f => f } = this

    return (
      <GridContainer>
        <GridItem>
          <EmergencyContactGrid {...this.props} />
        </GridItem>
        <GridItem style={{marginTop:50}}>
         <h4 style={{fontWeight:500}}>Family Members</h4>
        </GridItem>
        <GridItem>
          <FamilyMemberGrid {...this.props} />
        </GridItem>
      </GridContainer>
    )
  }
}

export default EmergencyContact
