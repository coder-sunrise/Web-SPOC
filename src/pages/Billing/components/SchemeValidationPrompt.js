import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CommonTableGrid } from '@/components'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  warningText: {
    marginTop: theme.spacing(3),
  },
})

const SchemeValidationPrompt = ({
  classes,
  onConfirm,
  validation = { patient: [], billing: [] },
  footer,
}) => {
  const { patient, billing } = validation
  const largerList = patient.length >= billing.length ? 'patient' : 'billing'
  const shorterList = patient.length < billing.length ? 'patient' : 'billing'
  const rows = validation[largerList].map((item, index) => ({
    [largerList]: item,
    [shorterList]: validation[shorterList][index],
  }))

  return (
    <React.Fragment>
      <div className={classes.root}>
        <CommonTableGrid
          FuncProps={{ pager: false }}
          columns={[
            { name: 'patient', title: 'Patient Available Scheme(s)' },
            { name: 'billing', title: 'Billing Applied Scheme(s)' },
          ]}
          columnExtensions={[
            {
              columnName: 'patient',
              render: (row) => {
                const _row = row.patient
                if (_row) {
                  return (
                    <div>
                      <span>{_row.name}</span>
                      {_row.isExpired && (
                        <span style={{ color: 'red' }}>&nbsp;(Expired)</span>
                      )}
                    </div>
                  )
                }
                return null
              },
            },
            {
              columnName: 'billing',
              render: (row) => {
                const _row = row.billing
                if (_row) {
                  return <span>{_row.name}</span>
                }
                return null
              },
            },
          ]}
          rows={rows}
        />
        <h3 className={classes.warningText}>
          There are some problem(s) with the applied scheme. Confirm to proceed?
        </h3>
      </div>
      {footer &&
        footer({
          onConfirm,
        })}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'SchemeValidationPrompt' })(
  SchemeValidationPrompt,
)
