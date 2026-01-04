import { getQuestionsServer } from "@/lib/questions"
import { TestInterface } from "@/components/test-interface"

interface TestPageProps {
  params: Promise<{ courseId: string }>
}

export default async function TestPage({ params }: TestPageProps) {
  const { courseId } = await params

  const questions = getQuestionsServer(courseId)

  // Handle error cases
  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">No Questions Available</h1>
          <p className="text-muted-foreground">
            The question file for {courseId.toUpperCase()} is empty or could not be found.
          </p>
        </div>
      </div>
    )
  }

  return <TestInterface courseId={courseId} initialQuestions={questions} />
}
