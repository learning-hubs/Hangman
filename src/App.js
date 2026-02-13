import { useState } from 'react';
import { clsx } from 'clsx';
import './App.css';
import { languages } from './languages';
import { getFarewellText } from './farewell';

/**
 * Backlog:
 * 
 * - Farewell messages in status section
 * - Fix a11y issues
 * - Make the new game button work
 * - Choose a random word from a list of words
 * - Confetti drop when the user wins
 */

function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState('react');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length;
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  console.log('guessedLetters: ', guessedLetters);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter);
  console.log('isLastGuessIncorrect ', isLastGuessIncorrect);

  function addGuessedLetter(letter) {
    // setGuessedLetters(prevLetters =>
    //   prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter])
    setGuessedLetters(prevLetters => {
      const lettersSet = new Set(prevLetters);
      lettersSet.add(letter);
      return Array.from(lettersSet);
    });
  }

  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount  
    const styles = {
        backgroundColor: lang.backgroundColor,
        color: lang.color
      }
    const className = clsx("chip", isLanguageLost && "lost")
      return <span
          className={className}
          // className={`chip ${isLanguageLost ? "lost" : ""}`}
          style={ styles }
          key={lang.name}
        >{lang.name}</span>
  });

  const letterElements = currentWord.split("").map((letter, index) => (
    <span key={index}>{guessedLetters.includes(letter) ? letter.toUpperCase() : ""}</span>
  ));

  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button
        className={className}
        key="letter"
        onClick={() => addGuessedLetter(letter)}
        disabled={isGameOver}
      >
          {letter.toUpperCase()}
      </button>
    )})

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
          <p className='farewell-message'>
              {getFarewellText(languages[wrongGuessCount - 1].name)}
          </p>
      )
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    } 
    if (isGameLost) {
      return <>
        <h2>Game Over!</h2>
        <p>You lose! Better start learning Assembly  😭</p>
      </>
    }
    return null;
  }

  return (
    <main>
        <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>
        </header>

        <section className={gameStatusClass}>
          {/* {isGameOver ? isGameWon ? (
            <>
              <h2>You win!</h2>
              <p>Well done! 🎉</p>
            </>
          ) : (
            <>
              <h2>Game Over!</h2>
              <p>You lose! Better start learning Assembly  😭</p>
            </>
          ) : null} */}
          {renderGameStatus()}
        </section>

        <section className='language-chips'>
          {languageElements}
        </section>

        <section className='word'>
          {letterElements}
        </section>

        <section className='keyboard'>
          {keyboardElements}
        </section>
        {isGameOver && <button className='new-game'>New Game</button>}
    </main>
  );
}

export default AssemblyEndgame;
