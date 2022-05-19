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
  // Initialise empty wall
  const [wallData, setWallData] = useState({})

  // Intialise countdown timer to 3 minutes
  const [timer, setTimer] = useState(5)

  // Keep track of user's selections for their current guess
  const [selectedIds, setSelectedIds] = useState(new Array(16).fill(0))

  // Keep track of whether or not user has opted to show connections
  const [showConnections, setShowConnections] = useState(false)

  // Fetch new wall
  const fetchWallData = async () => {
    const newWall = await getNewWall()
    setWallData(newWall)
    setSelectedIds(new Array(16).fill(0))
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
  const clearSelected = () => setSelectedIds(new Array(16).fill(0))

  // Send user's guess to server, and update wall
  const sendGuess = async (guessIds) => {
    const wallId = wallData['wall_id']
    const newWall = await postGuess(wallId, guessIds)
    setWallData(newWall)
  }

  // Get solution if user gives up
  const getSolution = async () => {
    const wallId = wallData['wall_id']
    const completedWall = await requestSolution(wallId)
    setWallData(completedWall)
  }

  // Freeze wall if clock reaches three minutes
  const { frozen } = wallData
  const freezeWall = useCallback(async () => {
    console.log('freezing wall')
    const wallId = wallData['wall_id']
    const frozenWall = await requestFreeze(wallId)
    setWallData(frozenWall)
    setTimer(0)
    setSelectedIds(new Array(16).fill(0))
  }, [wallData])

  // Decrement timer once a second until we hit 0
  const wallId = wallData['wall_id']
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 1) {
        setTimer(timer - 1)
      } else if (!frozen) {
        freezeWall()
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timer, frozen, freezeWall])

  // Reset timer on new wall ID
  useEffect(() => {
    setTimer(5)
  }, [wallId])

  console.log(timer)

  return wallData?.grid ? (
    <div className="main-wrapper">
      <Header />
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
