import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import  styles from "./video.less";

export const VideoComponent = (props) => {
    return(
        <Col lg={"3"} >
            <Col lg={"12"} className={styles.helpCard}>
                <Row>
                <Col lg={"12"} >
                <span className={styles.playBtn} onClick={() =>  { props.handlePopup(props.sourceUrl) }} srcUrl={props.sourceUrl} ><i className="fas fa-play"></i></span>
                <img className={styles.playImg} src={props.bannerImage} alt="TNlogo" />                  
            </Col>
            <Col lg={"12"} style={{textAlign: "center"}}>
                <h6 style={{color: "gray",marginTop: "10px"}}>VIDEO</h6>
                <p className={styles.des}>{props.title}</p>
            </Col>
                </Row>
            </Col>
        </Col>
    )
}

VideoComponent.propTypes = {
    bannerImage: PropTypes.string.isRequired,
    sourceUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    handlePopup: PropTypes.string.isRequired
}   