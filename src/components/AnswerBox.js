import React, { useMemo } from "react";
import Select from 'react-select';
import styled from "styled-components";

const normalise = value => value.toUpperCase();
const StyledSelect = styled(Select)`
  font-family: Courier, monospace;
  margin-bottom: 1rem;
  min-width: 200px;
  color: #000;
  :hover{
    border-color: #123456;
  }
`;

const AnswerBox = ({ answer, onCorrect, onIncorrect, disabled, cunts, onGuess, ...props }) => {
  const handleSubmit = guess => {
      normalise(guess.value) === normalise(answer) ? onCorrect() : onIncorrect();
      onGuess(guess.value);
  };

  const sortedCountries = useMemo(() => cunts.sort().map(val => ({label: val, value: val}))
  ,[cunts]);

  return (
    <StyledSelect
      options={sortedCountries} 
      onChange={handleSubmit}
      placeholder="Guess the c*nt!"
      isOptionDisabled={() => disabled}
      isSearchable={false}
    />
  );
};

export default AnswerBox;