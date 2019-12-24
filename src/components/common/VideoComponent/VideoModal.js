import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'reactstrap';


export const VideoModal = (props) => {
    return(
        <Modal isOpen={props.isOpen} size={"lg"} centered={"true"} toggle={props.toggle} className={props.className}>
          {/* <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody> */}
          {/* <iframe width="100%" height="445" src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe> */}
          {/* http://clips.vorwaerts-gmbh.de/VfE_html5.mp4 */}
          <video width="100%" controls autoPlay="autoplay" loop="loop">
            <source src={props.sourceUrl}  type="video/mp4"/>
         </video>
        </Modal>
    )
}
 
VideoModal.propTypes = {
    sourceUrl: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    className: PropTypes.string
}