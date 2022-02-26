const ResultDetails = props => {
  const { height } = props
  return (
    <div style={{ backgroundColor: 'red', height: height, overflow: 'auto' }}>
      Result Details
    </div>
  )
}
export default ResultDetails
