import React from 'react';
import { ArrowLeft } from "lucide-react";
import styled from 'styled-components';

interface MedicalHistoryProps {
  formData: {
    height: string;
    weight: string;
    chronicConditions: string;
    medications: string;
    allergies: string;
    familyHistory: string;
    blood_type: string;
    pregnancyStatus: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ formData, handleChange, nextStep, prevStep }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h2 className="form-title">Medical History</h2>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="height">Height (cm)</label>
          <input 
            type="number" 
            id="height"
            name="height" 
            value={formData.height} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input 
            type="number" 
            id="weight"
            name="weight" 
            value={formData.weight} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="blood_type">Blood Group</label>
          <select 
            id="blood_type"
            name="blood_type" 
            value={formData.blood_type} 
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="pregnancyStatus">Pregnancy Status</label>
          <select 
            id="pregnancyStatus"
            name="pregnancyStatus" 
            value={formData.pregnancyStatus} 
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="not-pregnant">Not Pregnant</option>
            <option value="pregnant">Pregnant</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="chronicConditions">Existing Chronic Conditions</label>
          <textarea 
            id="chronicConditions"
            name="chronicConditions" 
            value={formData.chronicConditions} 
            onChange={handleChange} 
            rows={3}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="medications">Current Medications</label>
          <textarea 
            id="medications"
            name="medications" 
            value={formData.medications} 
            onChange={handleChange} 
            rows={3}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="allergies">Known Allergies</label>
          <textarea 
            id="allergies"
            name="allergies" 
            value={formData.allergies} 
            onChange={handleChange} 
            rows={3}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="familyHistory">Family History of Diseases</label>
          <textarea 
            id="familyHistory"
            name="familyHistory" 
            value={formData.familyHistory} 
            onChange={handleChange} 
            rows={3}
          />
        </div>
      </div>

      <div className="form-navigation">
        <button
          type="button"
          onClick={prevStep}
        >
          <ArrowLeft size={16} />
          Previous Step
        </button>
        <button 
          type="submit"
          className="form-submit-btn"
        >
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
    color: #717171;
    font-weight: 600;
    font-size: 12px;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    color: #fff;
    font-family: inherit;
    background-color: transparent;
    border: 1px solid #414141;
  }

  .form-group textarea {
    resize: none;
    height: 80px;
  }

  .form-group input::placeholder {
    opacity: 0.5;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #e81cff;
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
    color: #717171;
    font-weight: 600;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }

  .form-navigation button:hover {
    color: #e81cff;
  }

  .form-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    color: #717171;
    font-weight: 600;
    width: 40%;
    background: #313131;
    border: 1px solid #414141;
    padding: 12px 16px;
    font-size: inherit;
    gap: 8px;
    margin-top: 8px;
    cursor: pointer;
    border-radius: 6px;
  }

  .form-submit-btn:hover {
    background-color: #fff;
    border-color: #fff;
    color: #212121;
  }

  .form-submit-btn:active {
    scale: 0.95;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }
`;

export default MedicalHistory;