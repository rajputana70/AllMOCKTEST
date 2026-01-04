"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Download, Home, RotateCcw } from "lucide-react"
import type { Question } from "@/lib/questions"
import jsPDF from "jspdf"

interface TestResults {
  courseId: string
  answers: Record<number, string[]>
  questions: Question[]
  timeSpent?: number
}

interface ResultsPageProps {
  params: Promise<{ courseId: string }>
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const router = useRouter()
  const [courseId, setCourseId] = useState<string>("")
  const [results, setResults] = useState<TestResults | null>(null)
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params
      setCourseId(resolvedParams.courseId)

      const storedResults = sessionStorage.getItem("testResults")
      if (!storedResults) {
        router.push("/")
        return
      }

      const parsedResults: TestResults = JSON.parse(storedResults)
      setResults(parsedResults)

      let correct = 0
      parsedResults.questions.forEach((question) => {
        const userAnswers = parsedResults.answers[question.id] || []
        const correctAnswers = question.correct.sort()
        const userAnswersSorted = [...userAnswers].sort()

        if (JSON.stringify(correctAnswers) === JSON.stringify(userAnswersSorted)) {
          correct++
        }
      })

      const percentage = (correct / parsedResults.questions.length) * 100
      setScore(percentage)
      setPassed(percentage >= 60)
    }
    init()
  }, [params, router])

  const handleDownloadPDF = () => {
    if (!results) return

    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text("Test Results", 20, 20)

    doc.setFontSize(12)
    doc.text(`Course: ${results.courseId.toUpperCase()}`, 20, 35)
    doc.text(`Score: ${score.toFixed(1)}%`, 20, 45)
    doc.text(`Status: ${passed ? "PASSED" : "FAILED"}`, 20, 55)
    doc.text(`Questions: ${results.questions.length}`, 20, 65)

    let yPosition = 80

    results.questions.forEach((question) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      const userAnswers = results.answers[question.id] || []
      const correctAnswers = question.correct
      const isCorrect = JSON.stringify([...userAnswers].sort()) === JSON.stringify([...correctAnswers].sort())

      doc.setFontSize(10)
      const questionText =
        question.question.length > 80 ? question.question.substring(0, 80) + "..." : question.question
      doc.text(`Q${question.id}: ${questionText}`, 20, yPosition)
      yPosition += 7

      doc.text(`Your answer: ${userAnswers.join(", ") || "No answer"}`, 20, yPosition)
      yPosition += 7

      if (!isCorrect) {
        doc.text(`Correct: ${correctAnswers.join(", ")}`, 20, yPosition)
        yPosition += 7
      }

      doc.text(`Status: ${isCorrect ? "Correct" : "Incorrect"}`, 20, yPosition)
      yPosition += 10
    })

    doc.save(`${results.courseId}-test-results.pdf`)
  }

  if (!results) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading results...</div>
      </div>
    )
  }

  const correctCount = results.questions.filter((question) => {
    const userAnswers = results.answers[question.id] || []
    const correctAnswers = question.correct
    return JSON.stringify([...userAnswers].sort()) === JSON.stringify([...correctAnswers].sort())
  }).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground">Test Results</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Score Card */}
        <Card className={`mb-8 border-2 ${passed ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {passed ? "Congratulations! You Passed!" : "Sorry, You Did Not Pass"}
              </CardTitle>
              {passed ? (
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              ) : (
                <XCircle className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-sm text-muted-foreground">Your Score</div>
                <div className="text-3xl font-bold text-foreground">{score.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Questions Correct</div>
                <div className="text-3xl font-bold text-foreground">
                  {correctCount}/{results.questions.length}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pass Mark</div>
                <div className="text-3xl font-bold text-foreground">60%</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => router.push("/")}>
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <Button variant="outline" onClick={() => router.push(`/test/${courseId}`)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Test
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.questions.map((question) => {
                const userAnswers = results.answers[question.id] || []
                const correctAnswers = question.correct
                const isCorrect = JSON.stringify([...userAnswers].sort()) === JSON.stringify([...correctAnswers].sort())

                return (
                  <div key={question.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                    <div className="mb-3 flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-foreground">Question {question.id}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{question.question}</div>
                      </div>
                    </div>

                    <div className="ml-8 space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Your Answer: </span>
                        <span
                          className={
                            userAnswers.length === 0
                              ? "text-muted-foreground"
                              : isCorrect
                                ? "text-green-600"
                                : "text-red-600"
                          }
                        >
                          {userAnswers.length > 0 ? userAnswers.join(", ") : "No answer provided"}
                        </span>
                      </div>

                      {!isCorrect && (
                        <div>
                          <span className="font-medium text-foreground">Correct Answer: </span>
                          <span className="text-green-600">{correctAnswers.join(", ")}</span>
                        </div>
                      )}

                      {question.explanation && (
                        <div className="mt-2 rounded-lg bg-muted p-3">
                          <span className="font-medium text-foreground">Explanation: </span>
                          <span className="text-muted-foreground">{question.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
