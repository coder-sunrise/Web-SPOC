import { Divider } from '@material-ui/core'
import Authorized from '@/utils/Authorized'
import { htmlDecodeByRegExp } from '@/utils/utils'
import { tagList } from '@/utils/codes'
import { DOSAGE_RULE, DOSAGE_RULE_OPERATOR } from '@/utils/constants'

const getCautionAlertContent = (cuationItems) => () => {
  return (
    <div
      style={{
        minHeight: 80,
        display: 'grid',
        alignItems: 'center',
      }}
    >
      <div style={{ margin: 5 }}>
        {cuationItems.length > 0 && (
          <div>
            <p>
              <h4
                style={{ fontWeight: 400, textAlign: 'left', marginBottom: 10 }}
              >
                Cautions
              </h4>
            </p>
          </div>
        )}
        {cuationItems.map((m) => (
          <div
            style={{
              display: 'flex',
              marginLeft: 20,
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <div
              style={{
                width: 150,
                textAlign: 'left',
                display: 'inline-table',
              }}
            >
              <span>
                <b>{m.subject} - </b>
              </span>
            </div>
            <div style={{ textAlign: 'left' }}>{m.caution}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const getRetailCautionAlertContent = (
  cuationItems = [],
  ignoreVaccinationItems = [],
) => () => {
  return (
    <div
      style={{
        minHeight: 80,
        display: 'grid',
        alignItems: 'center',
      }}
    >
      <div style={{ margin: 5 }}>
        {cuationItems.length > 0 && (
          <div>
            <p>
              <h4 style={{ fontWeight: 400 }}>Cautions</h4>
            </p>
          </div>
        )}

        {cuationItems.map((m) => (
          <div
            style={{
              display: 'flex',
              marginLeft: 20,
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <div
              style={{
                width: 150,
                textAlign: 'left',
                display: 'inline-table',
              }}
            >
              <span>
                <b>{m.subject} - </b>
              </span>
            </div>
            <div style={{ textAlign: 'left' }}>{m.caution}</div>
          </div>
        ))}
      </div>
      {ignoreVaccinationItems.length > 0 &&
      cuationItems.length > 0 && (
        <Divider light style={{ marginBottom: 10, marginTop: 10 }} />
      )}
      {ignoreVaccinationItems.length > 0 && (
        <div style={{ marginLeft: 5, marginRight: 5 }}>
          <p>
            <h4 style={{ fontWeight: 400 }}>
              Vaccination item(s) will not be added.
            </h4>
          </p>
          <div style={{ marginLeft: 20 }}>
            {ignoreVaccinationItems.map((item) => (
              <p>
                <b>{item.subject}</b>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const openCautionAlertPrompt = (cautionItems, onClose) => {
  window.g_app._store.dispatch({
    type: 'global/updateAppState',
    payload: {
      openConfirm: true,
      isInformType: true,
      openConfirmContent: getCautionAlertContent(cautionItems),
      openConfirmText: 'OK',
      onConfirmClose: onClose,
    },
  })
}

const openCautionAlertOnStartConsultation = (o) => {
  const { corPrescriptionItem = [], corVaccinationItem = [] } = o
  const drugItems = corPrescriptionItem
    .filter((i) => i.caution && i.caution.trim().length > 0)
    .map((m) => {
      return { subject: m.drugName, caution: m.caution }
    })
  const vaccinationItems = corVaccinationItem
    .filter((i) => i.caution && i.caution.trim().length > 0)
    .map((m) => {
      return { subject: m.vaccinationName, caution: m.caution }
    })
  const hasCautionItems = [
    ...drugItems,
    ...vaccinationItems,
  ]

  if (hasCautionItems.length > 0) {
    openCautionAlertPrompt(hasCautionItems)
  }
}

const GetOrderItemAccessRight = (from = 'Consultation', accessRight) => {
  let editAccessRight = accessRight
  let strOrderAccessRight = ''
  if (from === 'EditOrder') {
    strOrderAccessRight = 'queue.dispense.editorder'
  } else if (from === 'Consultation') {
    strOrderAccessRight = 'queue.consultation.widgets.order'
  }
  const orderAccessRight = Authorized.check(strOrderAccessRight)
  if (!orderAccessRight || orderAccessRight.rights !== 'enable') {
    editAccessRight = strOrderAccessRight
  }
  return editAccessRight
}

const ReplaceCertificateTeplate = (templateContent, newVaccination) => {
  const templateReg = /<a.*?data-value="(.*?)".*?<\/a>/gm
  let msg = htmlDecodeByRegExp(templateContent)
  const match = msg.match(templateReg) || []
  match.forEach((s) => {
    const value = s.match(/data-value="(.*?)"/)[1]
    const m = tagList.find((o) => o.value === value)
    if (m && m.getter) msg = msg.replace(s, m.getter(newVaccination))
  })
  return msg
}

const isMatchInstructionRule = (rule, age, weight) => {
  let isMatch = false;
  if (rule.ruleType == DOSAGE_RULE.default) {
    isMatch = true;
  }
  else if (rule.ruleType == DOSAGE_RULE.age) {
    if (age >= 0) {
      if ((rule.operator == DOSAGE_RULE_OPERATOR.to && age >= rule.leftOperand && age <= rule.rightOperand)
        || (rule.operator == DOSAGE_RULE_OPERATOR.lessThan && age < rule.rightOperand)
        || (rule.operator == DOSAGE_RULE_OPERATOR.moreThan && age > rule.rightOperand)) {
        isMatch = true;
      }
    }
  }
  else if (rule.ruleType == DOSAGE_RULE.weight) {
    if (weight >= 0) {
      if ((rule.operator == DOSAGE_RULE_OPERATOR.to && weight >= rule.leftOperand && weight <= rule.rightOperand)
        || (rule.operator == DOSAGE_RULE_OPERATOR.lessThan && weight < rule.rightOperand)
        || (rule.operator == DOSAGE_RULE_OPERATOR.moreThan && weight > rule.rightOperand)) {
        isMatch = true;
      }
    }
  }
  return isMatch;
}

export {
  getCautionAlertContent,
  openCautionAlertPrompt,
  openCautionAlertOnStartConsultation,
  getRetailCautionAlertContent,
  GetOrderItemAccessRight,
  ReplaceCertificateTeplate,
  isMatchInstructionRule,
}
