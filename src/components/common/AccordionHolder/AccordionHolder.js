import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Collapse } from 'reactstrap';

import styles from './accordionholder.less';

export const AccordionHolder = (props) => {

    let { hidden } = props;

    return (
        <div
            hidden={hidden}
        >
            <div
                className={styles.collapseTatile}
                onClick={() => {
                    this.toggle('collapse2', collapse2);
                }}
            >
                <Row>
                    <Col xs="10" md="11" sm="11">
                        <h6>
                            Residential Address Information{' '}
                        </h6>
                    </Col>
                    <Col xs="2" md="1" sm="1" className={styles.closeicon}>
                        <i
                            style={{
                                display: collapse2 === false ? 'block' : 'none',
                            }}
                            className={'fa fa-plus ' + styles.plus}
                        />
                        <i
                            style={{
                                display: collapse2 === true ? 'block' : 'none',
                            }}
                            className={'fa fa-times ' + styles.close}
                        />
                    </Col>
                </Row>
            </div>
            {/* start Residential Address */}
            <Collapse isOpen={collapse2}>
                <Card>
                    <CardBody>
                        {this.props.children}
                    </CardBody>
                </Card>
            </Collapse>
        </div>
    )
}

AccordionHolder.propTypes = {
    hidden: PropTypes.bool.isRequired,

}