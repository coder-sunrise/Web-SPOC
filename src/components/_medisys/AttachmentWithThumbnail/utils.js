export const imageFileExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  'jpg',
  'jpeg',
  'png',
]

export const wordFileExtensions = [
  '.doc',
  '.docx',
  'doc',
  'docx',
]

export const excelFileExtensions = [
  '.xls',
  '.xlsx',
  'xlsx',
  'xls',
]

export const pdfFileExtensions = [
  '.pdf',
  'pdf',
]

export const getThumbnail = (original, { scale, width, height }) => {
  let canvas = document.createElement('canvas')

  if (width && height) {
    canvas.width = width
    canvas.height = height
  } else {
    canvas.width = original.width * scale
    canvas.height = original.height * scale
  }

  canvas.getContext('2d').drawImage(original, 0, 0, canvas.width, canvas.height)

  return canvas
}
