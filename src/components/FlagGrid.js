import styled from "styled-components";
import { useMemo, useState } from "react";

const DELAY_TIME = 0.5;
const FLAG_WIDTH = 480;
const FLAG_SCALE = FLAG_WIDTH/320;

const Grid = styled.div`
  transition: 1s;
  transition-delay: ${DELAY_TIME}s;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  margin-bottom: 1rem;
  grid-gap: ${props => props.end ? "0px" : "2px"};
  z-index: ${props => props.end ? 2 : 1};
  width: fit-content;
`;

const TileFront = styled.div`
  width:100%;
  height:100%;
  justify-content: center;
  background: #dddddd;
  backface-visibility: hidden;
  position: absolute;
  top:0;
`;

const TileBack = styled.div`
  transition: 1s;
  transition-delay: ${DELAY_TIME}s;
  width:100%;
  height:100%;
  justify-content: center;
  background: #ffffff;
  backface-visibility: hidden;
  position: absolute;
  transform: rotateY(180deg);
  top:0;
  overflow: hidden;
  @media (prefers-color-scheme: dark) {
    background: #121212;
  }
`;

const Tile = styled.div`
  transition: 1s;
  transform-style: preserve-3d;
  display:flex; 
  justify-content: center;
  padding: ${props => props.height ? `${props.height/2}px` : "2rem"} 2rem;
  position: relative;
  transform: ${props => props.rotate ? "rotateY(180deg)" : "rotateY(0deg)"};
`;

const FlagImage = styled.img`
  content: url(${props => props.flag});
  position: relative;
  width: ${FLAG_WIDTH}px;
  left: ${props => props.left};
  top: ${props => props.top};
`;

export function FlagGrid({ end, countryInfo, flippedArray}) {
  const [flagLoad, setFlagLoad] = useState(false);
  const flagImg = useMemo(() => {
    const img = new Image();
    img.onload = () => setFlagLoad(true);
    img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boris_Johnson_official_portrait.jpg/480px-Boris_Johnson_official_portrait.jpg";
    return img;
  }, [countryInfo]);

  return (
    <Grid end={end ? 1 : undefined}>
      {flippedArray.map((flipped, n) =>
      (
        <Tile key={n} rotate={flipped && flagLoad ? 1 : 0} height={100}>
          <TileFront></TileFront>
          <TileBack><FlagImage
            flag={flagImg.src}
            left={`-${(n % 3) * 64 + 130}px`}
            top={`-${Math.floor(n / 3) * 100}px`}
          >
          </FlagImage></TileBack>
        </Tile>
      ))}
    </Grid>
  );
}