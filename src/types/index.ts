type typeMark = {
  toolTipRef: HTMLElement | null
  elemRef: HTMLElement | null
  seqId: string
}

type typeMarkMeta = {
  lastVisited: number
  count: number
}

type typePage = {
  lastVisited: number,
  count: number,
  uri: string,
  marks: Array<typeMark>
}

type typeOverlay = {
  visible?: boolean
}

type typeElemDim = {
  left: number,
  top: number,
  bottom: number
  right: number
}

type typeCoachMark = {
  seqId: string,
  msg: string,
  uri: string
}

export {
  typeMark,
  typePage,
  typeMarkMeta,
  typeOverlay,
  typeElemDim,
  typeCoachMark
}