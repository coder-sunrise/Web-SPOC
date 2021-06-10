import { useModel } from 'umi'
import { MIConfig } from '@medisys/utils'
import { removeEmpty } from '@/utils/utils'
import { getCodes, getAllCodes } from '@/utils/codetable'

const codeLoading = {}

const requestWrap = (request: () => Promise<unknown>, params: any) => {
  if (typeof request !== 'function') return null
  const { onSuccess, onError } = params || {}
  let result = {
    success: false,
    data: {},
    // "errorCode": "1001",
    // "errorMessage": "error message",
    // "showType": 2,
    // "traceId": "someid",
    // "host": "10.1.1.1"
  }
  return async function innerRequest(...args: any[]) {
    // console.log(params, args);
    // eslint-disable-next-line no-param-reassign
    args[0] = {
      // ...convertToAPIObject(removeEmpty(args[0])),
      ...removeEmpty(args[0]),
      sort:
        args[1] !== undefined && Object.keys(args[1]).length > 0
          ? [
              {
                sortby: Object.keys(args[1])[0],
                order: Object.values(args[1])[0] === 'ascend' ? 'asc' : 'desc',
              },
              // {
              //   sortBy: 'clientId',
              //   order: 'ASC',
              // },
            ]
          : [],
    }
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    const { data, ...rest } = (await request.apply(this, args)) as any
    result = {
      data: {
        data: (data?.data || []).map((o: any) => ({
          key: o.id,
          ...o,
        })),
        pagesize: data?.pageSize,
        current: data?.currentPage,
        total: data?.totalRecords,
      },
      success: !rest.detailsErrorMessage,
    }
    // console.log(result, rest)
    return new Promise((resolve, reject) => {
      if (result.success) {
        resolve(result.data)
        if (onSuccess) onSuccess()
      } else {
        reject(result)
        if (onError) onError()
      }
    })
  }
}

MIConfig.setConfig({
  cache: false,
  model: useModel,
  urls: {},
  keys: {
    accessToken: '_t',
    refreshToken: '_r',
    userAccessRights: '_ar',
    lastActiveTime: '_lat',
  },
  dataLoader: async ({ code, ...payload }: { code: string }) => {
    if (codeLoading[code]) {
      return []
    }
    codeLoading[code] = true
    let data = await getCodes({
      code,
      ...payload,
    })

    codeLoading[code] = false

    // const data = await dispatch({
    //   type: 'codeTable/getCodeTable',
    //   payload: {
    //     ctName: code,
    //   },
    // });
    return data
  },
  requestWrap,
})
setTimeout(() => {
  // MIConfig.loadData('user', {});
  // console.log(MIConfig.getData('user'));
}, 2000)
