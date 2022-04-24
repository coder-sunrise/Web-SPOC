import numeral from 'numeral'
import { compose } from 'redux'
import moment from 'moment'
import Info from '@material-ui/icons/Info'
import { connect } from 'dva'
import { qtyFormat, currencyFormat, currencySymbol } from '@/utils/config'
import { IconButton, Popover, Tooltip } from '@/components'
import { DOSAGE_RULE, DOSAGE_RULE_OPERATOR } from '@/utils/constants'
import { isMatchInstructionRule } from '@/pages/Widgets/Orders/utils'

const LowStockInfo = ({
  sourceType,
  values = {},
  codetable,
  visitRegistration = {},
  patient = {},
  corVitalSign = [],
  right = -5,
  style = {
    position: 'absolute',
    bottom: 2,
    right: right,
  },
}) => {
  const {
    inventorymedication = [],
    inventoryconsumable = [],
    inventoryvaccination = [],
  } = codetable
  let source = {}

  if (
    sourceType === 'medication' ||
    (sourceType === 'prescriptionSet' && values.inventoryMedicationFK)
  ) {
    source = inventorymedication.find(
      m => m.id === values.inventoryMedicationFK,
    )
  } else if (sourceType === 'consumable' && values.inventoryConsumableFK)
    source = inventoryconsumable.find(
      m => m.id === values.inventoryConsumableFK,
    )
  else if (sourceType === 'vaccination' && values.inventoryVaccinationFK) {
    source = inventoryvaccination.find(
      m => m.id === values.inventoryVaccinationFK,
    )
  } else return ''

  if (!source) return ''

  const {
    criticalThreshold = 0.0,
    reOrderThreshold = 0.0,
    excessThreshold,
    stock = 0.0,
    isChasAcuteClaimable,
    isChasChronicClaimable,
    isMedisaveClaimable,
    sellingPrice = 0,
    medicationInstructionRule = [],
    prescribingUOM = {},
    dispensingUOM = {},
    medicationUsage = {},
  } = source

  let isLowStock
  let isReOrder
  let isExcessStock
  let stockIconTooltip = ''
  if (sourceType !== 'prescriptionSet') {
    isLowStock = stock <= criticalThreshold
    isReOrder = stock <= reOrderThreshold
    isExcessStock = excessThreshold && stock >= excessThreshold
    if (isLowStock) stockIconTooltip = 'Low Stock'
    if (isExcessStock) stockIconTooltip = 'Excess Stock'
  }

  const details = () => {
    const getInstructionDetails = () => {
      const instructions = _.orderBy(
        medicationInstructionRule,
        ['sortOrder'],
        ['asc'],
      ).map(instruction => {
        const {
          medicationFrequency = {},
          prescribingDosage = {},
          duration = 0,
          dispensingQuantity = 0,
          operator,
          ruleType,
          leftOperand = 0,
          rightOperand = 0,
        } = instruction
        let durationStr = ''
        let dispenseStr = ''
        let ruleStr = ''
        if (duration > 0) {
          durationStr = ` For ${numeral(duration).format('0')} day(s)`
        }
        if (dispensingQuantity > 0) {
          dispenseStr = `, dispense ${dispensingQuantity} ${dispensingUOM.name ||
            ''}`
        }
        if (ruleType === DOSAGE_RULE.age || DOSAGE_RULE.weight) {
          const unitStr = ruleType === DOSAGE_RULE.age ? 'yrs' : 'kgs'
          if (
            operator === DOSAGE_RULE_OPERATOR.lessThan ||
            operator === DOSAGE_RULE_OPERATOR.moreThan
          ) {
            ruleStr = `${operator} ${rightOperand}${unitStr}`
          } else if (operator === DOSAGE_RULE_OPERATOR.to) {
            ruleStr = `${leftOperand}${unitStr} ${operator} ${rightOperand}${unitStr}`
          }
        }
        const strDosage = `${
          ruleStr === '' ? '' : `${ruleStr}, `
        }${medicationUsage.name || ''} ${prescribingDosage.name ||
          ''} ${prescribingUOM.name || ''} ${medicationFrequency.name ||
          ''}${durationStr}${dispenseStr}`
        let isMatchInstruction
        if (sourceType === 'medication') {
          const { entity: patientEntity = {} } = patient

          let weightKG
          const activeVitalSign = corVitalSign.find(vs => !vs.isDeleted)
          if (activeVitalSign) {
            weightKG = activeVitalSign.weightKG
          } else {
            const visitBasicExaminations =
              visitRegistration.entity?.visit?.visitBasicExaminations || []
            if (visitBasicExaminations.length) {
              weightKG = visitBasicExaminations[0].weightKG
            }
          }

          let age
          if (patientEntity.dob) {
            age = Math.floor(
              moment.duration(moment().diff(patientEntity.dob)).asYears(),
            )
          }
          isMatchInstruction = isMatchInstructionRule(
            instruction,
            age,
            weightKG,
          )
        }

        return {
          ...instruction,
          strDisplayValue: strDosage,
          isMatchInstruction,
        }
      })

      return instructions.length
        ? instructions.map((instruction, index) => {
            return (
              <div
                style={{
                  color: instruction.isMatchInstruction ? 'green' : 'black',
                }}
              >
                {`${index + 1}. ${instruction.strDisplayValue}`}
              </div>
            )
          })
        : '-'
    }
    if (sourceType === 'medication' || sourceType === 'prescriptionSet') {
      return (
        <div style={{ fontSize: 14, maxWidth: 700 }}>
          <div style={{ fontWeight: 500 }}>Suggested Instruction:</div>
          <div>{getInstructionDetails()}</div>
          {sourceType === 'medication' && (
            <div>
              <span style={{ fontWeight: 500 }}>Current Stock: </span>
              <span style={{ color: stock < 0 ? 'red' : 'black' }}>{`${numeral(
                stock,
              ).format(qtyFormat)} ${dispensingUOM.name || ''}`}</span>
              <span>
                {isLowStock || isReOrder || isExcessStock ? (
                  <font color={isLowStock ? 'red' : 'black'}>
                    {' '}
                    {isExcessStock ? '(Excess Stock)' : '(Low Stock)'}
                  </font>
                ) : (
                  ''
                )}
              </span>
            </div>
          )}
          <div>
            <span style={{ fontWeight: 500 }}>Unit Price: </span>
            {`${currencySymbol}${numeral(sellingPrice).format(currencyFormat)}`}
          </div>
          {sourceType === 'prescriptionSet' && (
            <div>
              <div>
                <span style={{ fontWeight: 500 }}>Chas Acute Claimable: </span>
                {isChasAcuteClaimable ? 'Yes' : 'No'}
              </div>
              <div>
                <span style={{ fontWeight: 500 }}>
                  Chas Chronic Claimable:{' '}
                </span>
                {isChasChronicClaimable ? 'Yes' : 'No'}
              </div>
              <div>
                <span style={{ fontWeight: 500 }}>Medisave Claimable: </span>
                {isMedisaveClaimable ? 'Yes' : 'No'}
              </div>
            </div>
          )}
        </div>
      )
    }
    return (
      <div
        style={{
          fontSize: 14,
          height: 110,
        }}
      >
        <p>
          Current Stock: {numeral(stock).format(qtyFormat)}
          {isLowStock || isReOrder || isExcessStock ? (
            <font color={isLowStock ? 'red' : 'black'}>
              {' '}
              {isExcessStock ? '(Excess Stock)' : '(Low Stock)'}
            </font>
          ) : (
            ''
          )}
        </p>
        <p>
          Unit Price: {currencySymbol}
          {numeral(sellingPrice).format(currencyFormat)}
        </p>
        <p>CHAS Acute Claimable: {isChasAcuteClaimable ? 'Yes' : 'No'}</p>
        <p>CHAS Chronic Claimable: {isChasChronicClaimable ? 'Yes' : 'No'}</p>
        <p>Medisave Claimable: {isMedisaveClaimable ? 'Yes' : 'No'}</p>
      </div>
    )
  }
  return (
    <Popover
      icon={null}
      placement='bottomLeft'
      arrowPointAtCenter
      content={details()}
    >
      <Tooltip title={stockIconTooltip}>
        <IconButton style={{ ...style }} size='medium'>
          <Info color={isLowStock ? 'error' : 'primary'} />
        </IconButton>
      </Tooltip>
    </Popover>
  )
}

export default compose(
  connect(({ codetable }) => ({
    codetable,
  })),
)(LowStockInfo)
