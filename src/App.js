import './App.css';
import { useState, useMemo, useEffect } from "react";
import styled from 'styled-components';
import AnswerBox from './components/AnswerBox';
import { getDistance, getCompassDirection } from "geolib";
import seedrandom from 'seedrandom';
import { DateTime } from "luxon";
import { useGuesses } from './hooks/useGuesses';
import { ToastContainer, Flip } from "react-toastify";
import { StatsModal } from "./components/StatsModal";
import { HowToModal } from './components/HowToModal';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { FlagGrid } from './components/FlagGrid';
import { Guesses } from './components/Guesses';
import GoogleAds from './components/GoogleAd';
import Button from '@mui/material/Button';
import angleIcon from './angle_favicon.svg';
import flagleIcon from './flagle_favicon.svg';

const CentreWrapper = styled.div`
  margin: 0;
  position: absolute;
  overflow: auto;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column; 

  @media (prefers-color-scheme: dark) {
    background-color: #121212;
}
`;

const Attempts = styled(({ score, attempts, max, ...props }) => (
  <div {...props}>
    Attempts: <span>{attempts}/{max}</span>
  </div>
))`
  display: block;
  font-size: 1.5em;
  margin-bottom: 1rem;
  span {
    font-weight: bold;
  }
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const Footer = styled.div`
  display: block;
  font-size: 1rem;
  margin-top: auto;
  margin-bottom: 0.5rem;
  span {
    color: #1a76d2;
  }
  p {
    margin-bottom: 0;
    margin-top: 0.25rem;
  }
  @media (prefers-color-scheme: dark) {
    color: #fff;
    a {
      color: #fff;
    }
  }
`;

const AdContainer = styled.div`
  width: 100%;
  margin-top: auto;
  margin-bottom: 10px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;

  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const GamesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;

const TitleBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify};
`;

const TitleBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  margin-bottom: 1rem;
  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
`;

const Title = styled.div`
  display: block;
  font-size: 4rem;
  color: black;
  span {
    color: #1a76d2;
  }

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const AngleButton = styled(Button)`
  span {
    font-weight: bold;
  }
`;

const Icon = styled.img`
  width: 20px;
  margin-right: 10px;
`;

const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

const getDayString = () => {
  const date = DateTime.now().toFormat("yyyy-MM-dd");
  return `${date}-${DateTime.now().weekday}`;
};

function App(props) {
  const [cuntNames, setCuntNames] = useState(props.cunts);
  const [score, setScore] = useState("DNF");
  const [flippedArray, setFlippedArray] = useState([false, false, false, false, false, false]);
  const [randomOrder, setRandomOrder] = useState(() => shuffle([0,1,2,3,4,5]));
  const [end, setEnd] = useState(false);
  const dayString = useMemo(getDayString, []);
  const [guesses, addGuess] = useGuesses(dayString);
  const trueCunt = useMemo(() => {
    const todaysCunt = cuntNames[Math.floor(seedrandom.alea(dayString)() * cuntNames.length)];
    return todaysCunt
  }, [dayString, cuntNames]);

  useEffect(() => {
    revealTiles();
    getRemainingTiles();
    if (guesses.length >= props.attempts || guesses[guesses.length - 1]?.name === trueCunt) {
      setEnd(true);
      setFlippedArray([true, true, true, true, true, true]);
      if (guesses[guesses.length - 1].name === trueCunt) {
        toast(`🎉 ${trueCunt} 🎉`);
        setScore(guesses.lenght);
      } else {
        toast(`🤔 ${trueCunt} 🤔`);
        setScore("DNF");
      }
    } 
  }, [guesses]);

  const onIncorrect = () => {
    revealRandomTile();
  };

  const revealRandomTile = () => {
    const [tile] = randomOrder;
    setRandomOrder(randomOrder.length > 1 ? randomOrder.slice(1) : shuffle([0,1,2,3,4,5]));
    const newFlipped = flippedArray.slice();
    newFlipped[tile] = true;
    setFlippedArray(newFlipped);
    return tile;
  };
  
  const getRemainingTiles = () => {
    const remainingTiles = [];
    const usedTiles = guesses.map(guess => guess.tile);
    for (const i of [0,1,2,3,4,5]) {
        if (!usedTiles.includes(i)) {
          remainingTiles.push(i);
        }
      }
    setRandomOrder(shuffle(remainingTiles));
    return remainingTiles;
  };

  const revealTiles = () => {
    const newFlipped = flippedArray.slice();
    for (const guess of guesses) {
      newFlipped[guess.tile] = true;
      setFlippedArray(newFlipped);
    }
  };

  const onGuess = guess => {
    const tileNum = revealRandomTile();
    addGuess({name: guess,
              tile: tileNum,
              correct: guess === trueCunt
            });
  };

  const countryInfo = useMemo(() => props.cunts[trueCunt], [trueCunt]);

  return (
    <div className='App'>
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        autoClose={false}
      />
      <CentreWrapper>
          <Title>C*NT<span>LE</span></Title>
            <StatsModal end={end}
              score={score}
              guesses={guesses}
              maxAttempts={props.attempts}
              dayString={dayString}
              countryInfo={countryInfo}
              trueCountry={trueCunt}
            >
            </StatsModal>
        <FlagGrid
          end={end}
          countryInfo={countryInfo}
          flippedArray={flippedArray}
        >
        </FlagGrid>
        <AnswerBox
          answer={trueCunt}
          onCorrect={() => { }}
          onIncorrect={onIncorrect}
          disabled={end}
          cunts={props.cunts}
          onGuess={onGuess}
        />
        <Attempts score={score} attempts={guesses.length} max={props.attempts} />
        <Guesses
          guesses={guesses}
        />
        <AdContainer>
          <div>Games you may actually enjoy:</div>
          <GamesContainer>
            <AngleButton variant="outlined" onClick={() => {window.open("https://flagle.io")}}><Icon src={flagleIcon}/><div><span>Flagle</span></div></AngleButton>
            <AngleButton variant="outlined" onClick={() => {window.open("https://angle.wtf")}}><Icon src={angleIcon}/><div><span>Angle</span></div></AngleButton>
          </GamesContainer>
        </AdContainer>
      </CentreWrapper>
    </div>
  );
}

export default App;
