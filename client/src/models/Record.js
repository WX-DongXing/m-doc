import shortid from 'shortid'

export default class Record {
  constructor ({
    parentId,
    title = '未命名记录',
    desc = '',
    cells = [],
    nodes = [],
    edges = [],
    content = '',
    html = ''
  }) {
    this.id = shortid.generate()
    this.parentId = parentId
    this.type = 'RECORD'
    this.title = title
    this.desc = desc
    this.cells = cells
    this.nodes = nodes
    this.edges = edges
    this.content = content
    this.html = html
  }
}
