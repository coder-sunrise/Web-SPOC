import React, { PureComponent } from 'react'
import ReactPDF, {
  PDFViewer,
  BlobProvider,
  Document,
  Font,
  Page,
  Text,
  Image,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import { CircularProgress } from '@material-ui/core'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import logo from 'assets/img/card-1.jpeg'
import MedisysLogo from 'assets/img/logo/medisys-revised_1.png'
import { data } from './pdfData'

pdfMake.vfs = pdfFonts.pdfMake.vfs

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald',
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Oswald',
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
  },

  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  addresseeContainer: {
    diplay: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'stretch',
    flexWrap: 'nowrap',
    width: '100%',
  },
  addresseeRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'stretch',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    flexGrow: 0,
    flexShrink: 0,
  },
  addresseeCell: {
    flexGrow: 1,
    flexShrink: 1,
  },
  addresseeLabelView: {
    margin: 10,
  },
  addresseeLabel: {
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'Times-Roman',
  },
  leftAlignText: {
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'Times-Roman',
  },
  addressee: {
    fontSize: 12,
  },
  invoiceLabel: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
})

Font.register(
  'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
  { family: 'Oswald' },
)

const MyDoc = () => (
  <Document>
    <Page style={styles.body} size='A4'>
      <View>
        <Image style={styles.image} src={MedisysLogo} />
        <Text style={styles.leftAlignText}>TAX INVOICE</Text>
      </View>
      <View>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
          tincidunt arcu metus, a ultricies velit sodales in. Suspendisse
          fermentum malesuada quam, et lobortis lorem tempus eget. Phasellus
          mattis congue purus, sit amet venenatis enim. am hendrerit bibendum
          libero id tincidunt. Sed consequat laoreet magna id porttitor.
          Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut
          fringilla placerat eleifend.
        </Text>
      </View>
      <Text style={styles.title}>Don Quijote de la Mancha</Text>
      <Text style={styles.author}>Miguel de Cervantes</Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
)

class TestPDF extends PureComponent {
  state = { loading: true, url: '' }

  stopLoading = () => {
    const { handleFinishLoading } = this.props
    handleFinishLoading()
  }

  componentDidMount = () => {
    console.log('test pdf did mount')
    const pdfDoc = pdfMake.createPdf(data)
    pdfDoc.getDataUrl((dataUrl) => {
      this.setState({ url: dataUrl })
    })
  }

  render () {
    const { url } = this.state
    // return (
    //   <BlobProvider document={<MyDoc />}>
    //     {({ blob, url, loading, error }) => {
    //       // Do whatever you need with blob here
    //       console.log('blobprovider', loading)
    //       return loading ? (
    //         <div>loading</div>
    //       ) : (
    //         <iframe
    //           style={{ width: '100%', height: '70vh' }}
    //           src={url}
    //           title='test pdf'
    //         />
    //       )
    //     }}
    //   </BlobProvider>
    // )
    return (
      <iframe
        style={{ width: '100%', height: '70vh' }}
        src={url}
        title='test pdf'
      />
    )
  }
}

export default TestPDF
