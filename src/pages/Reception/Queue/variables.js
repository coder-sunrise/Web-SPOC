export const StatusIndicator = {
  ALL: 'all',
  APPOINTMENT: 'appointment',
  WAITING: 'waiting',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
}

export const visitStatusCode = [
  'WAITING',
  'APPOINTMENT',
  'TO DISPENSE',
  'IN CONS',
  'PAUSED',
  'PAID',
  'OVERPAID',
  'COMPLETED',
]

export const filterMap = {
  [StatusIndicator.ALL]: [
    ...visitStatusCode,
  ].filter((item) => item !== 'APPOINTMENT'),
  [StatusIndicator.APPOINTMENT]: [
    'APPOINTMENT',
  ],
  [StatusIndicator.WAITING]: [
    'WAITING',
  ],
  [StatusIndicator.IN_PROGRESS]: [
    'TO DISPENSE',
    'IN CONS',
    'PAUSED',
  ],
  [StatusIndicator.COMPLETED]: [
    'PAID',
    'OVERPAID',
    'COMPLETED',
  ],
}
