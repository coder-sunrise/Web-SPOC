import React from 'react'
import Slider from 'react-slick'
import { withStyles } from '@material-ui/core'

const styles = () => ({
  slider: {
    height: '90vh',
  },
})
const Carousel = ({ images = [], currentImageIndex, setCurrentImageIndex }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true,
    autoplay: true,
    fade: true,
    initialSlide: currentImageIndex,
    afterChange: (current) => setCurrentImageIndex(current),
  }
  return (
    <Slider {...settings}>
      {images.map((image, idx) => (
        <div key={idx}>
          <img
            style={{
              height: '90vh',
              width: '100%',
            }}
            alt='carousel'
            src={image}
          />
        </div>
      ))}
    </Slider>
  )
}

export default withStyles(styles)(Carousel)
