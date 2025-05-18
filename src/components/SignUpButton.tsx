import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SignUpButton = () => {
  const navigate = useNavigate();

  return (
    <StyledWrapper>
      <button
        className="button"
        onClick={() => navigate("/signup")}
        type="button"
      >
        Sign Up
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: ;
    font-family: inherit;
    font-weight: bold;
    color: #354745;
    background-color: #e8f7f6;
    padding: 0.8em 2.2em;
    border-radius: 50em;
    border: 3px solid #62d5d0;
    box-shadow: 0 4px 16px 0 rgba(98, 213, 208, 0.2);
    transition: all 0.15s;
  }
  .button:active {
    position: relative;
    top: 4px;
    border: 3px solid #4db8b3;
    box-shadow: 0 0 0 0 rgba(98, 213, 208, 0.2);
  }
`;

export default SignUpButton;