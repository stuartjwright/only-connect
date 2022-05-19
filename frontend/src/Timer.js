const Timer = ({ timer }) => {
  const minutes = Math.floor(timer / 60)
  const seconds = timer - minutes * 60
  const timeString = `${minutes}:${String(seconds).padStart(2, '0')}`

  return <p>{timeString}</p>
}

export default Timer
