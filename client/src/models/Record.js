import shortid from 'shortid'

export default class Record {
  constructor ({
    title = '未命名记录',
    desc = '',
    data
  }) {
    this.id = shortid.generate()
    this.type = 'RECORD'
    this.title = title
    this.desc = desc
    this.data = data
  }
}
