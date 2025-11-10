import { useState, useEffect } from 'react'
import catImage from '../assets/images/cat.svg'
import './DancingCat.css'

function DancingCat() {
  const [isAnimating, setIsAnimating] = useState(true)

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Space or Enter key to toggle animation
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        toggleAnimation()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isAnimating])

  return (
    <div className="dancing-cat-container" role="main">
      <div
        className={`cat-wrapper ${isAnimating ? 'dancing' : ''}`}
        role="img"
        aria-label={isAnimating ? 'Dancing cat animation' : 'Stationary cat'}
      >
        <img src={catImage} alt="Cute orange cat" className="cat-image" />
      </div>

      <button
        className="control-button"
        onClick={toggleAnimation}
        aria-label={isAnimating ? 'Stop the dancing animation' : 'Start the dancing animation'}
        aria-pressed={isAnimating}
      >
        {isAnimating ? '⏸ Stop Dancing' : '▶ Start Dancing'}
      </button>

      <p className="instruction" role="status" aria-live="polite">
        {isAnimating ? 'Watch me dance! 💃' : 'Click to make me dance! 🐱'}
      </p>

      <div className="keyboard-hint">
        Press <kbd>Space</kbd> or <kbd>Enter</kbd> to toggle
      </div>
    </div>
  )
}

export default DancingCat
