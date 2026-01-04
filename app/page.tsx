import Link from "next/link"
import { BookOpen, Cloud, Shield, Briefcase, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const courses = [
  {
    id: "ccna",
    title: "CCNA",
    description: "Cisco Certified Network Associate",
    icon: BookOpen,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    questions: 100,
  },
  {
    id: "aws",
    title: "AWS",
    description: "Amazon Web Services Certification",
    icon: Cloud,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    questions: 100,
  },
  {
    id: "azure",
    title: "Azure",
    description: "Microsoft Azure Fundamentals",
    icon: Shield,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    questions: 100,
  },
  {
    id: "devops",
    title: "DevOps",
    description: "DevOps Engineering Certification",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    questions: 100,
  },
  {
    id: "hr",
    title: "HR",
    description: "Human Resources Management",
    icon: Users,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    questions: 100,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">ExamPrep Pro</h1>
              <p className="mt-1 text-sm text-muted-foreground">Professional certification mock tests</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Choose Your Certification Path
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Practice with professional mock tests designed to help you pass your certification exam
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const Icon = course.icon
            return (
              <Card
                key={course.id}
                className={`group relative overflow-hidden border-2 transition-all hover:shadow-lg ${course.borderColor} ${course.bgColor}`}
              >
                <CardHeader>
                  <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br p-3 ${course.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <CardDescription className="text-base">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Questions:</span>
                      <span className="font-semibold text-foreground">{course.questions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pass Mark:</span>
                      <span className="font-semibold text-foreground">60%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold text-foreground">90 min</span>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/test/${course.id}`}>Start Test</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-bold text-foreground">100</div>
            <div className="mt-1 text-sm text-muted-foreground">Questions per test</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-bold text-foreground">60%</div>
            <div className="mt-1 text-sm text-muted-foreground">Required to pass</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-bold text-foreground">Instant</div>
            <div className="mt-1 text-sm text-muted-foreground">Results & feedback</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-3xl font-bold text-foreground">Random</div>
            <div className="mt-1 text-sm text-muted-foreground">Question order</div>
          </div>
        </div>
      </main>
    </div>
  )
}
