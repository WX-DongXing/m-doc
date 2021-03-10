import shortid from 'shortid'

export default class Node {
  constructor ({
    name = '',
    desc = '',
    shape = 'fn-group',
    width = 180,
    height = 180,
    attr = {
      title: { text: '' },
      desc: { text: '' }
    },
    loc = {},
    children = []
  }) {
    this.id = shortid.generate()
    this.type = 'NODE'
    this.name = name
    this.desc = desc
    this.shape = shape
    this.width = width
    this.height = height
    this.attr = {
      title: { text: name },
      desc: { text: desc }
    }
    this.loc = loc
    this.children = children
  }
}
