import './Timer.css'
import classNames from 'classnames'

const Timer = ({ timer }) => {
  const minutes = Math.floor(timer / 60)
  const seconds = timer - minutes * 60
  const timeString = `${minutes}:${String(seconds).padStart(2, '0')}`
  const classes = classNames('timer', {
    warning: timer <= 30,
    danger: timer <= 10,
  })
  return (
    <div className={classes}>
      <p>{timeString}</p>
    </div>
  )
}

export default Timer
