import Dexie from 'dexie'

const db = new Dexie('jgh-init')

// const CodeTableSchema = {
//   codetable: 'code, data, createDate, updateDate',
// }

db.version(1).stores({ codetable: 'code, data, createDate, updateDate' })

export default db
