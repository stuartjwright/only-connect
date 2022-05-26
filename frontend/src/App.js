import { useState, useEffect, useCallback, useReducer } from 'react'
import './styles/App.css'
import Wall from './Wall.js'
import Footer from './Footer.js'
import Header from './Header.js'
import { gameStateReducer, initialGameState } from './gameState'
import { timeToSolve, numSquares } from './constants'

const App = () => {
  // All game state handled in game state reducer
  const [wallData, dispatch] = useReducer(gameStateReducer, initialGameState)
  const { frozen, complete, lives, wallId } = wallData

  // Keep track of user's selections for their current guess
  const [selectedIds, setSelectedIds] = useState(new Array(numSquares).fill(0))

  // Keep track of whether or not user has opted to show connections
  const [showConnections, setShowConnections] = useState(false)

  // Intialise countdown timer to 3 minutes
  const [timer, setTimer] = useState(timeToSolve)

  // Switch between showing connections or not
  const toggleConnections = () => {
    setShowConnections(!showConnections)
  }

  // Unselect all when user hits relevant button
  const clearSelected = () => setSelectedIds(new Array(numSquares).fill(0))

  // Fetch new wall
  const fetchWallData = () => {
    dispatch({ type: 'new', payload: wallId })
    clearSelected()
    setShowConnections(false)
  }

  // Send user's guess to be processed, and update wall
  const sendGuess = (guessIds) => {
    dispatch({ type: 'guess', payload: guessIds })
    clearSelected()
  }

  // Get solution if user gives up
  const getSolution = () => {
    dispatch({ type: 'complete' })
  }

  // Freeze wall if clock reaches three minutes
  const freezeWall = useCallback(() => {
    dispatch({ type: 'freeze' })
    setTimer(0)
    clearSelected()
  }, [])

  // Decrement timer once a second until we hit 0
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 1 && !complete && !frozen) {
        setTimer(timer - 1)
      } else if (complete) {
        clearInterval(interval)
      } else if (timer === 1 && !frozen) {
        freezeWall()
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timer, frozen, freezeWall, complete])

  // Reset timer on new wall ID
  useEffect(() => {
    setTimer(timeToSolve)
  }, [wallId])

  return wallData?.grid ? (
    <div className="main-wrapper">
      <Header {...{ timer, frozen, lives }} />
      <Wall
        {...{
          wallData,
          sendGuess,
          selectedIds,
          setSelectedIds,
          showConnections,
        }}
      />
      <Footer
        {...{
          clearSelected,
          fetchWallData,
          getSolution,
          wallData,
          selectedIds,
          toggleConnections,
        }}
      />
    </div>
  ) : null
}

export default App
