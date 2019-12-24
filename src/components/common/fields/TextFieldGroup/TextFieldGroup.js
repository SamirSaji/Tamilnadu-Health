import React from 'react';
import { FormGroup, Input, Col, InputGroup } from "reactstrap";
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './stylesheets/TextFieldGroup.less';
const TextFieldGroup = (props) => {

  let {
    isValid, label, error, innerRef, info, classname, span, star, disabled, errorvalid
  } = props;
  return (<FormGroup style={{ marginBottom: "0" }}>
    {label && <label dangerouslySetInnerHTML={{ __html: label }}></label>}<span style={{ "fontWeight": "950", "color": "red" }}>{star}</span>
    <Input
      innerRef={innerRef}
      // value = {value ? value : ""}
      {...props}
      disabled={disabled}
      // className={"fo rm-control "+ }
      className={classnames('form-control ' + classname, {
        [errorvalid]: error,
        [isValid === true ? styles.giveCorrectColor : 1 + 1]: isValid
      })}
    /><span>{span}</span>
    {info && <small className={"form-text text-muted"}>{info}</small>}
    {error && <div className={"invalid-feedback"} style={{
      "color": "rgb(212, 0, 0)",
      "fontSize": "12px",
      "height": "25px"
    }}>{error}</div>}
  </FormGroup>)
};

const ATextFieldGroup = (props) => {

  let { error = null, disable, disabled, label, ...rest } = props;

  return (
    <React.Fragment>
      {props.label ? (
        <label>
          {props.label}
          {props.required ? <span>*</span> : ''}
        </label>
      ) : ''}
      <Input className={`${styles.inputControl} ${error ? styles.inputError : ''}`} {...rest} disabled={(disabled | disable)} />
      {/* {(error||info) ? <p className={styles.errorMsg} >{`${error ? error : ''} ${info ? info : ''}`}</p> : ''} */}
    </React.Fragment>
  )

}


const InputGroupWrap = (props) => {

  let { label, disabled, disable, unit = null, colStyle, ...rest } = props;


  return (
    <Col {...colStyle} >
      {unit ?
        (
          <InputGroup>
            <span class="input-group-addon" id="basic-addon2">{label}</span>
            <ATextFieldGroup {...rest} />
            <span class="input-group-addon" id="basic-addon2">{unit}</span>
          </InputGroup>
        ) : (
          <React.Fragment>
            <FormGroup disabled={disabled || disable} className={styles.inputFormGroup} ></FormGroup>
            <ATextFieldGroup {...props} />
          </React.Fragment>
        )}
      {(props.error || props.info) ? <p className={styles.errorMsg}>{`${props.error ? props.error : ''} ${props.info ? props.info : ''}`}</p> : ''}
    </Col>
  )
  // if (unit) {

  //   return (<Col {...colStyle} >
  //     <InputGroup>
  //       <span class="input-group-addon" id="basic-addon2">{label}</span>
  //       <ATextFieldGroup {...rest} />
  //       <span class="input-group-addon" id="basic-addon2">{unit}</span>
  //     </InputGroup>
  //     {(error || info) ? <p className={styles.errorMsg}>{`${error ? error : ''} ${info ? info : ''}`}</p> : ''}
  //   </Col>)
  // } else {

  //   return (
  //     <Col {...colStyle} >
  //       <FormGroup disabled={disabled || disable} className={styles.inputFormGroup} ></FormGroup>
  //       <ATextFieldGroup {...props} error={error} info={info} />
  //     </Col>)
  // }

}

InputGroupWrap.propTypes = {
  error: PropTypes.string,
  unit: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string,
  colStyle: PropTypes.shape({
    lg: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    xs: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    sm: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    className: PropTypes.string
  }),
  groupWrap: PropTypes.oneOf(['prepend', 'append'])
}


export default React.forwardRef((props, ref) => (<TextFieldGroup {...props} innerRef={ref} />));
