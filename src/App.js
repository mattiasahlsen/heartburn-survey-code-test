import './App.css'
import data from './questions.json'
import { useState } from 'react'
import classNames from 'classnames'

const questions = data.questions

function App() {
  const [questionId, setQuestionId] = useState(questions[0].id)
  const [patientScore, setPatientScore] = useState(0)
  const [patientAnswers, setPatientAnswers] = useState({})
  const [outcome, setOutcome] = useState(null)

  const question = questions.find((q) => q.id === questionId)
  const answer = question.answers.find(
    (answer) => answer.id === patientAnswers[questionId]
  )

  function selectAnswer(answer) {
    setPatientAnswers((prev) => ({
      ...prev,
      [questionId]: answer.id,
    }))
  }

  function next() {
    const newScore = patientScore + answer.score
    setPatientScore(newScore)

    const nextOptions = question.next

    const nextOption = nextOptions.find((option) => {
      if (option.answered) {
        return option.answered === answer.id
      } else if (typeof option.max_score === 'number') {
        return newScore <= option.max_score
      } else {
        return true
      }
    })

    if (nextOption.next_question) {
      setQuestionId(nextOption.next_question)
    } else {
      const myOutcome = data.outcomes.find(
        (outcome) => outcome.id === nextOption.outcome
      )
      setOutcome(myOutcome)
    }
  }

  return (
    <div className="app min-h-screen bg-slate-100">
      <header className="bg-slate-700 text-2xl text-white shadow-md">
        <h1 className="mx-auto py-4 px-8 container">Heart Burn Survey</h1>
      </header>

      <div className="container mx-auto my-8 md:my-12">
        <div className="mx-4 flex flex-col items-stretch">
          {outcome ? (
            <div className="mx-4">
              <h2 className="text-2xl mb-2">
                Thank you for answering all the questions
              </h2>
              <p className="font-bold text-slate-700">{outcome.text}</p>
              {outcome.show_booking_button && (
                <button className="bg-slate-700 text-white px-4 py-2 mt-4 text-center font-bold shadow-md flex-1">
                  Book an appointment
                </button>
              )}
            </div>
          ) : (
            <div>
              <h2 className="mb-4 mx-4 text-2xl">Questions</h2>
              <div className="p-4 bg-white shadow-md text-slate-700">
                <h4 className="text-xl">{question.question_text}</h4>

                <div className="flex items-center gap-x-8 my-4">
                  {question.answers.map((answer) => (
                    <button
                      key={answer.id}
                      className={classNames(
                        'bg-sky-500 text-white px-4 py-2 text-center font-bold shadow-md flex-1 md:basis-48 md:flex-grow-0 md:py-3',
                        {
                          '!bg-sky-700':
                            patientAnswers[questionId] === answer.id,
                        }
                      )}
                      onClick={() => selectAnswer(answer)}
                    >
                      {answer.label}
                    </button>
                  ))}
                </div>
              </div>
              {answer && (
                <button
                  className="bg-slate-700 text-white px-4 py-2 mt-4 md:mt-8 text-center font-bold shadow-md flex-1 w-full"
                  onClick={next}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
