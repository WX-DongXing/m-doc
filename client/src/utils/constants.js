// edge default props
const EDGE_PROPS = {
  // snap: true,
  // allowBlank: false,
  // allowLoop: false,
  // highlight: true,
  // sourceAnchor: 'bottom',
  // targetAnchor: 'center',
  // connectionPoint: 'anchor',
  // connector: 'algo-edge',
  router: {
    name: 'orth'
  },
  attrs: {
    line: {
      targetMarker: {
        args: { size: 6 },
        name: 'block'
      },
      stroke: '#200097',
      strokeWidth: 1
    }
  }
}

export {
  EDGE_PROPS
}
