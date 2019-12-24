import React from 'react';
import { Button } from 'reactstrap';
const Buttont = ({
  buttonname,
  classname,
  onClick,
  btncolor
}) => {

  return (
    <Button 
    color={btncolor}
    onClick={onClick}
    className={classname}
    >
    {buttonname}
    </Button>
    
)};
export default Buttont;
