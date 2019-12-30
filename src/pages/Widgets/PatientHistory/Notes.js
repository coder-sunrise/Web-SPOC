export default ({ classes, current, fieldName = '' }) => {
  let e = document.createElement('div')
  e.innerHTML = current[fieldName]
  let htmlData = e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue

  return (
    <div>
      {current[fieldName] !== undefined ? (
        <div
          className={classes.paragraph}
          dangerouslySetInnerHTML={{ __html: htmlData }}
        />
      ) : (
        ''
      )}
    </div>
  )
}
