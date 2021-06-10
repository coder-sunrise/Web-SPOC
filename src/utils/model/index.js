import BaseCRUDViewModel from './BaseCRUDViewModel'
import BaseListViewModel from './BaseListViewModel'
import BaseFormViewModel from './BaseFormViewModel'
import BaseNaviViewModel from './BaseNaviViewModel'

export const createBasicModel = options =>
  new BaseCRUDViewModel(options).create()
export const createFormViewModel = options =>
  new BaseFormViewModel(options).create()
export const createListViewModel = options =>
  new BaseListViewModel(options).create()
export const createNaviViewModel = options =>
  new BaseNaviViewModel(options).create()
export const createListOptionModel = options =>
  new BaseNaviViewModel(options).create()
