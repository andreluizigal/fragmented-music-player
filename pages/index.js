import { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'



/* Instrument */
function Instrument({ instrument, enabledInstruments, handleChangeEnable }) {

  function handleEnableClick() {
    const newEnabledInstruments = enabledInstruments.map(i => i[0] === instrument.id ? [i[0], !(i[1])] : [i[0], i[1]])
    handleChangeEnable(newEnabledInstruments);
    const audio = document.getElementById(instrument.id);
    newEnabledInstruments[instrument.id][1] ? audio.volume = 1 : audio.volume = 0;
  }

  return (
      <>
          <h3>{instrument.name}</h3>
          <button style={enabledInstruments[instrument.id][1] ? {backgroundColor: "#E62964"} : {backgroundColor: "#192129", color: "grey"}} onClick={handleEnableClick}>{enabledInstruments[instrument.id][1] ? "Enabled" : "Disabled"}</button>
          <audio loop id={instrument.id} src={instrument.url} type="audio/mpeg" preload="auto"></audio>
      </>
  );
}

/* Player */
export default function Player() {
  const musics = require('../public/musics/musics_data.json');
  const [index, setIndex] = useState(0);
  const [enabledInstruments, setEnabledInstruments] = useState(musics[0].instruments.map(i => [i.id, true]))
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(241);
  const [currentTime, setCurrentTime] = useState(0);

  function handleChangeEnable(newEnabledInstruments) {
    setEnabledInstruments(newEnabledInstruments)

  }

  function setMusicCurrentTime() {
    const audio = document.getElementById(musics[index].instruments[0].id)
    setCurrentTime(audio.currentTime);
  }

  function setMusicDuration() {
    const audio = document.getElementById(musics[index].instruments[0].id)
    setDuration(Math.floor(audio.duration))
  }

  function updateSliderValue() {
    const audio = document.getElementById(musics[index].instruments[0].id)
    const slider = document.getElementById("musicRange")
    slider.value = audio.currentTime;
    setMusicCurrentTime();
    setMusicDuration();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateSliderValue();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  function restAll(next) {
    next ? setEnabledInstruments(musics[index + 1].instruments.map(i => [i.id, true])) : setEnabledInstruments(musics[index - 1].instruments.map(i => [i.id, true]));
    setPlaying(false);
    
  }

  function handlePreviousClick() {
    restAll(false);
    setIndex(index - 1);
  }

  function handleNextClick() {
    restAll(true);
    setIndex(index + 1);
  }

  function handlePlayClick() {
    const disabledInstruments = enabledInstruments.filter(i => i[1] === false);
    const disabledInstrumentsIds = disabledInstruments.map(i => i[0]);
    
    
    if(!playing) {
      musics[index].instruments.forEach(i => {
        const audio = document.getElementById(i.id)
        audio.play();
        disabledInstrumentsIds.includes(i.id) ? audio.volume = 0 : audio.volume = 1
      });
      setPlaying(true);
    } 
    else {
      musics[index].instruments.forEach(i => {
      const audio = document.getElementById(i.id)
      audio.pause();});
      setPlaying(false);
    }

  }

  function handleResetClick() {
    musics[index].instruments.forEach(i => {
      const audio = document.getElementById(i.id)
      audio.currentTime = 0;
    });
  }

  function handleTimeChange() {
    const time = document.getElementById("musicRange").value;
    musics[index].instruments.forEach(i => {
      const audio = document.getElementById(i.id)
      audio.currentTime = time;
    });
    setMusicCurrentTime();
  }

  /* RETURN */
  return (
  <main className={styles.pageBody}>
    <Head>
      <meta charSet="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Fragmented Music Player</title>
      <meta name="description" content="a music player capable of playing each music track separately or in a specific combination"/>

      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"/>
    </Head>

    <div className={styles.playerBox}>
      <header>
        <h1><span>Fragmented</span> Music Player</h1>
      </header>
      <div>
        <ul>
          {musics[index].instruments.map((i) => (
            <li key={i.name}><Instrument instrument={i} enabledInstruments={enabledInstruments} handleChangeEnable={handleChangeEnable}/></li>
          ))}
        </ul>
      </div>
      
      <div className={styles.musicInfo}>
        <p>Music {index + 1} of {musics.length}</p>
        <h2>{musics[index].name}</h2>
        <p>{musics[index].artist}</p>
        
        <input type="range" min="0" max={duration} id="musicRange" onChange={handleTimeChange}/>
        <p>{Math.floor(currentTime/60)}:{Math.ceil((currentTime/60 - Math.floor(currentTime/60)) * 60).toString().padStart(2, '0')} / {Math.floor(duration/60)}:{Math.ceil((duration/60 - Math.floor(duration/60)) * 60).toString().padStart(2, '0')}</p>
        <button onClick={handlePreviousClick} disabled={!(index > 0)}>&laquo;</button>
        <button onClick={handleResetClick}><b>&#10227;</b></button>
        <button onClick={handlePlayClick}>{playing ? "||" : "\u25b6"}</button>
        <button onClick={handleNextClick} disabled={!(index + 1 < musics.length)}>&raquo;</button>
        
      </div>
    </div>

    <footer className={styles.footer}>
      <p>Developed by <a target="_blank" href="https://github.com/andreluizigal">andreluizigal</a></p>
    </footer>
  </main>
  );


}