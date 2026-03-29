import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Plan() {
  const location = useLocation()
  const navigate = useNavigate()
  const userData = location.state
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAccount, setShowAccount] = useState(false)
  const [showNextWeek, setShowNextWeek] = useState(false)
const [weekFeedback, setWeekFeedback] = useState({
  rating: '',
  goalChanged: ''
})

  const generatePlan = async (data) => {
    const prompt = `
You are a professional nutritionist and diet planner. Generate a personalized 7-day meal plan based on the following user profile:

Name: ${data?.name || 'User'}
Age: ${data?.age}
Weight: ${data?.weight} kg
Height: ${data?.height} cm
Gender: ${data?.gender}
Body Type: ${data?.bodyType}
Work Style: ${data?.workStyle}
Exercise Frequency: ${data?.exerciseFrequency}
Water Intake: ${data?.waterIntake}
Digestion Issues: ${data?.digestion}
Fitness Goal: ${data?.goal}
Diet Type: ${data?.foodType}
Cuisine Preference: ${data?.cuisine?.join(', ')}
Meals Per Day: ${data?.mealCount}
Wellness Focus: ${data?.wellnessFocus?.join(', ') || 'none'}
Restrictions/Notes: ${data?.restrictions?.join(', ') || 'none'}
Extra Notes: ${data?.extraNotes || 'none'}

Generate a COMPLETE 7-day meal plan (Monday through Sunday, all 7 days) in this EXACT JSON format. You MUST include all 7 days. Each day must have different meals, different juices and different morning rituals:
{
  "days": [
    {
      "day": "Monday",
      "theme": "Day theme here",
      "morningRitual": {
        "drink": "drink name",
        "benefit": "why this drink today"
      },
      "breakfast": {
        "items": ["item1", "item2"],
        "fruit": "fruit name",
        "calories": 400,
        "protein": 20,
        "carbs": 45,
        "fat": 12
      },
      "midMorningJuice": {
        "drink": "juice name",
        "benefit": "benefit of this juice"
      },
      "lunch": {
        "items": ["item1", "item2"],
        "calories": 550,
        "protein": 25,
        "carbs": 60,
        "fat": 15
      },
      "snack": {
        "items": ["item1"],
        "isCheat": false,
        "calories": 150,
        "protein": 5,
        "carbs": 20,
        "fat": 5
      },
      "dinner": {
        "items": ["item1", "item2"],
        "calories": 450,
        "protein": 22,
        "carbs": 40,
        "fat": 14
      }
    }
  ]
}

Return ONLY the JSON, no extra text.
`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    })

    const result = await response.json()
    const text = result.choices[0].message.content
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  }

  const editMeal = async (dayIndex, mealType) => {
    const reason = prompt(
      `What would you like to change about ${mealType} on ${plan.days[dayIndex].day}?\n(e.g. "no dosa, give me idli instead")`
    )
    if (!reason) return

    const day = plan.days[dayIndex]
    const currentMeal = day[mealType]

    const editPrompt = `
You are a nutritionist. A user wants to change one specific meal from their diet plan.

User profile:
- Diet Type: ${userData?.foodType}
- Cuisine: ${userData?.cuisine?.join(', ')}
- Goal: ${userData?.goal}
- Digestion: ${userData?.digestion}

Current ${mealType} on ${day.day}:
${JSON.stringify(currentMeal)}

User's request: "${reason}"

Generate a replacement for ONLY this meal in the same JSON format as the current meal. Return ONLY the JSON object, nothing else.
`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: editPrompt }],
          temperature: 0.7
        })
      })

      const result = await response.json()
      const text = result.choices[0].message.content
      const clean = text.replace(/```json|```/g, '').trim()
      const newMeal = JSON.parse(clean)

      setPlan(prev => {
        const updated = JSON.parse(JSON.stringify(prev))
        updated.days[dayIndex][mealType] = newMeal
        return updated
      })

    } catch (err) {
      alert('Could not update meal. Please try again.')
      console.error(err)
    }
  }

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        // Use saved plan if available
        if (userData?.savedPlan) {
          setPlan(userData.savedPlan)
          setLoading(false)
          return
        }
        const generated = await generatePlan(userData)
        setPlan(generated)

