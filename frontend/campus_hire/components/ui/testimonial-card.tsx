import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  content: string
  name: string
  role: string
  college: string
  rating: number
}

export function TestimonialCard({ content, name, role, college, rating }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{content}"</p>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {role} • {college}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
