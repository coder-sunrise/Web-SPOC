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

  let content = canvas.getContext('2d')
  content.fillStyle = '#FFFFFF'
  content.fillRect(0, 0, canvas.width, canvas.height)
  content.drawImage(original, 0, 0, canvas.width, canvas.height)

  return canvas
}

export const generateThumbnailAsync = async (
  imageSource,
  size,
  fileExtension = 'jpeg',
) => {
  try {
    let thumbnailData
    await new Promise((resolve, reject) => {
      try {
        const image = new Image()
        image.src = imageSource
        image.onload = () => {
          const thumbnail = getThumbnail(image, size)
          thumbnailData = thumbnail.toDataURL(`image/${fileExtension}`)
          resolve()
        }
      } catch (ex) {
        reject(ex)
      }
    })
    return thumbnailData
  } catch (error) {
    return null
  }
}
