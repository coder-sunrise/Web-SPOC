import React, { useState, useEffect } from 'react'
import { useDispatch } from 'umi'
import _, { curry } from 'lodash'
import { Space } from 'antd'
import PropTypes from 'prop-types'
import TableData from '@/pages/Dispense/DispenseDetails/TableData'
import Authorized from '@/utils/Authorized'
import { UnorderedListOutlined } from '@ant-design/icons'
import { LAB_SPECIMEN_STATUS, LAB_WORKITEM_STATUS } from '@/utils/constants'
import { Link } from '@material-ui/core'
import {
  Button,
  ProgressButton,
  GridItem,
  GridContainer,
  CommonTableGrid,
  TextField,
  CommonModal,
  NumberInput,
  Popper,
  notification,
  Icon,
  Tooltip,
} from '@/components'
import Print from '@material-ui/icons/Print'
import { TestPanelColumn } from '../../Worklist/components/TestPanelColumn'
import CollectSpecimen from './CollectSpecimen'
import { useCodeTable } from '@/utils/hooks'

const DispenseDetailsSpecimenCollection = ({ visitId, ...restProps }) => {
  const dispatch = useDispatch()
  const [labSpecimens, setLabSpecimens] = useState([])
  const [collectSpecimenPara, setCollectSpecimenPara] = useState({
    open: false,
    id: undefined,
    mode: 'new',
  })
  const cttestpanel = useCodeTable('cttestpanel')
  const ctspecimentype = useCodeTable('ctspecimentype')

  const columns = [
    {
      title: 'Service Name',
      name: 'serviceName',
    },
    {
      title: 'Specimen Type',
      name: 'specimenType',
    },
    {
      title: 'Test Panels',
      name: 'testPanels',
    },
    {
      title: 'Accession No',
      name: 'accessionNo',
    },
    { name: 'action', title: 'Action' },
  ]

  const columnExtensions = [
    {
      columnName: 'specimenType',
      width: 180,
    },
    {
      columnName: 'testPanels',
      render: row => {
        return <TestPanelColumn testPanels={row.testPanels} />
      },
    },
    {
      columnName: 'accessionNo',
      width: 150,
      render: row => {
        return row.specimenStatusFK === LAB_SPECIMEN_STATUS.NEW ? (
          <Link
            component='button'
            style={{ marginLeft: 10 }}
            onClick={() => {
              setCollectSpecimenPara({
                visitId,
                labSpecimenId: row.labSpecimenFK,
                open: true,
                mode: 'edit',
              })
            }}
          >
            {row.accessionNo}
          </Link>
        ) : (
          row.accessionNo
        )
      },
    },
    {
      columnName: 'action',
      align: 'left',
      width: 120,
      render: row => (
        <Space size='small' align='center'>
          {row.dateReceived &&
            row.specimenStatusFK !== LAB_SPECIMEN_STATUS.DISCARDED && (
              <Tooltip title='Open Specimen Details'>
                <Button
                  onClick={() => {
                    // setCurrentModal({
                    //   modal: MODALS.SPECIMEN_DETAILS,
                    //   para: record.labSpecimenFK,
                    // })
                    // setIsAnyWorklistModelOpened(true)
                  }}
                  justIcon
                  color='primary'
                  size='sm'
                >
                  <UnorderedListOutlined />
                </Button>
              </Tooltip>
            )}
          <Button
            color='primary'
            onClick={() => {}}
            size='sm'
            justIcon
            style={{ height: 25, marginTop: 2 }}
          >
            <Print />
          </Button>
          {row.dateReceived &&
            row.specimenStatusFK === LAB_SPECIMEN_STATUS.NEW && (
              <Tooltip title='Discard Specimen'>
                <Button
                  onClick={() => {
                    // setCurrentModal({
                    //   modal: MODALS.DISCARD_SPECIMEN,
                    //   para: row.labSpecimenFK,
                    // })
                    // setIsAnyWorklistModelOpened(true)
                  }}
                  justIcon
                  color='danger'
                  size='sm'
                >
                  <Icon type='flask-empty' />
                </Button>
              </Tooltip>
            )}
        </Space>
      ),
    },
  ]

  const getVisitSpecimenCollection = () => {
    dispatch({
      type: 'specimenCollection/getVisitSpecimenCollection',
      payload: { id: visitId },
    }).then(result => {
      if (result) {
        setLabSpecimens(groupWorkitemsBySpecimens(result.specimenLabWorkitems))
      }
    })
  }

  useEffect(() => {
    if (visitId && cttestpanel.length > 0 && ctspecimentype.length > 0)
      getVisitSpecimenCollection()
    return () => cleanUpStates()
  }, [visitId, cttestpanel, ctspecimentype])

  const cleanUpStates = () => {
    setLabSpecimens([])
  }

  const closeCollectSpecimen = () => {
    setCollectSpecimenPara({
      open: false,
      visitId: undefined,
      labSpecimenId: undefined,
      mode: 'new',
    })
    getVisitSpecimenCollection()
  }

  const groupWorkitemsBySpecimens = labWorkitems => {
    return _.uniqBy(
      labWorkitems.map(item => {
        const curSpecimenLabWorkitems = labWorkitems.filter(
          innerItem => innerItem.labSpecimenFK === item.labSpecimenFK,
        )

        const serviceName = _.sortBy(
          curSpecimenLabWorkitems,
          'serviceName',
        ).reduce((prev, current) => {
          return `${prev ? prev + ', ' : ''}${current.serviceName}`
        }, '')

        const specimenType = ctspecimentype.find(
          specimenType => specimenType.id === item.specimenTypeFK,
        ).name

        const testPanels = _.uniq(
          curSpecimenLabWorkitems.map(innerItem => ({
            testPanelFK: innerItem.testPanelFK,
            testPanelName: cttestpanel.find(
              item => item.id === innerItem.testPanelFK,
            )?.name,
            priority: innerItem.priority,
          })),
        )

        return {
          ...item,
          serviceName,
          specimenType,
          testPanels,
        }
      }),
      'labSpecimenFK',
    )
  }

  return (
    <React.Fragment>
      <TableData
        title='Lab Specimen Collection'
        forceRender
        oddEven={false}
        onSelectionChange={value => {
          handleSelectionChange('Service', value)
        }}
        idPrefix='Service'
        columns={columns}
        colExtensions={columnExtensions}
        data={labSpecimens}
      />
      <Link
        component='button'
        style={{ marginLeft: 10, textDecoration: 'underline' }}
        onClick={() => {
          setCollectSpecimenPara({
            open: true,
            visitId,
            labSpecimenId: undefined,
            mode: 'new',
          })
        }}
      >
        Collect Specimen
      </Link>
      <CollectSpecimen
        {...collectSpecimenPara}
        onConfirm={() => {
          closeCollectSpecimen()
        }}
        onClose={() => {
          closeCollectSpecimen()
        }}
      ></CollectSpecimen>
    </React.Fragment>
  )
}

DispenseDetailsSpecimenCollection.propTypes = {
  visitId: PropTypes.number.isRequired,
}

export default DispenseDetailsSpecimenCollection
