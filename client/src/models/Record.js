import shortid from 'shortid'

export default class Record {
  constructor ({
    title = '未命名记录',
    desc = '',
    nodes = [],
    edges = [],
    parentId
  }) {
    this.id = shortid.generate()
    this.parentId = parentId
    this.type = 'RECORD'
    this.title = title
    this.desc = desc
    this.nodes = nodes
    this.edges = edges
  }
}
