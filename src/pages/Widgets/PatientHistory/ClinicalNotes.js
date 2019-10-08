// import { CommonTableGrid } from '@/components'

// export default ({ classes, current }) => (
//   <div>
//     <div
//       className={classes.paragraph}
//       dangerouslySetInnerHTML={{ __html: current.chiefComplaints }}
//     />
//   </div>
// )


import { CommonTableGrid } from '@/components'

export default ({ classes, current }) => {
  let e = document.createElement('div')
  e.innerHTML = current.clinicalNote
  let htmlData = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue

  return (
    <div>
      {current.plan !== undefined ? (
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
