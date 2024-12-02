import React, { Fragment } from "react";
import styles from "./cofetti.module.scss";

let count = 200;
let points = [];

function Confetti({ open }: any) {
  let confetti = generatePoints();

  function generatePoints() {
    points = [];

    for (let i = 0; i < count; i++) {
      points.push(<p className={`${open ? styles.animated : ""}`} key={i} />);
    }
    return points;
  }

  return (
    <Fragment>
      <div className={`${styles.confetti} ${open ? styles.animated : ""}`}>
        {confetti.map(c => c)}
      </div>
    </Fragment>
  );
}

export default Confetti;
