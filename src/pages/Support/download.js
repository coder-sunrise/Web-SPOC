import request from '@/utils/request'

const url = '/api/files/printingtoollink'
export const downloadTeamviewer = (fileName) => {
  try {
    const link = document.createElement('a')
    link.href = 'https://dl.teamviewer.cn/download/TeamViewer_Setup.exe'
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (error) {
    console.log({ error })
  }
}

export const getFileByFileID = async () => {
  const response = await request(`${url}`, {
    method: 'GET',
  }) 
  return response
}

export const downloadPrintingTool = async (fileName) => {
  try {
    const response = await getFileByFileID() 
    const { data, status } = response
    if (status === "200") {
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
