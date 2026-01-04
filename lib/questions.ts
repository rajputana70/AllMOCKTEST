import fs from "fs"
import path from "path"

export interface Question {
  id: number
  question: string
  options: string[]
  correct: string[]
  explanation: string
  type: "single" | "multi"
}

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getQuestionsServer(courseId: string): Question[] {
  try {
    const filePath = path.join(process.cwd(), "data", `${courseId}.json`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`[v0] Question file not found: ${filePath}`)
      return []
    }

    // Read and parse JSON file
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const questions: Question[] = JSON.parse(fileContent)

    if (!questions || questions.length === 0) {
      console.error(`[v0] No questions in file: ${filePath}`)
      return []
    }

    console.log(`[v0] Loaded ${questions.length} questions for ${courseId}`)

    // Randomize questions
    const shuffledQuestions = shuffleArray(questions)

    // Randomize options for each question
    return shuffledQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }))
  } catch (error) {
    console.error("[v0] Error loading questions:", error)
    return []
  }
}

export async function getQuestions(courseId: string): Promise<Question[]> {
  try {
    const response = await fetch(`/data/${courseId}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load questions for ${courseId}`)
    }
    const questions: Question[] = await response.json()
    return questions
  } catch (error) {
    console.error("[v0] Error loading questions:", error)
    return []
  }
}

export function getCourseInfo(courseId: string) {
  const courses: Record<string, { name: string; description: string; color: string }> = {
    ccna: {
      name: "CCNA",
      description: "Cisco Certified Network Associate",
      color: "from-blue-500 to-cyan-500",
    },
    aws: {
      name: "AWS",
      description: "Amazon Web Services",
      color: "from-orange-500 to-amber-500",
    },
    azure: {
      name: "Azure",
      description: "Microsoft Azure",
      color: "from-blue-600 to-sky-500",
    },
    devops: {
      name: "DevOps",
      description: "Development & Operations",
      color: "from-purple-500 to-pink-500",
    },
    hr: {
      name: "HR",
      description: "Human Resources",
      color: "from-green-500 to-emerald-500",
    },
  }
  return courses[courseId] || courses.ccna
}
