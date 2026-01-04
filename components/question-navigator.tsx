"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuestionNavigatorProps {
  totalQuestions: number
  answeredQuestions: string[]
  currentQuestionIndex: number
  onNavigate: (index: number) => void
}

export function QuestionNavigator({
  totalQuestions,
  answeredQuestions,
  currentQuestionIndex,
  onNavigate,
}: QuestionNavigatorProps) {
  const answeredCount = answeredQuestions.length
  const progressPercentage = (answeredCount / totalQuestions) * 100

  return (
    <div className="sticky top-24">
      <Card className="shadow-lg bg-card border-2">
        <CardHeader className="space-y-3 bg-muted/30">
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <span>Question Navigator</span>
            <span className="text-xs font-normal text-muted-foreground">
              {answeredCount}/{totalQuestions}
            </span>
          </CardTitle>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span
                className={`font-semibold ${
                  progressPercentage < 40
                    ? "text-red-500"
                    : progressPercentage < 60
                      ? "text-orange-500"
                      : "text-green-500"
                }`}
              >
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercentage < 40 ? "bg-red-500" : progressPercentage < 60 ? "bg-orange-500" : "bg-green-500"
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 max-h-[calc(100vh-350px)] overflow-y-auto">
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: totalQuestions }, (_, index) => {
              const questionNumber = index + 1
              const isAnswered = answeredQuestions.includes(String(questionNumber))
              const isCurrent = currentQuestionIndex === index

              return (
                <button
                  key={index}
                  onClick={() => {
                    onNavigate(index)
                    const element = document.getElementById(`question-${index}`)
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "center" })
                    }
                  }}
                  className={`
                    h-9 rounded-lg font-medium text-xs transition-all
                    ${
                      isCurrent
                        ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-background scale-105"
                        : isAnswered
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }
                  `}
                  title={`Question ${questionNumber}${isAnswered ? " (Answered)" : ""}`}
                >
                  {questionNumber}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
