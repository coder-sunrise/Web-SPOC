import memoizeOne from 'memoize-one'
import isEqual from 'lodash/isEqual'
import { formatMessage } from 'umi/locale'
import update from 'immutability-helper'
import Authorized from '@/utils/Authorized'
import { CLINIC_SPECIALIST } from '@/utils/constants'

const { check } = Authorized

// Conversion router to menu.
function formatter (data, parentAuthority, parentName) {
  return data
    .map((item) => {
      if (!item.name || !item.path) {
        return null
      }

      let locale = 'menu'
      if (parentName) {
        locale = `${parentName}.${item.name}`
      } else {
        locale = `menu.${item.name}`
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      }
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale)
        // Reduce memory usage
        result.children = children
      }
      delete result.routes
      return result
    })
    .filter((item) => item)
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual)

/**
 * get SubMenu or Item
 */
const getSubMenu = (item) => {
  // doc: add hideChildrenInMenu
  if (
    item.children &&
    !item.hideChildrenInMenu &&
    item.children.some((child) => child.name)
  ) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    }
  }
  return item
}

/**
 * filter menuData
 */
const filterMenuData = (menuData) => {
  if (!menuData) {
    return []
  }
  const filtered = menuData
    .filter((item) => item.name) // && !item.hideInMenu)
    .map((item) => {
      // make dom
      // console.log(item)
      const ItemDom = getSubMenu(item)

      const data = check(item.authority, ItemDom)
      return data
    })
    .filter((item) => item)
  // console.log(filtered)
  return filtered
}

const filterBySpecialist = (specialist = 'GP', menus) => {
  return menus.filter(
    (menu) => menu.specialist && menu.specialist.includes(specialist),
  )
}

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    breadcrumb: {},
  },

  effects: {
    *getMenuData ({ payload }, { put, select }) {
      const { routes, authority } = payload
      const clinicInfo = yield select((st) => st.clinicInfo)
      const { clinicSpecialist = CLINIC_SPECIALIST.DENTAL } = clinicInfo
      const menus = filterMenuData(memoizeOneFormatter(routes, authority))
      // const clinicMenus = filterBySpecialist(clinicSpecialist, menus)

      yield put({
        type: 'save',
        payload: menus,
      })
      return menus
    },
  },

  reducers: {
    updateBreadcrumb (state, action) {
      const { breadcrumb } = state
      breadcrumb[action.payload.href] = action.payload.name
      sessionStorage.setItem(action.payload.href, action.payload.name)
      return {
        ...state,
        breadcrumb,
      }
    },
    save (state, action) {
      return {
        ...state,
        menuData: action.payload,
      }
    },
  },
}
