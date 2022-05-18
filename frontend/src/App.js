import { useState, useEffect } from 'react'
import './App.css'
import { getNewWall, postGuess } from './requests.js'
import Wall from './Wall.js'

const App = () => {
  // Initialise empty wall
  const [wallData, setWallData] = useState({})

  // Fetch new wall on load
  useEffect(() => {
    const fetchWallData = async () => {
      const newWall = await getNewWall()
      setWallData(newWall)
    }
    fetchWallData()
  }, [])

  // Send user's guess to server, and update wall
  const sendGuess = async (guessIds) => {
    const wallId = wallData['wall_id']
    const newWall = await postGuess(wallId, guessIds)
    setWallData(newWall)
  }

  return (
    // <div
    //   className="App"
    //   onClick={() => {
    //     sendGuess([4, 5, 6, 7]); // placeholder guess
    //   }}
    // >
    //   Hi
    // </div>
    wallData?.grid ? <Wall wallData={wallData} sendGuess={sendGuess} /> : null
  )
}

export default App
