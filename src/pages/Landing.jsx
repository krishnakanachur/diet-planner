import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Landing() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <div className="min-h-screen bg-soft flex flex-col items-center justify-center px-6">

      {/* Logo & Title */}
      <div
        className={`text-center mb-12 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-6xl mb-4 animate-bounce">🥗</div>
        <h1 className="text-4xl font-bold text-dark mb-3">
          Your Personal
          <span className="text-primary"> Diet Planner</span>
        </h1>
        <p className="text-muted text-lg max-w-md mx-auto">
          AI-powered meal plans built around your lifestyle,
          body type, and food preferences.
        </p>
      </div>

      {/* Feature Pills */}
      <div
        className={`flex flex-wrap gap-3 justify-center mb-12 transition-all duration-700 delay-200 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {[
          '🎯 Goal Based Plans',
          '🧬 Body Type Aware',
          '🍽️ Cuisine Preferences',
          '💧 Daily Wellness Juice',
          '🌅 Morning Rituals',
        ].map((feature) => (
          <span
            key={feature}
            className="bg-accent text-primary px-4 py-2 rounded-full text-sm font-medium"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* CTA Buttons */}
      <div
        className={`flex flex-col gap-4 w-full max-w-xs transition-all duration-700 delay-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <button
          onClick={() => navigate('/signup')}
          className="bg-primary text-white py-4 rounded-2xl text-lg font-semibold hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Get Started Free
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-primary py-4 rounded-2xl text-lg font-semibold border-2 border-primary hover:bg-accent hover:scale-105 transition-all duration-200"
        >
          I already have an account
        </button>
      </div>

      {/* Footer note */}
      <p className="text-muted text-sm mt-8">
        🔒 Your data is private and secure
      </p>

    </div>
  )
}

export default Landing