import request from '@/utils/request'

const url = '/api/files/printingtoollink'

export const getFileByFileID = async key => {
  const response = await request(`${url}?key=${key}`, {
    method: 'GET',
  })
  return response
}

export const downloadPrintingTool = async (fileName, key) => {
  try {
    const response = await getFileByFileID(key)
    const { data, status } = response
    if (status === '200') {
      const link = document.createElement('a')
      link.href = data
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    }
  } catch (error) {
    console.log({ error })
  }
}
