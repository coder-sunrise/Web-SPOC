import request from '@/utils/request'

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
  const response = await request(`${url}/${fileID}`, { method: 'GET' })
  return response
}

export const deleteFileByFileID = async (fileID) => {
  const response = await request(`${url}/${fileID}`, { method: 'DELETE' })
  return response
}
