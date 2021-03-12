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
    file = {},
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
    this.file = file
    this.loc = loc
    this.fnList = fnList
    this.children = children
  }
}
