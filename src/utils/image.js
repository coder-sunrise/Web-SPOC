const ScaleMode = {
  FixedWH: 1,
  FixedW: 2,
  FixedH: 3,
  MaxWH: 4,
}

const scaleImage = (
  image,
  containerWidth,
  containerHeight,
  mode = ScaleMode.MaxWH,
) => {
  let towidth = containerWidth
  let toheight = containerHeight

  switch (mode) {
    case ScaleMode.FixedWH:
      break
    case ScaleMode.FixedW:
      toheight = image.height * containerWidth / image.width
      break
    case ScaleMode.FixedH:
      towidth = image.width * containerHeight / image.height
      break
    case ScaleMode.MaxWH:
      // eslint-disable-next-line no-case-declarations
      const rmaxW = image.width * 1.0 / containerWidth
      // eslint-disable-next-line no-case-declarations
      const rmaxH = image.height * 1.0 / containerHeight

      if (rmaxW > rmaxH) {
        if (rmaxW <= 1) {
          towidth = image.width
          containerHeight = image.height
          toheight = containerHeight
          // goto case ScaleMode.FixedWH;
          break
        }
        towidth = containerWidth
        // goto case ScaleMode.FixedW;
        toheight = image.height * containerWidth / image.width
        break
      }
      if (rmaxH <= 1) {
        towidth = image.width
        containerHeight = image.height
        toheight = containerHeight
        // goto case ScaleMode.FixedWH;
        break
      }
      toheight = containerHeight
      // goto case ScaleMode.FixedH;
      towidth = image.width * containerHeight / image.height
      break
    default:
      break
  }
  return { width: towidth, height: toheight }
}

export { ScaleMode, scaleImage }
