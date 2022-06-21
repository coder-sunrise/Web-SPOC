const CopayerDropdownOption = props => {
  const { option, labelField = 'displayValue' } = props
  return (
    <div
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {option.code ? `${option.code} - ` : ''}
      <span style={{ fontWeight: option.code ? 'bold' : 'normal' }}>
        {`${option[labelField]}`}
      </span>
    </div>
  )
}
export default CopayerDropdownOption
