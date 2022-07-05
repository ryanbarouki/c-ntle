import styled from 'styled-components';
import { css } from 'styled-components';

const GuessLine = styled.div`
  display: grid;
  grid-template-columns: repeat(8, minmax(30px, 2.5rem));
  margin: 0px 2px 2px 2px;
`;

const AnswerLine = css`
  display:flex; 
  position: relative;
  background-color: #dddddd;
  border-radius: 3px;
  margin-right: 2px;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: center;
  padding: 5px 0px;
  @media (prefers-color-scheme: dark) {
    background-color: #1F2023;
    color: #DADADA
}
`;

const CuntGuess = styled.div`
  ${AnswerLine}
  grid-column: 1 / span 4;
`;

const Link = styled.div`
  ${AnswerLine}
  grid-column: 5 / span 4;
`;

export function Guesses({ guesses }) {
  return (
    guesses.map((guess, index) =>
      (
        <GuessLine key={index}>
          <CuntGuess>{guess.name}</CuntGuess>
          <Link><a href="https://twitter.com/ByDonkeys/status/1533765420427186179?s=20&t=5YLxQZea0R3VHo6ZhG8new">The true Boris Johnson</a></Link>
        </GuessLine>
      ))
  );
}