export const data = {
  info: {
    title: 'Purchase Order',
    author: 'medisys innovation',
    subject: 'Report of purchase order details',
    keywords: 'Report, purchase, order, purchase order',
  },
  pagesize: 'A4',
  footer: function (currentPage, pageCount) {
    // return currentPage.toString() + ' of ' + pageCount;
    return {
      columns: [
        {
          text: [
            '* Information is accurate as at time of printing\n',
            'Printed on 18 April 2019 16:57:31 by medisys Innovation\n',
          ],
          margin: [
            25,
            0,
            0,
            0,
          ],
          fontSize: 10,
        },
        {
          text: 'Page ' + currentPage.toString() + ' of ' + pageCount,
          alignment: 'right',
          margin: [
            0,
            0,
            25,
            50,
          ],
          fontSize: 10,
        },
      ],
    }
  },
  content: [
    {
      text: 'Novaptus Surgery Centre Pte Ltd',
      style: 'clinicName',
    },
    {
      text: [
        '1 Orchard Boulevard #04-06, Camden Centre, SG 248649\n',
        '62193626(O),',
        ' 62193626(F)\n\n',
      ],
      style: 'contacts',
    },
    {
      text: '\nPurchase Order\n\n',
      style: 'title',
    },
    {
      columns: [
        {
          width: 60,
          text: 'PO No.',
          bold: true,
        },
        {
          width: '*',
          text: ':\tPO-000001A',
        },
        {
          width: 150,
          text: 'Expected Delivery Date',
          bold: true,
        },
        {
          width: 100,
          text: ':\t20 Feb 2019',
        },
      ],
    },
    {
      columns: [
        {
          width: 60,
          text: 'PO Date',
          bold: true,
        },
        {
          width: '*',
          text: ':\t13 Feb 2019',
        },
      ],
    },
    {
      columns: [
        {
          width: 60,
          text: 'Supplier:',
          bold: true,
        },
        {
          width: '*',
          text: '',
        },
        {
          width: 150,
          text: 'Shipping Address:',
          bold: true,
        },
        { width: 100, text: '' },
      ],
    },
    {
      columns: [
        {
          width: 60,
          text: 'SOMNOTEC',
        },
        {
          width: '*',
          text: '',
        },
        {
          width: 150,
          text: '1 Orchard Boulevard #04-06\nCamden Centre\n REUNION 248649\n',
        },
        { width: 100, text: '' },
      ],
    },
    {
      text: '\n\n\n\nPurchase Order Details',
      style: 'subtitle',
    },
    {
      // table data
      table: {
        headerRows: 1,
        widths: [
          30,
          '*',
          45,
          45,
          45,
          'auto',
          'auto',
          'auto',
        ],
        body: [
          [
            { text: 'CODE', style: 'tableHeader' },
            { text: 'NAME', style: 'tableHeader' },
            {
              text: 'ORDER QTY',
              style: [
                'tableHeader',
                'alignRight',
              ],
            },
            {
              text: 'BONUS QTY',
              style: [
                'tableHeader',
                'alignRight',
              ],
            },
            {
              text: 'TOTAL QTY',
              style: [
                'tableHeader',
                'alignRight',
              ],
            },
            {
              text: 'UOM',
              style: [
                'tableHeader',
              ],
            },
            {
              text: 'UNIT PRICE',
              style: [
                'tableHeader',
                'alignRight',
              ],
            },
            {
              text: 'TOTAL PRICE',
              style: [
                'tableHeader',
                'alignRight',
              ],
            },
          ],

          [
            { text: 'MTM', style: 'tableData' },
            { text: 'MICRO TIP MAKER', style: 'tableData' },
            {
              text: '72.0',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: '',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: '72.0',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: 'UNIT',
              style: [
                'tableData',
              ],
            },
            {
              text: '$7.80',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: '$510.00',
              style: [
                'tableData',
                'alignRight',
              ],
            },
          ],
          [
            { text: 'MTM1', style: 'tableData' },
            { text: 'MICRO TIP MAKER', style: 'tableData' },
            {
              text: '72.0',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: '',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: '72.0',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: 'UNIT',
              style: [
                'tableData',
              ],
            },
            {
              text: '$7.80',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: '$20.00',
              style: [
                'tableData',
                'alignRight',
              ],
            },
          ],
        ],
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return rowIndex === 0 ? '#CCCCCC' : null
        },
        hLineWidth: function (i, node) {
          return i === 0 || i === 1 || i === node.table.body.length ? 1 : 0
        },
        vLineWidth: function (i, node) {
          return 0
        },
      },
    },
    {
      // summary table
      table: {
        headerRows: 0,
        widths: [
          '*',
          55,
        ],
        body: [
          [
            {
              text: 'Sub Total',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: '$510.00',
              style: [
                'tableData',
                'alignRight',
              ],
            },
          ],
          [
            {
              text: 'GST',
              style: [
                'tableData',
                'alignRight',
              ],
            },
            {
              text: '$35.70',
              style: [
                'tableData',
                'alignRight',
              ],
            },
          ],
          [
            {
              text: 'Grand Total',
              style: [
                'tableData',
                'alignRight',
                'boldText',
              ],
            },
            {
              text: '$35.70',
              style: [
                'tableData',
                'alignRight',
              ],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: function (i, node) {
          return i === node.table.body.length ||
          i === node.table.body.length - 1
            ? 1
            : 0
        },
        vLineWidth: function (i, node) {
          return 0
        },
      },
    },
  ],
  defaultStyle: {
    fontSize: 10,
  },
  styles: {
    clinicName: {
      fontSize: 18,
      bold: true,
      alignment: 'left',
    },
    contacts: {
      alignment: 'left',
      lineHeight: 1,
    },
    title: {
      fontSize: 14,
      bold: true,
    },
    subtitle: {
      bold: true,
    },
    header: {
      fontSize: 18,
      bold: true,
      alignment: 'left',
    },
    tableHeader: {
      fontSize: 8,
      bold: true,
    },
    tableData: {
      fontSize: 8,
    },
    alignRight: {
      alignment: 'right',
    },
    boldText: { bold: true },
  },
}

const invoiceData = {
  content: [
    {
      image: '', // base64 image or image assets source
      width: 300,
    },
    {
      text: '\rGST Reg No: 201202578Z',
    },
    {
      table: {
        headerRows: 1,
        widths: [
          '*',
        ],
        body: [
          [
            {
              text: '',
              border: [
                false,
                true,
                false,
                false,
              ],
            },
          ],
        ],
      },
    },
    {
      text: 'Tax Invoice\r\r',
    },
    {
      columns: [
        {
          width: 60,
          text: 'To\t:',
          bold: true,
        },
        {
          width: '*',
          text: 'SASIKALA (S8638380B)',
        },
        {
          width: 100,
          text: 'GST Reg No.',
          bold: true,
        },
        {
          width: 100,
          text: ':\t201202578z',
        },
      ],
    },
    {
      columns: [
        {
          width: 60,
          text: '\t',
        },
        {
          width: '*',
          text: 'BLK 616',
        },
        {
          width: 100,
          text: 'Invoie No.',
          bold: true,
        },
        {
          width: 100,
          text: ':\tIV-000280',
        },
      ],
    },
    {
      columns: [
        {
          width: 60,
          text: '\t',
        },
        {
          width: '*',
          text: 'SENJA ROAD',
        },
        {
          width: 100,
          text: 'Invoie Date.',
          bold: true,
        },
        {
          width: 100,
          text: ':\t30 Apr 2019',
        },
      ],
    },
    {
      columns: [
        {
          width: 60,
          text: '\t',
        },
        {
          width: '*',
          text: '#03-230',
        },
        {
          width: 100,
          text: 'Account No.',
          bold: true,
        },
        {
          width: 100,
          text: ':\tS8638380B',
        },
      ],
    },
    {
      columns: [
        {
          width: 60,
          text: '\t',
        },
        {
          width: '*',
          text: '670616',
        },
        {
          width: 100,
          text: 'Reference No.',
          bold: true,
        },
        {
          width: 100,
          text: ':\tS8638380B',
        },
      ],
    },
    // new line
    {
      text: '\r',
    },

    {
      text: 'Patient:\tSASIKALA (S8638380B)',
    },
    {
      text: 'Doctor:\tCheah',
    },
    // new line
    {
      text: '\r',
    },
    // table
    {
      table: {
        headerRows: 1,
        widths: [
          '*',
          70,
          45,
          100,
        ],
        body: [
          [
            {
              text: 'DESCRIPTION',
              style: 'tableHeader',
            },
            {
              text: 'QTY',
              style: 'tableHeader',
            },
            {
              text: 'TOTAL',
              style: 'tableHeader',
            },
            {
              text: 'TOTAL(S$)',
              style: 'tableHeader',
            },
          ],
          [
            {
              text: 'Doctor Consultation',
            },
            {
              text: '',
            },
            {
              text: '',
            },
            {
              text: '',
            },
          ],
          [
            {
              stack: [
                {
                  text: 'Drug',
                  margin: [
                    5,
                    0,
                    0,
                    0,
                  ],
                },
                {
                  text: 'DePigment cream 5gm',
                  margin: [
                    10,
                    0,
                    0,
                    0,
                  ],
                },
              ],
            },
            {
              stack: [
                '\r',
                '1.0 dose',
              ],
            },
            {
              stack: [
                '\r',
                '5.00',
              ],
            },
            {
              stack: [
                '\r',
                '5.00',
              ],
            },
          ],
          [
            {
              stack: [
                {
                  text: 'Procedure',
                  margin: [
                    5,
                    0,
                    0,
                    0,
                  ],
                },
                {
                  text: 'Acne/Rosacea Lase',
                  margin: [
                    10,
                    0,
                    0,
                    0,
                  ],
                },
              ],
            },
            {
              stack: [
                '\r',
                '1.0',
              ],
            },
            {
              stack: [
                '\r',
                '50.00',
              ],
            },
            {
              stack: [
                '\r',
                '50.00',
              ],
            },
          ],
        ],
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return rowIndex === 0 ? '#CCCCCC' : null
        },
        hLineWidth: function (i, node) {
          return i === 0 || i === 1 ? 1 : 0
        },
        vLineWidth: function (i, node) {
          return 0
        },
      },
    },
    // table
    //summary table
    {
      table: {
        headerRows: 0,
        widths: [
          '*',
          100,
        ],
        body: [
          [
            {
              text: 'Sub Total\t:',
              alignment: 'right',
              border: [
                false,
                false,
                false,
                false,
              ],
            },
            {
              text: '510.00',
              alignment: 'right',
              border: [
                false,
                true,
                false,
                false,
              ],
            },
          ],
          [
            {
              text: 'Add GST 0.7%\t:',
              alignment: 'right',
              border: [
                false,
                false,
                false,
                false,
              ],
            },
            {
              text: '3.85',
              alignment: 'right',
              border: [
                false,
                false,
                false,
                true,
              ],
            },
          ],
          [
            {
              text: 'Grand-Total\t:',
              alignment: 'right',
              border: [
                false,
                false,
                false,
                false,
              ],
            },
            {
              text: '3.85',
              alignment: 'right',
              border: [
                false,
                false,
                false,
                true,
              ],
            },
          ],
          [
            {
              text: 'Outstanding Balance\t:',
              alignment: 'right',
              border: [
                false,
                false,
                false,
                false,
              ],
            },
            {
              text: '3.85',
              alignment: 'right',
              border: [
                false,
                false,
                false,
                true,
              ],
            },
          ],
        ],
      },
    },
    // summary table
    {
      text: '\r',
    },
    {
      text: '\r',
    },
    {
      text: 'All cheques should be crossed and made payabable to:\r\r',
    },
    {
      text: 'Medisys Innovation',
    },
    {
      text:
        'This is a computer generated invoice which does not require a signature',
    },
  ],
  defaultStyle: {
    fontSize: 10,
  },
  styles: {
    tableHeader: {
      fontSize: 8,
      bold: true,
    },
  },
}
