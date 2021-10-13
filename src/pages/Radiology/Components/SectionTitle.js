import React from 'react'
import { Typography } from 'antd'

export const SectionTitle = ({ title }) => (
  <Typography.Title
    level={5}
    style={{ marginTop: 15, marginBottom: 10, marginLeft: 15 }}
  >
    {title}
  </Typography.Title>
)
