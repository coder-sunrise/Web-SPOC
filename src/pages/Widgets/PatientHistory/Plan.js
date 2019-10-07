// export default ({ classes, current }) => (
//   <div>
//     <div
//       className={classes.paragraph}
//       dangerouslySetInnerHTML={{ __html: current.plan }}
//     />
//   </div>
// )


import { CommonTableGrid } from '@/components'

export default ({ classes, current }) => {
  let e = document.createElement('div')
  e.innerHTML = current.plan
  let htmlData = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue

  return (
    <div
      className={classes.paragraph}
      dangerouslySetInnerHTML={{ __html:  htmlData }}
    />
  )
}