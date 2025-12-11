export default function Toast({ message, isVisible }) {
  if (!message) return null
  
  return (
    <div className={`toast ${isVisible ? 'show' : 'hide'}`}>
      {message}
    </div>
  )
}

