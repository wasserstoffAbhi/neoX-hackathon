import React, { useReducer } from "react";
import "../app/globals.css";
import Confetti from "./Coffeti/Coffetti";
import GiftCard from "./GiftCard";

const init_state = {
  move: "move",
  jump: "",
  rotated: "",
  rotating: "",
  drop: "",
  rise: "",
  flipx: ""
};

const box_state = {
  boxRise: "boxRise",
}

export default function GiftBoxAnimation({ref, handleChangeGiftClick, setScore, totalCoinsRef, giftData}: {ref: any, handleChangeGiftClick: () => void, setScore: (score: number) => void, totalCoinsRef: any, giftData: any}) {
  const [state, setState] = useReducer(
    (state: any, new_state: any) => ({
      ...state,
      ...new_state
    }),
    init_state
  );
  const [boxState, setBoxState] = useReducer(
    (state: any, new_state: any) => ({
      ...state,
      ...new_state
    }),
    box_state
  );

  const { move, rotating, rotated, jump, drop, rise, flipx } = state;

  const { boxRise } = boxState;
  function animate() {
    let isDone = rotated === "rotated" ? true : false;

    if (!isDone) {
      setState({ rotating: "rotating" });
      setTimeout(() => {
        setState({ jump: "jump" , drop: "drop", rise: "rise"});
      }, 300);
      setTimeout(() => {
        setState({ rotated: "rotated", flipx: "flipx" });
      }, 1000);
    } else {
      setState(init_state);
    }
    let moving = move === "move" ? "" : "move";
    setState({ move: moving });
  }

  return (
    <div className="App">
      <Confetti open={jump === "jump"} />
      <div className={`img-container` }>
        <GiftCard ref={ref} setScore={setScore} handleChangeGiftClick={handleChangeGiftClick} giftData={giftData?.data} animation={state} giftType={giftData?.type} totalCoinsRef={totalCoinsRef}/>
        <button className={`box ${move} ${drop}`} onClick={() => animate()}>
          <img src={"./box.png"} alt="box" />
        </button>
        <img
          className={`lid ${move} ${rotating} ${rotated} ${drop}`}
          src={"./box-lid.png"}
          alt="box-lid"
        />
      </div>
    </div>
  );
}
