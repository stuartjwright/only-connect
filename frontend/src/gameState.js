import data from './data.json'
import { arraysEqual } from './utils'
import { rowSize } from './constants'

const walls = data.map((w, i) => {
  return { ...w, groups: Object.values(w.groups), wallId: i }
})

const getRandomWall = (wallId = -1) => {
  return walls.filter((w) => w.wallId !== wallId)[
    [Math.floor(Math.random() * (walls.length - 1))]
  ]
}

const guess = (state, guess) => {
  if (state.complete) {
    return state
  }

  const { groups, solved } = state
  const sortedGuess = guess.sort()
  let isCorrect = false
  let correctGroupId = null
  groups.forEach((group, i) => {
    const sortedGroup = group.sort()
    if (!isCorrect && arraysEqual(sortedGuess, sortedGroup)) {
      isCorrect = true
      correctGroupId = i
    }
  })

  let newState = state
  if (isCorrect) {
    newState = updateGrid(state, correctGroupId)
  } else if (solved.length === rowSize - 2) {
    newState = { ...newState, lives: newState.lives - 1 }
    if (newState.lives <= 0) {
      newState = freeze(newState)
    }
  }

  return newState
}

const updateGrid = (state, groupId) => {
  const { grid, solved } = state
  const alreadySolved = grid.filter((row) => solved.includes(row.group))
  const newlySolved = grid.filter((row) => row.group === groupId)
  const unsolved = grid.filter(
    (row) => row.group !== groupId && !solved.includes(row.group)
  )

  const newGrid = [...alreadySolved, ...newlySolved, ...unsolved]
  const newSolved = [...new Set([...solved, groupId])]

  let newState = { ...state, grid: newGrid, solved: newSolved }

  if (newSolved.length === rowSize - 1) {
    const lastGroupId = [...Array(rowSize).keys()].filter(
      (i) => !newSolved.includes(i)
    )[0]
    newState = updateGrid(newState, lastGroupId)
  } else if (newSolved.length >= rowSize) {
    newState = { ...newState, complete: true }
  }

  return newState
}

const freeze = (state) => {
  return { ...state, frozen: true }
}

const complete = (state) => {
  const { solved } = state
  const groupIds = [...Array(rowSize).keys()]
  let newState = state
  groupIds.forEach((groupId) => {
    if (!solved.includes(groupId) && newState.solved.length < rowSize) {
      newState = updateGrid(newState, groupId)
    }
  })
  return freeze(newState)
}

export const initialGameState = getRandomWall()

export const gameStateReducer = (state, action) => {
  switch (action.type) {
    case 'new':
      return getRandomWall(action.payload)
    case 'guess':
      return guess(state, action.payload)
    case 'freeze':
      return freeze(state)
    case 'complete':
      return complete(state)
    default:
      throw new Error(
        `Unexpected action type in game state reducer: ${action.type}`
      )
  }
}
