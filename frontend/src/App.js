import { useState, useEffect } from 'react'
import './App.css'
import { getNewWall, postGuess, requestSolution } from './requests.js'
import Wall from './Wall.js'
import Footer from './Footer.js'

const App = () => {
  // Initialise empty wall
  const [wallData, setWallData] = useState({})

  // Keep track of user's selections for their current guess
  const [selectedIds, setSelectedIds] = useState(new Array(16).fill(0))

  // Fetch new wall
  const fetchWallData = async () => {
    const newWall = await getNewWall()
    setWallData(newWall)
  }

  // Fetch new wall on first load
  useEffect(() => {
    fetchWallData()
  }, [])

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

  return wallData?.grid ? (
    <div>
      <Wall {...{ wallData, sendGuess, selectedIds, setSelectedIds }} />
      <Footer
        {...{
          clearSelected,
          fetchWallData,
          getSolution,
          wallData,
          selectedIds,
        }}
      />
    </div>
  ) : null
}

export default App
