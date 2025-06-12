import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"

interface JobCardProps {
  title: string
  company: string
  location: string
  type: string
  salary: string
  href?: string
}

export function JobCard({ title, company, location, type, salary, href = "#" }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{company}</p>
          </div>
          <Badge variant="secondary">{type}</Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {salary}
          </div>
        </div>

        <Link href={href}>
          <Button className="w-full">
            Apply Now
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
