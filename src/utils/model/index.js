import BaseCRUDViewModel from './BaseCRUDViewModel'
import BaseListViewModel from './BaseListViewModel'
import BaseFormViewModel from './BaseFormViewModel'
import BaseNaviViewModel from './BaseNaviViewModel'

module.exports = {
  createBasicModel: (options) => new BaseCRUDViewModel(options).create(),
  createFormViewModel: (options) => new BaseFormViewModel(options).create(),
  createListViewModel: (options) => new BaseListViewModel(options).create(),
  createNaviViewModel: (options) => new BaseNaviViewModel(options).create(),
  createListOptionModel: (options) => new BaseNaviViewModel(options).create(),
}
