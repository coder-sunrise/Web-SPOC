import * as service from '@/services/common'

const url = '/api/ctindividualcomment'

const fns = {
  queryList: params =>
    service.queryList(url, {
      ...params,
      sorting: params?.sorting || [
        {
          columnName: 'examinationItem',
          direction: 'asc',
          sortBy: 'examinationItemFKNavigation.DisplayValue',
        },
        {
          columnName: 'groupNo',
          direction: 'asc',
          sortBy: 'groupNo',
        },
        {
          columnName: 'displayValue',
          direction: 'asc',
          sortBy: 'displayValue',
        },
      ],
    }),
  upsert: params => service.upsert(url, params),
  remove: params => service.remove(url, params),
}

export default fns
