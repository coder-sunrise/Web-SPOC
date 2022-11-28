import React, { PureComponent } from 'react'
import _ from 'lodash'
import Loadable from 'react-loadable'
import Add from '@material-ui/icons/Add'
import Authorized from '@/utils/Authorized'
import {
  FastEditableTableGrid,
  Button,
  CommonModal,
  notification,
  Tooltip,
  GridContainer,
  GridItem,
  Field,
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
    const accessRight = Authorized.check(
      'patientdatabase.patientprofiledetails.familymembers',
    )
    let disabledByAccessRight = true
    if (accessRight) disabledByAccessRight = accessRight.rights === 'disable'

    return (
      <GridContainer>
        <GridItem>
          <EmergencyContactGrid
            {...this.props}
            disabled={disabledByAccessRight}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

export default EmergencyContact
