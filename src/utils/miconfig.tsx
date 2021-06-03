import { useModel } from 'umi'
import { MIConfig } from '@medisys/utils'
import { removeEmpty } from '@/utils/utils'

const codeLoading = {}

const getCodes = async (
  request: (config: any) => Promise<any>,
  params?: Record<string, any>,
) => {
  const response = await request({
    IsActive: true,
    PageSize: GLOBAL_CONFIG.maxPageSize,
    ...params,
  })

  // console.log(response?.data?.data);
  return response?.data?.data
}
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
    console.log(args)
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    const r = (await request.apply(this, args)) as any
    result = {
      ...r,
      data: {
        data: (r.data?.data || []).map((o: any) => ({
          key: o.id,
          ...o,
        })),
        ...r.data?.pagination,
      },
      success: !r.detailsErrorMessage,
    }

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
  dataLoader: async ({ code }: { code: string }) => {
    if (codeLoading[code]) {
      return []
    }
    codeLoading[code] = true
    let data = []
    switch (code) {
      case 'status':
        data = [
          {
            value: true,
            label: <span style={{ color: 'green' }}>Active</span>,
          },
          {
            value: false,
            label: <span style={{ color: 'red' }}>Inactive</span>,
          },
        ]
        break

      case 'user':
        data = [
          {
            id: 1,
            name: '123',
          },
        ] as any
        break
      case 'role':
        data = await getCodes(queryRoles)
        break
      case 'client':
        data = await getCodes(queryClients)
        break

      case 'clientAccessRight':
        data = await getCodes(queryClientAccessRights, { IsActive: undefined })
        break

      case 'apiPermission':
        data = await getCodes(queryPermissions)
        break

      default:
        break
    }
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
