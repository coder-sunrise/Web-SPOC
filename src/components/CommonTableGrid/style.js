import { hoverColor, tableEvenRowColor } from 'mui-pro-jss'
import { infoColor } from 'assets/jss'
import color from 'color'

// console.log(colorManipulator)
const styles = (theme) => ({
  tableCursorPointer: {
    cursor: 'default',
  },

  tableStriped: {
    '& > tbody > tr:nth-of-type(odd):not(.group), & > thead > tr:not(.group)': {
      // backgroundColor: colorManipulator.fade(
      //   theme.palette.secondary.main,
      //   0.01,
      // ),
      backgroundColor: '#ffffff',
    },
    '& > tbody > tr:nth-of-type(even):not(.group)': {
      backgroundColor: tableEvenRowColor,
    },
    // '& > tbody > tr.group': {
    //   backgroundColor: color(tableEvenRowColor).lighten(0.5).hex(),
    // },
    '& > tbody > tr:not(.group):hover': {
      // backgroundColor: colorManipulator.fade(
      //   theme.palette.secondary.main,
      //   0.05,
      // ),
      backgroundColor: hoverColor,
    },

    '& > tbody > tr.grid-edit-row': {
      backgroundColor: '#ffffff',
    },

    '& > tbody > tr.grid-edit-row:hover': {
      backgroundColor: '#ffffff',
    },
  },
  paperContainer: {
    // margin: '0 5px',
    '& > div': {
      width: '100%',
    },
  },

  cleanFormat: {
    fontSize: 'inherit',
  },

  dragCellContainer: {
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    '& > span': {
      cursor: 'move',
    },
  },
  sortableContainer: {
    zIndex: 10000,
    '& > *': {
      // backgroundColor:'black',
      width: '100%',
      '& > *': {
        minWidth: 200,
      },
    },
  },
  settingBtn: {
    color: infoColor,
    '&:hover': {
      color: color(infoColor).darken(0.2).hex(),
    },
  },

  sortIcon: {
    visibility: 'hidden',
    verticalAlign: 'middle',
    '& svg': {
      verticalAlign: 'middle',
    }
  },

  sortLabel: {
    '& span': {
      display: 'inline',
    },
    '&:hover $sortIcon': {
      visibility: 'visible',
    },
  },
})

export default styles
