import { axiosRequest } from '@/utils/request'

export const arrayBufferToBase64 = (buffer) => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export const BASE64_MARKER = 'data:application/pdf;base64,'

export const maxScale = 2.0

export const minScale = 1.0

export const defaultScreenSize = { height: 720, width: 1280 }

export const fetchReport = async (type = '', remainOriginal = false) => {
  const response = await axiosRequest(`/api/Report/QueueListing/${type}`, {
    method: 'POST',
    responseType: 'arraybuffer',
    body: { ListingFrom: '2017-7-1', ListingTo: '2017-7-31' },
  })
  const { data } = response

  const base64String = arrayBufferToBase64(data)
  return remainOriginal ? data : base64String
}
