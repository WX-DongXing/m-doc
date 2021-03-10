import shortid from 'shortid'

export default class Record {
  constructor ({
    title = '未命名记录',
    desc = '',
    nodes = [],
    edges = []
  }) {
    this.id = shortid.generate()
    this.type = 'RECORD'
    this.title = title
    this.desc = desc
    this.nodes = nodes
    this.edges = edges
  }
}
