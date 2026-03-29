import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    // Step 1 - Basic Details
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    // Step 2 - Lifestyle
    bodyType: '',
    workStyle: '',
    exerciseFrequency: '',
    exerciseType: '',
    waterIntake: '',
    digestion: '',
    // Step 3 - Goals
    goal: '',
    // Step 4 - Food Preferences
    foodType: '',
    cuisine: [],
    mealCount: '',
    // Step 5 - Wellness Focus
    wellnessFocus: [],
    // Step 6 - Restrictions
    restrictions: [],
    extraNotes: ''
  })

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const toggleArray = (key, value) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  // Progress bar
  const progress = (step / 6) * 100

  return (
    <div className="min-h-screen bg-soft flex flex-col items-center justify-center px-6 py-10">

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>Step {step} of 6</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-accent rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-sm p-8">

        {/* STEP 1 - Basic Details */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="text-center mb-2">
              <div className="text-4xl mb-2">👋</div>
              <h2 className="text-xl font-bold text-dark">Let's get to know you</h2>
              <p className="text-muted text-sm mt-1">Basic details to personalise your plan</p>
            </div>

            <input
              type="text"
              placeholder="Your name"
              value={data.name}
              onChange={e => updateData('name', e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="Age"
              value={data.age}
              onChange={e => updateData('age', e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={data.weight}
              onChange={e => updateData('weight', e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="number"
              placeholder="Height (cm)"
              value={data.height}
              onChange={e => updateData('height', e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {/* Gender */}
            <div>
              <p className="text-sm font-medium text-dark mb-2">Gender</p>
              <div className="flex gap-3">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    key={g}
                    onClick={() => updateData('gender', g)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      data.gender === g
                        ? 'border-primary bg-accent text-primary'
                        : 'border-gray-200 text-muted'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 - Lifestyle Quiz */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="text-center mb-2">
              <div className="text-4xl mb-2">🏃</div>
              <h2 className="text-xl font-bold text-dark">Tell us about your life</h2>
              <p className="text-muted text-sm mt-1">This shapes your entire meal plan</p>
            </div>

            {/* Body Type */}
            <div>
              <p className="text-sm font-medium text-dark mb-2">Body Type</p>
              <div className="flex flex-col gap-2">
                {[
                  { value: 'ectomorph', label: '🦴 Eat a lot, never gain weight' },
                  { value: 'mesomorph', label: '⚖️ Gain & lose weight fairly easily' },
                  { value: 'endomorph', label: '🌊 Gain weight easily, hard to lose' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateData('bodyType', opt.value)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border-2 text-left transition-all ${
                      data.bodyType === opt.value
                        ? 'border-primary bg-accent text-primary'
                        : 'border-gray-200 text-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Style */}
            <div>
              <p className="text-sm font-medium text-dark mb-2">Work Style</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'desk', label: '💻 Desk job' },
                  { value: 'physical', label: '🏗️ Physical work' },
                  { value: 'home', label: '🏠 Work from home' },
                  { value: 'student', label: '🎓 Student' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateData('workStyle', opt.value)}
                    className={`py-3 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      data.workStyle === opt.value
                        ? 'border-primary bg-accent text-primary'
                        : 'border-gray-200 text-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise Frequency */}
            <div>
              <p className="text-sm font-medium text-dark mb-2">Exercise Frequency</p>
              <div className="flex flex-col gap-2">
                {[
                  { value: 'none', label: '😴 None / barely move' },
                  { value: 'light', label: '🚶 Light (walks, casual)' },
                  { value: 'moderate', label: '💪 Moderate (gym 3x a week)' },
                  { value: 'active', label: '🔥 Active (gym 5x+)' },
                  { value: 'athlete', label: '🏆 Athlete level' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateData('exerciseFrequency', opt.value)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border-2 text-left transition-all ${
                      data.exerciseFrequency === opt.value
                        ? 'border-primary bg-accent text-primary'
                        : 'border-gray-200 text-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Water Intake */}
            <div>
              <p className="text-sm font-medium text-dark mb-2">Daily Water Intake</p>
              <div className="flex gap-2">
                {[
                  { value: 'low', label: '😬 Under 1L' },
                  { value: 'medium', label: '👍 1-2L' },
                  { value: 'high', label: '💧 2L+' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateData('waterIntake', opt.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      data.waterIntake === opt.value
                        ? 'border-primary bg-accent text-primary'
                        : 'border-gray-200 text-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Digestion */}
            <div>
              <p className="text-sm font-medium text-dark mb-2">Digestion</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'acidity', label: '🌶️ Acidity' },
                  { value: 'bloating', label: '🎈 Bloating' },
                  { value: 'ibs', label: '😣 IBS' },
                  { value: 'none', label: '✅ No issues' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateData('digestion', opt.value)}
                    className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      data.digestion === opt.value
                        ? 'border-primary bg-accent text-primary'
                        : 'border-gray-200 text-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 - Goals */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="text-center mb-2">
              <div className="text-4xl mb-2">🎯</div>
              <h2 className="text-xl font-bold text-dark">What's your goal?</h2>
              <p className="text-muted text-sm mt-1">Your plan will be built around this</p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { value: 'fat_loss', label: '🔥 Fat Loss', desc: 'Burn fat, calorie deficit' },
                { value: 'muscle_gain', label: '💪 Muscle Gain', desc: 'Build muscle, calorie surplus' },
                { value: 'general_wellness', label: '🌿 General Wellness', desc: 'Feel healthy & energetic' },
                { value: 'balanced_diet', label: '⚖️ Balanced Diet', desc: 'Maintain & stay fit' },
                { value: 'maintain', label: '🎯 Maintain Weight', desc: 'Keep current weight' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateData('goal', opt.value)}
                  className={`py-4 px-4 rounded-xl border-2 text-left transition-all ${
                    data.goal === opt.value
                      ? 'border-primary bg-accent'
                      : 'border-gray-200'
                  }`}
                >
                  <p className="font-semibold text-dark text-sm">{opt.label}</p>
                  <p className="text-muted text-xs mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 - Food Preferences */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div className="text-center mb-2">
              <div className="text-4xl mb-2">🍽️</div>
              <h2 className="text-xl font-bold text-dark">Food Preferences</h2>
              <p className="text-muted text-sm mt-1">Tell us what you eat</p>
            </div>

            {/* Food Type */}
            <div>
              <p className="text-sm font-medium text-dark mb-2">Diet Type</p>
              <div className="flex gap-2">
                {[
                  { value: 'vegetarian', label: '🥦 Veg' },
                  { value: 'nonveg', label: '🍗 Non-Veg' },
                  { value: 'eggetarian', label: '🥚 Eggetarian' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateData('foodType', opt.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      data.foodType === opt.value
                        ? 'border-primary bg-accent text-primary'
                        : 'border-gray-200 text-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine */}
            <div>
              <p className="text-sm font-medium text-dark mb-2">Cuisine Preference</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'south_indian', label: '🍚 South Indian' },
                  { value: 'north_indian', label: '🫓 North Indian' },
                  { value: 'pan_indian', label: '🇮🇳 Pan Indian' },
                  { value: 'continental', label: '🥗 Continental' },
                  { value: 'ai_suggest', label: '🤖 AI Suggest' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => toggleArray('cuisine', opt.value)}
                    className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      data.cuisine.includes(opt.value)
                        ? 'border-primary bg-accent text-primary'
                        : 'border-gray-200 text-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Count */}
            <div>
              <p className="text-sm font-medium text-dark mb-2">Meals per day</p>
              <div className="flex gap-3">
                {[
                  { value: '2', label: '2 Meals' },
                  { value: '3', label: '3 Meals' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateData('mealCount', opt.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      data.mealCount === opt.value
                        ? 'border-primary bg-accent text-primary'
                        : 'border-gray-200 text-dark'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 - Wellness Focus */}
        {step === 5 && (
          <div className="flex flex-col gap-5">
            <div className="text-center mb-2">
              <div className="text-4xl mb-2">✨</div>
              <h2 className="text-xl font-bold text-dark">Wellness Focus</h2>
              <p className="text-muted text-sm mt-1">Optional extras we'll weave into your plan</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'skin', label: '💆 Better Skin' },
                { value: 'hair', label: '💇 Hair Growth' },
                { value: 'sleep', label: '😴 Better Sleep' },
                { value: 'focus', label: '🧠 Mental Focus' },
                { value: 'bones', label: '🦴 Bone Strength' },
                { value: 'gut', label: '🫃 Gut Health' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => toggleArray('wellnessFocus', opt.value)}
                  className={`py-4 rounded-xl text-sm font-medium border-2 transition-all ${
                    data.wellnessFocus.includes(opt.value)
                      ? 'border-primary bg-accent text-primary'
                      : 'border-gray-200 text-dark'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted text-center">Select all that apply — or skip!</p>
          </div>
        )}

        {/* STEP 6 - Restrictions */}
        {step === 6 && (
          <div className="flex flex-col gap-5">
            <div className="text-center mb-2">
              <div className="text-4xl mb-2">🗒️</div>
              <h2 className="text-xl font-bold text-dark">Anything else?</h2>
              <p className="text-muted text-sm mt-1">Help us avoid anything that doesn't work for you</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'pregnant', label: '🤰 Pregnant' },
                { value: 'diabetic', label: '🩺 Diabetic' },
                { value: 'bp', label: '❤️ Blood Pressure' },
                { value: 'joint', label: '🦴 Joint Pain' },
                { value: 'traveller', label: '✈️ Frequent Traveller' },
                { value: 'family', label: '👨‍👩‍👧 Cooking for Family' },
                { value: 'drinker', label: '🍺 Occasional Drinker' },
                { value: 'irregular_sleep', label: '😴 Irregular Sleep' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => toggleArray('restrictions', opt.value)}
                  className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                    data.restrictions.includes(opt.value)
                      ? 'border-primary bg-accent text-primary'
                      : 'border-gray-200 text-dark'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-dark mb-2">Anything else to tell us?</p>
              <textarea
                placeholder="e.g. I have a nut allergy, I skip breakfast on weekdays..."
                value={data.extraNotes}
                onChange={e => updateData('extraNotes', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary h-24 resize-none"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-muted font-medium text-sm"
            >
              ← Back
            </button>
          )}
          <button
            onClick={step === 6 ? async () => {
              // Save preferences to Firestore
              const userId = localStorage.getItem('userId')
              if (userId) {
                try {
                  await setDoc(doc(db, 'users', userId, 'preferences', 'latest'), {
                    ...data,
                    updatedAt: new Date().toISOString()
                  })
                } catch (err) {
                  console.error('Error saving preferences:', err)
                }
              }
              // Clear saved plan so new one generates
const userId = localStorage.getItem('userId')
if (userId) {
  const { doc, deleteDoc } = await import('firebase/firestore')
  const { db } = await import('../firebase')
  await deleteDoc(doc(db, 'users', userId, 'plans', 'current'))
}
navigate('/plan', { state: data })
            } : nextStep}
            className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-green-600 transition-all"
          >
            {step === 6 ? '🚀 Build My Plan!' : 'Next →'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Onboarding
