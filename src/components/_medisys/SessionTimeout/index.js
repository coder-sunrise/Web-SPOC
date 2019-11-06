import React from 'react'

const SessionTimeout = ({ footer, onConfirm }) => (
  <React.Fragment>
    <div
      style={{
        textAlign: 'center',
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <h4>
        Your session is about to time-out. Would you like to remain logged on?
      </h4>
    </div>
    {footer &&
      footer({
        onConfirm,
        confirmBtnText: 'Yes',
      })}
  </React.Fragment>
)

export default SessionTimeout
