import './Footer.css'
import classNames from 'classnames'

const Footer = ({
  clearSelected,
  fetchWallData,
  getSolution,
  wallData,
  selectedIds,
}) => {
  const disableClear = selectedIds.filter((id) => id > 0).length === 0
  const disableShowSolution = wallData.complete === true

  return (
    <div className="footer-container">
      <div
        className={classNames('button', {
          disabled: disableClear,
          selectable: !disableClear,
        })}
        onClick={disableClear ? null : clearSelected}
      >
        Clear Selected
      </div>
      <div className="button selectable" onClick={fetchWallData}>
        New Wall
      </div>
      <div
        className={classNames('button', {
          disabled: disableShowSolution,
          selectable: !disableShowSolution,
        })}
        onClick={disableShowSolution ? null : getSolution}
      >
        Show Solution
      </div>
    </div>
  )
}

export default Footer
