import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  const handleForgotPassword = async () => {
    if (!form.email) {
      setError('Please enter your email address first')
      return
    }
    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    try {
      await sendPasswordResetEmail(auth, form.email)
      setError('')
      alert('✅ Password reset email sent! Check your inbox.')
    } catch (err) {
      setError('Could not send reset email. Please try again.')
    }
  }
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, form.email, form.password
      )
      const user = userCredential.user

      localStorage.setItem('userEmail', user.email)
localStorage.setItem('userName', user.displayName || '')
localStorage.setItem('userId', user.uid)

// Check if user has existing plan
const { doc, getDoc } = await import('firebase/firestore')
const { db } = await import('../firebase')
const prefDoc = await getDoc(
  doc(db, 'users', user.uid, 'preferences', 'latest')
)

if (prefDoc.exists()) {
  // Check for saved plan
  const planDoc = await getDoc(
    doc(db, 'users', user.uid, 'plans', 'current')
  )
  if (planDoc.exists()) {
    // Load existing plan — don't regenerate!
    navigate('/plan', { 
      state: { 
        ...prefDoc.data(), 
        savedPlan: planDoc.data().plan 
      } 
    })
  } else {
    // Has preferences but no plan yet
    navigate('/plan', { state: prefDoc.data() })
  }
} else {
  navigate('/onboarding')
}
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-soft flex flex-col items-center justify-center px-6">

      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🥗</div>
        <h1 className="text-2xl font-bold text-dark">Welcome back!</h1>
        <p className="text-muted mt-1">Log in to see your meal plan</p>
      </div>

      <div className="bg-white w-full max-w-sm rounded-3xl shadow-sm p-8 flex flex-col gap-4">

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-dark">Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className={`border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
              form.email && !isValidEmail(form.email)
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 focus:border-primary'
            }`}
          />
          {form.email && !isValidEmail(form.email) && (
            <p className="text-xs text-red-400 mt-1">Please enter a valid email</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
  <label className="text-sm font-medium text-dark">Password</label>
  <span
    onClick={handleForgotPassword}
    className="text-xs text-primary cursor-pointer hover:underline"
  >
    Forgot password?
  </span>
</div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all pr-12"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-lg"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-primary text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all mt-2 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-center text-sm text-muted">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-primary font-medium cursor-pointer"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login