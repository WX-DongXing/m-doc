import shortid from 'shortid'

export default class Node {
  constructor ({
    name = '',
    desc = '',
    shape = 'fn-group',
    width = 180,
    height = 180,
    attrs = {
      title: { text: '' },
      desc: { text: '' }
    },
    comment = {},
    loc = {},
    fnList = [],
    children = []
  }) {
    this.id = shortid.generate()
    this.type = 'NODE'
    this.name = name
    this.desc = desc
    this.shape = shape
    this.width = width
    this.height = height
    this.attrs = {
      title: { text: name },
      desc: { text: desc }
    }
    this.comment = comment
    this.loc = loc
    this.fnList = fnList
    this.children = children
  }
}
