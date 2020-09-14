const getCautionAlertContent = (cuationItems, subContents) => () => {
  return (
    <div
      style={{
        minHeight: 80,
        display: 'grid',
        alignItems: 'center',
      }}
    >
      {cuationItems.map((m) => (
        <div style={{ display: 'flex', margin: 5 }}>
          <div
            style={{
              width: 150,
              textAlign: 'center',
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
      {subContents}
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

export {
  getCautionAlertContent,
  openCautionAlertPrompt,
  openCautionAlertOnStartConsultation,
}
