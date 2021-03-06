import axios from 'axios'

let baseUrl
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:5000/api'
} else {
  baseUrl = '/api'
}

export const getNewWall = async () => {
  const response = await axios.get(`${baseUrl}/get_new_wall`)
  try {
    return response.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const postGuess = async (wallId, guessIds) => {
  const response = await axios.post(`${baseUrl}/guess`, { wallId, guessIds })
  try {
    return response.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const requestSolution = async (wallId) => {
  const response = await axios.post(`${baseUrl}/solution`, { wallId })
  try {
    return response.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const requestFreeze = async (wallId) => {
  const response = await axios.post(`${baseUrl}/freeze`, { wallId })
  try {
    return response.data
  } catch (error) {
    console.log(error)
    return {}
  }
}
