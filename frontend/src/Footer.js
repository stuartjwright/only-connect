import './Footer.css'
import classNames from 'classnames'

const Footer = ({
  clearSelected,
  fetchWallData,
  getSolution,
  wallData,
  selectedIds,
  toggleConnections,
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
        <p>Clear Selected</p>
      </div>
      <div className="button selectable" onClick={fetchWallData}>
        <p>New Wall</p>
      </div>
      {disableShowSolution ? (
        <div
          className={classNames('button', 'selectable')}
          onClick={toggleConnections}
        >
          <p>Toggle Connections</p>
        </div>
      ) : (
        <div
          className={classNames('button', 'selectable')}
          onClick={getSolution}
        >
          <p>Show Solution</p>
        </div>
      )}
    </div>
  )
}

export default Footer
