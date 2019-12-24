import React from 'react';
    const SelectBox = ({
      onChange,
      value,
      label,
      options,
      placeholder,
      classname,
      star
    }) => {
        return (
          <div className="form-group">
            {label && <label dangerouslySetInnerHTML={{__html:label}}></label>}<span style={{ "fontWeight" : "950" , "color" : "red" }}>{star}</span>
    
            <select  
             value={value}
             onChange={onChange} 
             className={"form-control "+classname}>
             <option disabled  hidden>{placeholder}</option>
             {options.map(option => {
              return <option value={option} key={option} >{option}</option>
            })}
          </select>
          <span className={styles}>
           {errors.patientDetails && errors.patientDetails.gender}
          </span>
          </div>
          
        )
      }
export default SelectBox;

