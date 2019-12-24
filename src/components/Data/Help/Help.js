import React from 'react';
import Header from '../../common/Header/Header';
import { Container, Row, Col } from 'reactstrap';
import { VideoComponent } from '../../common/VideoComponent/VideoComponent';
import { VideoModal } from '../../common/VideoComponent/VideoModal';

export class Help extends React.Component {
  constructor(props) {
    super(props);
    this.handlePopup = this.handlePopup.bind(this);
    this.state = {
      isOpen: false,
      sourceUrl: ''
    };
  }

  videoList = [
    { sourceUrl: 'http://techslides.com/demos/sample-videos/small.mp4', bannerImage: require('./logosmall.png'), title: "Hello World" },
    { sourceUrl: 'http://techslides.com/demos/sample-videos/small.mp4', bannerImage: require('./logosmall.png'), title: "Hello World" },
    { sourceUrl: 'http://techslides.com/demos/sample-videos/small.mp4', bannerImage: require('./logosmall.png'), title: "Hello World" },
    { sourceUrl: 'http://techslides.com/demos/sample-videos/small.mp4', bannerImage: require('./logosmall.png'), title: "Hello World" },
    { sourceUrl: 'http://techslides.com/demos/sample-videos/small.mp4', bannerImage: require('./logosmall.png'), title: "Hello World" },
    { sourceUrl: 'http://techslides.com/demos/sample-videos/small.mp4', bannerImage: require('./logosmall.png'), title: "Hello World" },
    { sourceUrl: 'http://techslides.com/demos/sample-videos/small.mp4', bannerImage: require('./logosmall.png'), title: "Hello World" },
  ]

  handlePopup = (sourceUrl) => {
    this.setState({ sourceUrl, isOpen: !this.state.isOpen })
  }

  render() {
    return (
      <div>
        <Header />
        <VideoModal sourceUrl={this.state.sourceUrl} isOpen={this.state.isOpen} toggle={this.handlePopup} />
        <div>
          <Container>
            <Row>
              <Col lg={"12"} xs={"12"} style={{ marginTop: "50px" }}>
                <h4 style={{ marginBottom: "20px" }}>VIDEO</h4>
                <Row>
                  {this.videoList.map(video => <VideoComponent {...video} handlePopup={this.handlePopup} />)}
                </Row>
              </Col>
            </Row>
            {/* <Modal isOpen={this.state.modal} size={"lg"} centered={"true"} toggle={this.toggle} className={this.props.className}>
              <video width="100%" controls autoPlay="autoplay" loop="loop">
                <source src={this.state.video} type="video/mp4" />
              </video>
            </Modal> */}
          </Container>
        </div>
      </div>
    );
  }
}