import Dexie from 'dexie'

const db = new Dexie('SEMRGen2')

const CodeTableSchema = {
  codetable: 'code, data, createDate, updateDate',
}

db.version(1).stores({ codetable: 'code, data, createDate, updateDate' })

export default db
