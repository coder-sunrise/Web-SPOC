import request, { axiosRequest } from '@/utils/request'

const url = '/api/files'

// sample payload
// {
//   "fileName": "f2",
//   "fileExtension": "jpg",
//   "fileCategoryFK": "1",
//   "fileSize": "11111",
//   "content": "{base64 content}",
//   "IsConfirmed": "false"
// }
export const uploadFile = async (payload) => {
  const response = await request(url, {
    method: 'POST',
    data: JSON.stringify(payload),
  })
  return response
}

export const getFileByFileID = async (fileID) => {
  const response = await axiosRequest(`${url}/${fileID}`, {
    method: 'GET',
    responseType: 'arraybuffer',
  })
  return response
}

export const downloadFile = async (data, fileName) => {
  try {
    const dataUrl = window.URL.createObjectURL(
      new Blob([
        data,
      ]),
    )
    const link = document.createElement('a')
    link.href = dataUrl
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (error) {
    console.log({ error })
  }
}

export const downloadAttachment = async (attachment) => {
  try {
    const { fileIndexFK, id } = attachment
    const response = await getFileByFileID(!fileIndexFK ? id : fileIndexFK)

    const { data, status } = response
    if (status >= 200 && status < 300) downloadFile(data, attachment.fileName)
  } catch (error) {
    console.log({ error })
  }
}

export const deleteFileByFileID = async (fileID) => {
  const response = await request(`${url}/${fileID}`, { method: 'DELETE' })
  return response
}
