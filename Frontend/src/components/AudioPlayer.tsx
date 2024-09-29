import ReactHowler from "react-howler";

export default function AudioPlayer({play, mute}: {play: boolean; mute: boolean}) {

  return (
    <div>
      <ReactHowler src={"/music.mp3"} loop playing={play} mute={mute}/>
    </div>
  );
}
