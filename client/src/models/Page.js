import shortid from 'shortid'

export default class Page {
  constructor ({
    title = '未命名页',
    desc = '',
    children = []
  }) {
    this.id = shortid.generate()
    this.type = 'PAGE'
    this.title = title
    this.desc = desc
    this.children = children
  }
}
