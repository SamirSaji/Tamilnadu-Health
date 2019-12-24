import React from "react";
import Select from "react-select";
import CheckboxStyle from "../../../Data/DSUEntry/stylesheets/DSUEntry.less";

const SelectList = (props, ref) => {
  let {
    className,
    label,
    options,
    Disabled,
    showLabel = false,
    star,
    defaultValue,
    applyErrorClass,
    showDummy=true
  } = props;

  return (
    <div>
      {(showLabel || showDummy) ? (
        <div>
          <label dangerouslySetInnerHTML={{ __html: label }} />
          <span style={{ fontWeight: "950", color: "red" }}>{star}</span>
        </div>
      ) : ''}
      <Select
        {...props}
        ref={ref}
        className={`${className} ${
          applyErrorClass === true ? CheckboxStyle.giveerroBorder : ""
        }`}
        style={{ height: "0px" }}
        options={options}
        isDisabled={Disabled}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default React.forwardRef(SelectList);