import { render } from 'react-dom'
import './index.css'
import * as React from 'react'
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars'

export default class TimePicker extends React.PureComponent {
  render() {
    const { onTimeChange, value, max, min, step } = this.props
    return (
      <div className='control-pane default'>
        <div className='control-section'>
          <div className='timepicker-control-section'>
            <TimePickerComponent
              value={value}
              change={onTimeChange}
              max={max}
              min={min}
              format='hh:mm a'
              step={step}
            />
          </div>
        </div>
      </div>
    )
  }
}
