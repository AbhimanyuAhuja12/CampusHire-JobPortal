"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase } from "lucide-react"

const jobListings = [
  {
    id: 1,
    title: "Software Engineer Intern",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Internship",
    salary: "$8,000/month",
    tags: ["React", "JavaScript", "Node.js"],
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Data Science Analyst",
    company: "DataFlow Inc",
    location: "Remote",
    type: "Full-time",
    salary: "$95,000/year",
    tags: ["Python", "Machine Learning", "SQL"],
    postedDate: "1 week ago",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Part-time",
    salary: "$45/hour",
    tags: ["Figma", "User Research", "Prototyping"],
    postedDate: "3 days ago",
  },
  {
    id: 4,
    title: "Marketing Intern",
    company: "Brand Solutions",
    location: "Chicago, IL",
    type: "Internship",
    salary: "$20/hour",
    tags: ["Social Media", "Content Creation", "Analytics"],
    postedDate: "Just now",
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "WebTech Inc",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$85,000/year",
    tags: ["React", "TypeScript", "CSS"],
    postedDate: "5 days ago",
  },
  {
    id: 6,
    title: "Product Manager",
    company: "InnovateCo",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$110,000/year",
    tags: ["Agile", "Product Strategy", "User Experience"],
    postedDate: "1 week ago",
  },
]

const jobTypes = ["All", "Full-time", "Part-time", "Internship"]
const locations = ["All", "Remote", "San Francisco, CA", "New York, NY", "Chicago, IL", "Austin, TX", "Seattle, WA"]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedType, setSelectedType] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === "All" || job.type === selectedType
    const matchesLocation = selectedLocation === "All" || job.location === selectedLocation
    
    return matchesSearch && matchesType && matchesLocation
  })

  const JobCard = ({ job }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {job.title}
          </h3>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
            {job.company}
          </p>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {job.postedDate}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="h-4 w-4" />
          {job.type}
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          {job.salary}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
          Apply Now
        </button>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Save Job
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Find Your Perfect Job
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse through our curated list of opportunities for students and recent graduates
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                className="w-full pl-10 pr-20 py-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="absolute right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center gap-2"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters */}
          {isFilterOpen && (
            <div className="max-w-4xl mx-auto mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={() => {
                    setSelectedType("All")
                    setSelectedLocation("All")
                    setSearchTerm("")
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredJobs.length} of {jobListings.length} jobs
            </p>
          </div>

          {/* Jobs Grid */}
          <div className="max-w-4xl mx-auto">
            {filteredJobs.length > 0 ? (
              <div className="grid gap-6">
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
                </p>
                <button 
                  onClick={() => {
                    setSelectedType("All")
                    setSelectedLocation("All")
                    setSearchTerm("")
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}