// Save plan to Firestore
const userId = localStorage.getItem('userId')
if (userId) {
  const { doc, setDoc } = await import('firebase/firestore')
  const { db } = await import('../firebase')
  await setDoc(doc(db, 'users', userId, 'plans', 'current'), {
    plan: generated,
    createdAt: new Date().toISOString()
  })
}
      } catch (err) {
        setError('Something went wrong. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-soft flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🥗</div>
          <h1 className="text-2xl font-bold text-dark mb-3">
            Building your personal plan...
          </h1>
          <p className="text-muted">Our AI is crafting your 7-day meal plan</p>
          <div className="mt-6 flex gap-2 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-soft flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-dark mb-2">Something went wrong</h2>
          <p className="text-muted mb-6">{error}</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Top Bar */}
    <div className="flex justify-between items-center mb-8">
    <div>
    <h1 className="text-2xl font-bold text-dark">Your 7-Day Plan 🥗</h1>
    <p className="text-muted text-sm mt-1">Personalised just for you</p>
  </div>

  {/* Account Button */}
  <div className="relative">
    <button
      onClick={() => setShowAccount(!showAccount)}
      className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm hover:border-primary transition-all"
    >
      <span className="text-xl">👤</span>
      <span className="text-sm font-medium text-dark hidden sm:block">Account</span>
    </button>

    {/* Dropdown */}
    {showAccount && (
      <div className="absolute right-0 top-14 bg-white rounded-2xl shadow-lg border border-gray-100 w-64 z-50 p-4 flex flex-col gap-3">
        

        {/* User Info */}
<div className="bg-accent rounded-xl p-3">
  <p className="text-xs text-muted">Logged in as</p>
  <p className="text-sm font-semibold text-dark mt-1 truncate">
    {localStorage.getItem('userEmail') || 'User'}
  </p>
  <p className="text-xs text-primary mt-1">
    {localStorage.getItem('userName') || ''}
  </p>
</div>

{/* Update Preferences */}
<button
  onClick={() => {
    setShowAccount(false)
    navigate('/onboarding')
  }}
  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all text-left"
>
  <span>✏️</span>
  <span className="text-sm font-medium text-dark">Update Preferences</span>
</button>

{/* Generate Next Week */}
<button
  onClick={() => {
    setShowAccount(false)
    setShowNextWeek(true)
  }}
  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all text-left"
>
  <span>📅</span>
  <span className="text-sm font-medium text-dark">Generate Next Week</span>
</button>

{/* Logout */}
<button
  onClick={() => {
    setShowAccount(false)
    localStorage.clear()
    navigate('/login')
  }}
  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all text-left"
>
  <span>🚪</span>
  <span className="text-sm font-medium text-dark">Log Out</span>
</button>

{/* Delete Account */}
<button
  onClick={() => {
    const confirm = window.confirm('Are you sure you want to delete your account? This cannot be undone.')
    if (confirm) {
      localStorage.clear()
      navigate('/')
    }
  }}
  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 transition-all text-left"
>
  <span>🗑️</span>
  <span className="text-sm font-medium text-dark text-red-500">Delete Account</span>
</button>

      </div>
    )}
  </div>
</div>

        {/* Days */}
        {plan?.days?.map((day, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-sm p-6 mb-6">

            {/* Day Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark">{day.day}</h2>
              <span className="bg-accent text-primary text-xs font-medium px-3 py-1 rounded-full">
                {day.theme}
              </span>
            </div>

            {/* Morning Ritual */}
            <div className="bg-yellow-50 rounded-2xl p-4 mb-3">
              <p className="text-xs font-semibold text-yellow-600 mb-1">🌅 MORNING RITUAL</p>
              <p className="font-medium text-dark text-sm">{day.morningRitual?.drink}</p>
              <p className="text-xs text-muted mt-1">{day.morningRitual?.benefit}</p>
            </div>

            {/* Breakfast */}
            <div className="border border-gray-100 rounded-2xl p-4 mb-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-primary">🥣 BREAKFAST</p>
                <button
                  onClick={() => editMeal(index, 'breakfast')}
                  className="text-xs text-muted hover:text-primary transition-all"
                >
                  ✏️ Edit
                </button>
              </div>
              <p className="text-sm text-dark">{day.breakfast?.items?.join(', ')}</p>
              <p className="text-xs text-muted mt-1">🍎 {day.breakfast?.fruit}</p>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-muted">{day.breakfast?.calories} kcal</span>
                <span className="text-xs text-muted">P: {day.breakfast?.protein}g</span>
                <span className="text-xs text-muted">C: {day.breakfast?.carbs}g</span>
                <span className="text-xs text-muted">F: {day.breakfast?.fat}g</span>
              </div>
            </div>

            {/* Mid Morning Juice */}
            <div className="bg-green-50 rounded-2xl p-4 mb-3">
              <p className="text-xs font-semibold text-green-600 mb-1">🥤 MID-MORNING JUICE</p>
              <p className="font-medium text-dark text-sm">{day.midMorningJuice?.drink}</p>
              <p className="text-xs text-muted mt-1">{day.midMorningJuice?.benefit}</p>
            </div>

            {/* Lunch */}
            <div className="border border-gray-100 rounded-2xl p-4 mb-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-primary">🍽️ LUNCH</p>
                <button
                  onClick={() => editMeal(index, 'lunch')}
                  className="text-xs text-muted hover:text-primary transition-all"
                >
                  ✏️ Edit
                </button>
              </div>
              <p className="text-sm text-dark">{day.lunch?.items?.join(', ')}</p>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-muted">{day.lunch?.calories} kcal</span>
                <span className="text-xs text-muted">P: {day.lunch?.protein}g</span>
                <span className="text-xs text-muted">C: {day.lunch?.carbs}g</span>
                <span className="text-xs text-muted">F: {day.lunch?.fat}g</span>
              </div>
            </div>

            {/* Snack */}
            <div className="border border-gray-100 rounded-2xl p-4 mb-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-orange-400">
                  {day.snack?.isCheat ? '🍕 CHEAT SNACK' : '🍎 SNACK'}
                </p>
                <button
                  onClick={() => editMeal(index, 'snack')}
                  className="text-xs text-muted hover:text-primary transition-all"
                >
                  ✏️ Edit
                </button>
              </div>
              <p className="text-sm text-dark">{day.snack?.items?.join(', ')}</p>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-muted">{day.snack?.calories} kcal</span>
                <span className="text-xs text-muted">P: {day.snack?.protein}g</span>
                <span className="text-xs text-muted">C: {day.snack?.carbs}g</span>
                <span className="text-xs text-muted">F: {day.snack?.fat}g</span>
              </div>
            </div>

            {/* Dinner */}
            <div className="border border-gray-100 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-primary">🌙 DINNER</p>
                <button
                  onClick={() => editMeal(index, 'dinner')}
                  className="text-xs text-muted hover:text-primary transition-all"
                >
                  ✏️ Edit
                </button>
              </div>
              <p className="text-sm text-dark">{day.dinner?.items?.join(', ')}</p>
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-muted">{day.dinner?.calories} kcal</span>
                <span className="text-xs text-muted">P: {day.dinner?.protein}g</span>
                <span className="text-xs text-muted">C: {day.dinner?.carbs}g</span>
                <span className="text-xs text-muted">F: {day.dinner?.fat}g</span>
              </div>
            </div>

          </div>
        ))}

        {/* Action Buttons */}
<div className="flex gap-3 mb-8">
  <button
    onClick={() => navigate('/onboarding')}
    className="flex-1 bg-white text-primary py-4 rounded-2xl font-semibold text-lg border-2 border-primary hover:bg-accent transition-all"
  >
    🔄 Regenerate
  </button>
  <button
    onClick={() => setShowNextWeek(true)}
    className="flex-1 bg-primary text-white py-4 rounded-2xl font-semibold text-lg hover:bg-green-600 transition-all"
  >
    📅 Next Week
  </button>
</div>
      </div>
      {/* Next Week Modal */}
{showNextWeek && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-6">
    <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl">
      <h2 className="text-xl font-bold text-dark mb-2">
        📅 Generate Next Week
      </h2>
      <p className="text-muted text-sm mb-6">
        Quick update before we build your next plan!
      </p>

      {/* How did last week go */}
      <div className="mb-5">
        <p className="text-sm font-medium text-dark mb-3">
          How did last week go?
        </p>
        <div className="flex gap-2">
          {[
            { value: 'great', label: '🔥 Great' },
            { value: 'good', label: '👍 Good' },
            { value: 'struggled', label: '😅 Struggled' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setWeekFeedback(prev => ({ ...prev, rating: opt.value }))}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                weekFeedback.rating === opt.value
                  ? 'border-primary bg-accent text-primary'
                  : 'border-gray-200 text-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal changed */}
      <div className="mb-6">
        <p className="text-sm font-medium text-dark mb-3">
          Any changes to your goal?
        </p>
        <div className="flex gap-3">
          {[
            { value: 'same', label: '✅ Same goal' },
            { value: 'changed', label: '🔄 Changed' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                setWeekFeedback(prev => ({ ...prev, goalChanged: opt.value }))
                if (opt.value === 'changed') {
                  setShowNextWeek(false)
                  navigate('/onboarding')
                }
              }}
              className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                weekFeedback.goalChanged === opt.value
                  ? 'border-primary bg-accent text-primary'
                  : 'border-gray-200 text-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowNextWeek(false)}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-muted font-medium text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!weekFeedback.rating) {
              alert('Please tell us how last week went!')
              return
            }
            setShowNextWeek(false)
            setLoading(true)
            setPlan(null)
            const updatedData = {
              ...userData,
              weekFeedback: weekFeedback.rating
            }
            generatePlan(updatedData)
              .then(generated => {
                setPlan(generated)
                setLoading(false)
              })
              .catch(() => {
                setError('Something went wrong!')
                setLoading(false)
              })
          }}
          className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-green-600 transition-all"
        >
          🚀 Build Next Week!
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default Plan