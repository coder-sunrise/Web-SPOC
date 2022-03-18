import React, { useState, useEffect } from 'react'
import { useDispatch } from 'umi'
import _, { curry } from 'lodash'
import { Space, Typography } from 'antd'
import PropTypes from 'prop-types'
import TableData from '@/pages/Dispense/DispenseDetails/TableData'
import Authorized from '@/utils/Authorized'
import { UnorderedListOutlined } from '@ant-design/icons'
import { LAB_SPECIMEN_STATUS, LAB_WORKITEM_STATUS } from '@/utils/constants'
import { REPORT_ID } from '@/utils/constants'
import { Link } from '@material-ui/core'
import moment from 'moment'
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
  labSpecimenLabelDateFormat,
  Icon,
  Tooltip,
  dateFormatLongWithTimeNoSec,
} from '@/components'
import Print from '@material-ui/icons/Print'
import { TestPanelColumn } from '../../Worklist/components/TestPanelColumn'
import CollectSpecimen from './CollectSpecimen'
import { useCodeTable } from '@/utils/hooks'
import { DiscardSpecimen } from '../../Worklist/components'

const DispenseDetailsSpecimenCollection = ({
  visitId,
  handlePrint,
  patient,
  ...restProps
}) => {
  const dispatch = useDispatch()
  const [labSpecimens, setLabSpecimens] = useState([])
  const [newLabWorkitems, setNewLabWorkitems] = useState([])
  const [collectSpecimenPara, setCollectSpecimenPara] = useState({
    open: false,
    id: undefined,
    mode: 'new',
  })
  const [discardSpecimenPara, setDiscardSpecimenPara] = useState({
    open: false,
    id: undefined,
  })
  const cttestpanel = useCodeTable('cttestpanel')
  const ctspecimentype = useCodeTable('ctspecimentype')

  const columns = [
    {
      title: 'Service Name',
      name: 'serviceName',
    },

    {
      title: 'Test Panels',
      name: 'testPanelNames',
    },
    {
      title: 'Specimen Type',
      name: 'specimenType',
    },
    {
      title: 'Accession No.',
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
      columnName: 'accessionNo',
      width: 110,
      render: row => {
        if (row.specimenStatusFK === LAB_SPECIMEN_STATUS.NEW) {
          return (
            <Link
              component='button'
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
          )
        } else if (row.specimenStatusFK === LAB_SPECIMEN_STATUS.DISCARDED) {
          return (
            <Tooltip
              useTooltip2
              title={
                <div>
                  <div>
                    Discarded by {row.specimenDiscardedClinicianName} at{' '}
                    {row.lastUpdatedDate?.format(dateFormatLongWithTimeNoSec)}
                  </div>
                  <div>Reason: {row.specimenDiscardReason}</div>
                </div>
              }
            >
              <div>
                <Typography.Text delete>{row.accessionNo}</Typography.Text>
              </div>
            </Tooltip>
          )
        } else {
          return <span>{row.accessionNo}</span>
        }
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
          {row.specimenStatusFK !== LAB_SPECIMEN_STATUS.DISCARDED && (
            <Button
              color='primary'
              onClick={() => {
                printLabel(row.labSpecimenFK)
              }}
              size='sm'
              justIcon
              style={{ height: 25, marginTop: 2 }}
            >
              <Print />
            </Button>
          )}
          {row.specimenStatusFK === LAB_SPECIMEN_STATUS.NEW && (
            <Tooltip title='Discard Specimen'>
              <Button
                onClick={() => {
                  setDiscardSpecimenPara({
                    open: true,
                    id: row.labSpecimenFK,
                  })
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
        setNewLabWorkitems(
          result.labWorkitems.filter(
            lw => lw.statusFK === LAB_WORKITEM_STATUS.NEW,
          ),
        )

        setLabSpecimens(groupWorkitemsBySpecimens(result.specimenLabWorkitems))
      }
    })
  }

  const printLabel = (specimenId, copies) => {
    dispatch({
      type: 'specimenCollection/getLabSpecimenById',
      payload: { id: specimenId },
    }).then(labSpecimenData => {
      if (labSpecimenData) {
        let testPanel = labSpecimenData?.labSpecimenWorkitems
          ?.map(labWorkitem => labWorkitem.labWorkitem.testPanel)
          .join(', ')
        const data = {
          SampleLabelDetails: [
            {
              Gender:
                patient.genderFK === 1
                  ? 'Male'
                  : patient.genderFK === 2
                  ? 'Female'
                  : 'Unknown',
              Name: patient.name,
              AccessionNo: labSpecimenData.accessionNo,
              TestPanel: testPanel,
              SpecimenType: labSpecimenData.specimenType,
              SpecimenCollectionDate: moment(
                labSpecimenData.specimenCollectionDate,
              ).format(labSpecimenLabelDateFormat),
              ReferenceNo: patient.patientReferenceNo,
            },
          ],
        }
        const payload = [
          {
            Copies: copies,
            ReportId: REPORT_ID.LAB_SPECIMEN_LABEL_50MM_34MM,
            ReportData: JSON.stringify({
              ...data,
            }),
          },
        ]
        handlePrint(JSON.stringify(payload))
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

  const closeDiscardSpecimen = () => {
    setDiscardSpecimenPara({
      open: false,
      id: undefined,
    })
    getVisitSpecimenCollection()
  }

  const groupWorkitemsBySpecimens = labWorkitems => {
    return _.uniqBy(
      labWorkitems.map(item => {
        const curSpecimenLabWorkitems = labWorkitems.filter(
          innerItem => innerItem.labSpecimenFK === item.labSpecimenFK,
        )

        const serviceName = _(curSpecimenLabWorkitems)
          .sortBy(x => x.serviceName.toLowerCase())
          .uniqBy('serviceName')
          .value()
          .map(x => x.serviceName)
          .join(', ')

        const specimenType = ctspecimentype.find(
          specimenType => specimenType.id === item.specimenTypeFK,
        ).name

        const testPanelNames = _.uniq(
          curSpecimenLabWorkitems.map(innerItem => {
            const testPanelName = cttestpanel.find(
              item => item.id === innerItem.testPanelFK,
            )?.name
            return testPanelName ? testPanelName : ''
          }),
        ).join(', ')

        return {
          ...item,
          serviceName,
          specimenType,
          testPanelNames,
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
      {newLabWorkitems && newLabWorkitems.length > 0 && (
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
      )}
      <CollectSpecimen
        {...collectSpecimenPara}
        onConfirm={(newId, printInfo) => {
          if (printInfo.isPrintLabel) {
            printLabel(newId, printInfo.copies)
          }
          closeCollectSpecimen()
        }}
        patient={patient}
        onClose={() => {
          closeCollectSpecimen()
        }}
      ></CollectSpecimen>
      <DiscardSpecimen
        {...discardSpecimenPara}
        onClose={() => {
          closeDiscardSpecimen()
        }}
        patient={patient}
        onConfirm={() => {
          closeDiscardSpecimen()
        }}
      />
    </React.Fragment>
  )
}

DispenseDetailsSpecimenCollection.propTypes = {
  visitId: PropTypes.number.isRequired,
}

export default DispenseDetailsSpecimenCollection
