"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Clock, Flag, Menu, X } from "lucide-react"
import { QuestionNavigator } from "@/components/question-navigator"
import type { Question } from "@/lib/questions"

interface TestInterfaceProps {
  courseId: string
  initialQuestions: Question[]
}

export function TestInterface({ courseId, initialQuestions }: TestInterfaceProps) {
  const router = useRouter()
  const [questions] = useState<Question[]>(initialQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState(90 * 60)
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)

  useEffect(() => {
    if (timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerChange = (option: string) => {
    const currentAnswers = answers[currentQuestion.id] || []

    if (currentQuestion?.type === "single") {
      setAnswers({ ...answers, [currentQuestion.id]: [option] })
    } else {
      if (currentAnswers.includes(option)) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: currentAnswers.filter((a) => a !== option),
        })
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...currentAnswers, option],
        })
      }
    }
  }

  const toggleFlag = (questionId: string) => {
    const newFlagged = new Set(flaggedQuestions)
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId)
    } else {
      newFlagged.add(questionId)
    }
    setFlaggedQuestions(newFlagged)
  }

  const handleNavigate = (index: number) => {
    setCurrentQuestionIndex(index)
    setIsNavigatorOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = () => {
    const results = {
      courseId,
      answers,
      questions,
      timeSpent: 90 * 60 - timeRemaining,
    }
    sessionStorage.setItem("testResults", JSON.stringify(results))
    router.push(`/results/${courseId}`)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">No questions available</div>
      </div>
    )
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const currentAnswers = answers[currentQuestion.id] || []
  const answeredQuestionIds = Object.keys(answers).filter((key) => answers[key]?.length > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="text-sm font-medium text-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <Progress value={progress} className="mt-1 h-1 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{formatTime(timeRemaining)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden bg-transparent"
                onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
              >
                {isNavigatorOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Question Card */}
          <div className="flex-1">
            <Card id={`question-${currentQuestionIndex}`}>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      {currentQuestion.type === "single" ? "Single Choice" : "Multiple Choice"}
                    </span>
                    {currentQuestion.type === "multi" && (
                      <span className="text-xs text-muted-foreground">(Select all that apply)</span>
                    )}
                  </div>
                  <Button
                    variant={flaggedQuestions.has(currentQuestion.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFlag(currentQuestion.id)}
                  >
                    <Flag className="mr-2 h-3 w-3" />
                    {flaggedQuestions.has(currentQuestion.id) ? "Flagged" : "Flag for Review"}
                  </Button>
                </div>
                <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = currentAnswers.includes(option)
                    return (
                      <label
                        key={index}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${
                          isSelected ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        {currentQuestion.type === "single" ? (
                          <input
                            type="radio"
                            name="answer"
                            checked={isSelected}
                            onChange={() => handleAnswerChange(option)}
                            className="mt-0.5 h-4 w-4 accent-primary"
                          />
                        ) : (
                          <Checkbox checked={isSelected} onCheckedChange={() => handleAnswerChange(option)} />
                        )}
                        <span className="flex-1 text-sm leading-relaxed text-foreground">{option}</span>
                      </label>
                    )
                  })}
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigate(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button onClick={handleSubmit} size="lg">
                      Submit Test
                    </Button>
                  ) : (
                    <Button onClick={() => handleNavigate(Math.min(questions.length - 1, currentQuestionIndex + 1))}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:block lg:w-80">
            <QuestionNavigator
              totalQuestions={questions.length}
              answeredQuestions={answeredQuestionIds}
              currentQuestionIndex={currentQuestionIndex}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      </main>

      {isNavigatorOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsNavigatorOpen(false)} />

          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-card rounded-t-2xl shadow-2xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Question Navigator</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsNavigatorOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Answered: {answeredQuestionIds.length} / {questions.length}
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(80vh-100px)]">
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                {Array.from({ length: questions.length }, (_, index) => {
                  const questionNumber = index + 1
                  const isAnswered = answeredQuestionIds.includes(String(questionNumber))
                  const isCurrent = currentQuestionIndex === index

                  return (
                    <button
                      key={index}
                      onClick={() => handleNavigate(index)}
                      className={`
                        h-12 rounded-lg font-medium text-sm transition-all
                        ${
                          isCurrent
                            ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                            : isAnswered
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }
                      `}
                    >
                      {questionNumber}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
