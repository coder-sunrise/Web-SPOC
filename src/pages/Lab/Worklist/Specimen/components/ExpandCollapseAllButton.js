import React from 'react'
import { Button, Space } from 'antd'
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons'
import { size } from 'lodash'

export const ExapandCollapseAllButton = ({
  onExpandAllClick,
  onCollapseAllClick,
}) => {
  return (
    <Space>
      <Button
        onClick={onExpandAllClick}
        type='primary'
        icon={<DownCircleOutlined />}
        size='small'
      >
        Expand All
      </Button>
      <Button
        onClick={onCollapseAllClick}
        type='primary'
        icon={<UpCircleOutlined />}
        size='small'
      >
        Collapse All
      </Button>
    </Space>
  )
}
