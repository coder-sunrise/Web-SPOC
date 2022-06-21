const CopayerDropdownOption = props => {
  const { option } = props
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
        {`${option.displayValue}`}
      </span>
    </div>
  )
}
export default CopayerDropdownOption
