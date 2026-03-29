import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, form.email, form.password
      )
      const user = userCredential.user

      // Update display name
      await updateProfile(user, { displayName: form.name })

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: form.name,
        email: form.email,
        createdAt: new Date().toISOString()
      })

      // Save to localStorage
      localStorage.setItem('userEmail', form.email)
      localStorage.setItem('userName', form.name)
      localStorage.setItem('userId', user.uid)

      navigate('/onboarding')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in.')
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
        <h1 className="text-2xl font-bold text-dark">Create your account</h1>
        <p className="text-muted mt-1">Start your wellness journey today</p>
      </div>

      <div className="bg-white w-full max-w-sm rounded-3xl shadow-sm p-8 flex flex-col gap-4">

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-dark">Full Name</label>
          <input
            name="name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
          />
        </div>

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
          <label className="text-sm font-medium text-dark">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 6 characters"
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

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-dark">Confirm Password</label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all pr-12"
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-lg"
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-primary text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all mt-2 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-primary font-medium cursor-pointer"
          >
            Log in
          </span>
        </p>

      </div>
    </div>
  )
}

export default Signup