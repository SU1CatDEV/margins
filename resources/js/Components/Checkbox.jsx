import { useState } from "react";

export default function Checkbox({ className = '', label, id="checkbox", checked: propsChecked, onChange: propsOnChange, ...props }) {
    const [internalChecked, setInternalChecked] = useState(propsChecked ? propsChecked : false);
  
  const isControlled = propsChecked !== undefined;
  
  const handleChange = (e) => {
    const newChecked = e.target.checked;
    
    if (isControlled && propsOnChange) {
      propsOnChange(e);
    }
    setInternalChecked(newChecked);
  };
    
    return (
        <div className="prompted-checkbox flex">
            <input id={id} type="checkbox" className="hidden-accessible" checked={internalChecked} onChange={handleChange} {...props}/>
            <label htmlFor={id} className={className}>
                
                <svg width="36" height="26" viewBox="0 0 36 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M34 2L12 24L2 14" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>   
                {label && <p className="-mb-1 ml-10 text-lg">{label}</p>}
                
            </label>
        </div>
        

    );
}
