import Timer from './Timer.js'
import Lives from './Lives.js'
import './styles/Header.css'

const Header = ({ timer, frozen, lives }) => {
  return (
    <div className="header-container">
      <Lives {...{ frozen, lives }} />
      <div className="heading">
        <h1>The Wall</h1>
      </div>
      <Timer {...{ timer }} />
    </div>
  )
}

export default Header
