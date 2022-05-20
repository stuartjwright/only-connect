import './Lives.css'

const Lives = ({ frozen, lives }) => {
  const content = frozen ? '💔' : ' ❤️ '.repeat(lives)
  return (
    <div className="lives">
      <p>{content}</p>
    </div>
  )
}

export default Lives
