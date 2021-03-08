import { Graph, Node } from '@antv/x6'

export class FnGroup extends Node {
  isCollapsed () {
    return this.collapsed
  }

  toggleCollapse (collapsed) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
      this.expandSize = this.getSize()
      this.resize(180, 40)
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5' })
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height)
      }
    }
    this.collapsed = target
  }

  postprocess () {
    this.toggleCollapse()
  }
}

FnGroup.config({
  markup: [
    {
      tagName: 'rect',
      selector: 'body'
    },
    {
      tagName: 'text',
      selector: 'title'
    },
    {
      tagName: 'text',
      selector: 'desc'
    },
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted'
          }
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none'
          }
        }
      ]
    }
  ],
  attrs: {
    body: {
      rx: 4, // 圆角矩形
      ry: 4,
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: 'white',
      stroke: '#5f32c9'
    },
    buttonGroup: {
      refX: 8,
      refY: 12
    },
    button: {
      height: 16,
      width: 16,
      rx: 2,
      ry: 2,
      fill: 'transparent',
      stroke: 'transparent',
      cursor: 'pointer',
      event: 'node:collapse'
    },
    buttonSign: {
      refX: 3,
      refY: 3,
      stroke: '#808080'
    },
    title: {
      fontSize: 14,
      fill: 'black',
      refX: 32,
      refY: 7
    },
    desc: {
      fontSize: 10,
      fill: '#454851',
      refX: 32,
      refY: 25,
      textWrap: {
        width: 140,
        height: 16,
        breakWord: true,
        ellipsis: true
      }
    }
  }
})

Graph.registerNode('fn-group', FnGroup)
