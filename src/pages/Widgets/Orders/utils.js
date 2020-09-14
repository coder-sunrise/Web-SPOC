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

export { getCautionAlertContent, openCautionAlertPrompt }
