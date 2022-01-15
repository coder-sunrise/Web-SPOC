import * as service from '@/services/common'

const url = '/api/ctsummarycomment'

const fns = {
  queryList: params =>
    service.queryList(url, {
      ...params,
      sorting: params?.sorting || [
        {
          columnName: 'summaryCommentCategory',
          direction: 'asc',
          sortBy: 'SummaryCommentCategoryFKNavigation.DisplayValue',
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
