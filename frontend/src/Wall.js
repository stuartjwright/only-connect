import './Wall.css'
import classNames from 'classnames'
import { useEffect } from 'react'

const Wall = ({ wallData, sendGuess, selectedIds, setSelectedIds }) => {
  const toggleSelected = (tileId) => {
    const newIds = [
      ...selectedIds.slice(0, tileId),
      selectedIds[tileId] === 1 ? 0 : 1,
      ...selectedIds.slice(tileId + 1),
    ]
    setSelectedIds(newIds)
  }

  useEffect(() => {
    const guessIds = selectedIds
      .map((value, id) => (value === 1 ? id : null))
      .filter((id) => id !== null)
    if (guessIds.length === 4) {
      sendGuess(guessIds)
      setSelectedIds(new Array(16).fill(0))
    }
  }, [selectedIds, sendGuess, setSelectedIds])

  const { grid, solved } = wallData

  return (
    <div className="grid-container">
      {grid.map((tile, i) => {
        const isSolved = solved.includes(tile.group)
        const classes = classNames('tile', {
          selectable: !isSolved,
          selected: selectedIds[tile.id],
          solved: isSolved,
          'solved-1': isSolved && i < 4,
          'solved-2': isSolved && i >= 4 && i < 8,
          'solved-3': isSolved && i >= 8 && i < 12,
          'solved-4': isSolved && i >= 12,
        })
        return (
          <div
            key={tile.id}
            className={classes}
            onClick={isSolved ? null : () => toggleSelected(tile.id)}
          >
            {tile.item}
          </div>
        )
      })}
    </div>
  )
}

export default Wall
