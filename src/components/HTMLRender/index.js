import {
  EditorState,
  ContentState,
  convertToRaw,
  Modifier,
  Entity,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { htmlEncodeByRegExp, htmlDecodeByRegExp } from '@/utils/utils'

export default ({ html }) => {
  if (html === undefined) return null
  // console.log(html, htmlDecodeByRegExp(html))
  return <div dangerouslySetInnerHTML={{ __html: htmlDecodeByRegExp(html) }} />
}
