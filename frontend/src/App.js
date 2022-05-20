import { useState, useEffect, useCallback } from 'react'
import './App.css'
import {
  getNewWall,
  postGuess,
  requestSolution,
  requestFreeze,
} from './requests.js'
import Wall from './Wall.js'
import Footer from './Footer.js'
import Header from './Header.js'

const App = () => {
  const timeToSolve = 180 // 3 minutes
  const numSquares = 16 // 4x4 grid

  // Initialise empty wall
  const [wallData, setWallData] = useState({})
  const { frozen, complete, lives } = wallData
  const wallId = wallData['wall_id']

  // Intialise countdown timer to 3 minutes
  const [timer, setTimer] = useState(timeToSolve)

  // Keep track of user's selections for their current guess
  const [selectedIds, setSelectedIds] = useState(new Array(numSquares).fill(0))

  // Keep track of whether or not user has opted to show connections
  const [showConnections, setShowConnections] = useState(false)

  // Fetch new wall
  const fetchWallData = async () => {
    const newWall = await getNewWall()
    setWallData(newWall)
    setSelectedIds(new Array(numSquares).fill(0))
    setShowConnections(false)
  }

  // Fetch new wall on first load
  useEffect(() => {
    fetchWallData()
  }, [])

  // Switch between showing connections or not
  const toggleConnections = () => {
    setShowConnections(!showConnections)
  }

  // Unselect all when user hits relevant button
  const clearSelected = () => setSelectedIds(new Array(numSquares).fill(0))

  // Send user's guess to server, and update wall
  const sendGuess = async (guessIds) => {
    const newWall = await postGuess(wallId, guessIds)
    setWallData(newWall)
    setSelectedIds(new Array(numSquares).fill(0))
  }

  // Get solution if user gives up
  const getSolution = async () => {
    const wallId = wallData['wall_id']
    const completedWall = await requestSolution(wallId)
    setWallData(completedWall)
  }

  // Freeze wall if clock reaches three minutes
  const freezeWall = useCallback(async () => {
    const frozenWall = await requestFreeze(wallId)
    setWallData(frozenWall)
    setTimer(0)
    setSelectedIds(new Array(numSquares).fill(0))
  }, [wallId])

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
