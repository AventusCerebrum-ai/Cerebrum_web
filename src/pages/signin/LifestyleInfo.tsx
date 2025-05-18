import React from "react";
import { ArrowLeft } from "lucide-react";
import styled from "styled-components";

interface LifestyleInfoProps {
  formData: {
    smokingStatus: string;
    alcoholConsumption: string;
    physicalActivity: string;
    sleepHours: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const LifestyleInfo: React.FC<LifestyleInfoProps> = ({
  formData,
  handleChange,
  nextStep,
  prevStep,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h2 className="form-title">Lifestyle Information</h2>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="smokingStatus">Smoking Status</label>
          <select
            id="smokingStatus"
            name="smokingStatus"
            value={formData.smokingStatus}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="never">Never Smoked</option>
            <option value="former">Former Smoker</option>
            <option value="current">Current Smoker</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="alcoholConsumption">Alcohol Consumption</label>
          <select
            id="alcoholConsumption"
            name="alcoholConsumption"
            value={formData.alcoholConsumption}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="never">Never</option>
            <option value="occasional">Occasional</option>
            <option value="moderate">Moderate</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="physicalActivity">Physical Activity Level</label>
          <select
            id="physicalActivity"
            name="physicalActivity"
            value={formData.physicalActivity}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sleepHours">Average Sleep Hours</label>
          <input
            type="number"
            id="sleepHours"
            name="sleepHours"
            value={formData.sleepHours}
            onChange={handleChange}
            placeholder="7"
            min="0"
            max="24"
          />
        </div>
      </div>

      <div className="form-navigation">
        <button type="button" onClick={prevStep}>
          <ArrowLeft size={16} />
          Previous Step
        </button>
        <button type="submit" className="form-submit-btn">
          Next Step
        </button>
      </div>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  .form-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    text-align: center;
    background: linear-gradient(90deg, #354745 0%, #62d5d0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #354745;
    font-weight: 600;
    font-size: 12px;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    color: #354745;
    font-family: inherit;
    background-color: #e8f7f6;
    border: 1px solid #62d5d0;
  }

  .form-group input::placeholder {
    color: #354745;
    opacity: 0.5;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #62d5d0;
    box-shadow: 0 0 0 2px rgba(98, 213, 208, 0.1);
  }

  .form-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .form-navigation button {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #354745;
    font-weight: 600;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }

  .form-navigation button:hover {
    color: #62d5d0;
  }

  .form-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    color: white;
    font-weight: 600;
    width: 40%;
    background: #62d5d0;
    border: none;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .form-submit-btn:hover {
    background: #4db8b3;
  }

  .form-submit-btn:active {
    scale: 0.95;
  }
`;

export default LifestyleInfo;