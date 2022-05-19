import Timer from './Timer.js'
import Status from './Status.js'
import './Header.css'

const Header = ({ timer }) => {
  return (
    <div className="header-container">
      <Status />
      <Timer {...{ timer }} />
    </div>
  )
}

export default Header
