import React from 'react';
import styled from 'styled-components';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange }) => {
  return (
    <StyledWrapper>
      <div className="checkbox-wrapper">
        <input 
          id="terms-checkbox-37" 
          name="checkbox" 
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className="terms-label" htmlFor="terms-checkbox-37">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" className="checkbox-svg">
            <mask fill="white" id="path-1-inside-1_476_5-37">
              <rect height={200} width={200} />
            </mask>
            <rect mask="url(#path-1-inside-1_476_5-37)" strokeWidth={40} className="checkbox-box" height={200} width={200} />
            <path strokeWidth={15} d="M52 111.018L76.9867 136L149 64" className="checkbox-tick" />
          </svg>
          <span className="label-text">Include typing data</span>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .checkbox-wrapper input[type="checkbox"] {
    display: none;
  }

  .checkbox-wrapper .terms-label {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .checkbox-wrapper .terms-label .label-text {
    margin-left: 8px;
    color: #6c6c6c;
    font-size: 12px;
  }

  .checkbox-wrapper .checkbox-svg {
    width: 20px;
    height: 20px;
  }

  .checkbox-wrapper .checkbox-box {
    fill: rgba(207, 205, 205, 0.425);
    stroke: #62d5d0;
    stroke-dasharray: 800;
    stroke-dashoffset: 800;
    transition: stroke-dashoffset 0.6s ease-in;
  }

  .checkbox-wrapper .checkbox-tick {
    stroke: #62d5d0;
    stroke-dasharray: 172;
    stroke-dashoffset: 172;
    transition: stroke-dashoffset 0.6s ease-in;
  }

  .checkbox-wrapper input[type="checkbox"]:checked + .terms-label .checkbox-box,
  .checkbox-wrapper input[type="checkbox"]:checked + .terms-label .checkbox-tick {
    stroke-dashoffset: 0;
  }
`;

export default CustomCheckbox;