"use client"

import { useState } from "react"
import  MainLayout  from "@/components/layout/main-layout"
import { SectionHeading } from "@/components/ui/section-heading"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { motion } from "framer-motion"

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

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Find Your Perfect Job"
            subtitle="Browse through our curated list of opportunities for students and recent graduates"
          />

          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                className="pl-10 pr-20 py-6 text-lg rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                className="absolute right-2 bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-\
