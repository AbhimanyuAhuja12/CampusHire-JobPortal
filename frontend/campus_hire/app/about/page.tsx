"use client"

import { use, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { SectionHeading } from "@/components/ui/section-heading"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Linkedin,
  Github,
  Mail,
  MapPin,
  Calendar,
  Users,
  Target,
  Award,
  Code,
  Briefcase,
  GraduationCap,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Mock data - In a real app, you'd fetch this from LinkedIn API
const founderData = {
  name: "Abhimanyu Ahuja",
  title: "Full Stack Developer",
  location: "India",
  profileImage: "/placeholder.svg?height=200&width=200",
  bio: "Passionate full-stack developer with expertise in modern web technologies. Building innovative solutions to connect students with career opportunities.",
  experience: [
    {
      title: "Software Developer Intern",
      company: "Forvia Hella",
      duration: "Jan 2025 – May 2025",
      description: `
      • Developed scalable web applications using React, Node.js, and modern technologies.  

      • Eliminated Excel-based workflows by building a multi-page React form, reducing expense processing time by 85% and cutting data redundancy by 50%.  

      • Integrated role-based authorization for multi-level approvals, improving transparency and enabling proactive budget tracking for finance teams.  
      
      • Achieved 95%+ test coverage using Jest and React Testing Library; created detailed ER diagrams and use cases to accelerate sprint delivery in an Agile environment.
      `
    }
  ],
  
  skills: ["React", "Next.js", "Node.js", "TypeScript", "Python", "MySQL", "MongoDB", "AWS", "Docker", "Git"],
  education: [
    {
      degree: "Bachelor of Technology",
      field: "Information Technology",
      institution: "Bharati Vidyapeeth College of Engineering",
      year: "2021-2025",
    },
  ],
  achievements: [
    "Built 20+ web applications",
    "Solved 300+ DSA questions on platforms like leetcode",
    "Open source contributor",
    "1st Runner Up at Epoch Hackathon",
  ],
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/abhimanyu-ahuja12/",
    github: "https://github.com/AbhimanyuAhuja12",
    email: "abhimanyuahuja12@gmail.com",
  },
}

const companyStats = [
  { icon: Users, label: "Students Helped", value: "10,000+" },
  { icon: Briefcase, label: "Job Placements", value: "5,000+" },
  { icon: GraduationCap, label: "Partner Colleges", value: "500+" },
  { icon: Award, label: "Success Rate", value: "95%" },
]

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "Connecting talented students with meaningful career opportunities worldwide.",
  },
  {
    icon: Users,
    title: "Student-Centric",
    description: "Every feature is designed with student success and career growth in mind.",
  },
  {
    icon: Award,
    title: "Quality First",
    description: "We ensure all opportunities are verified and from reputable organizations.",
  },
  {
    icon: Code,
    title: "Innovation",
    description: "Using cutting-edge technology to create the best job search experience.",
  },
]

export default function AboutPage() {
  const [founder] = useState(founderData)

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobPortal
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Empowering students to discover their dream careers through innovative technology and meaningful
              connections.
            </p>
          </motion.div>

          {/* Company Stats */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {companyStats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Story" subtitle="How JobPortal came to life and our vision for the future" />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="prose prose-lg dark:prose-invert">
                <p>
                  JobPortal was born from a simple observation: talented students were struggling to find meaningful
                  career opportunities, while great companies were missing out on fresh talent.
                </p>
                <p>
                  Founded in 2023, we set out to bridge this gap by creating a platform that puts students first,
                  ensuring every opportunity is verified, relevant, and accessible.
                </p>
                <p>
                  Today, we're proud to have helped thousands of students launch their careers while connecting hundreds
                  of companies with the next generation of talent.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-blue-100 mb-6">
                  To become the world's leading platform for student career development, making quality opportunities
                  accessible to every student, everywhere.
                </p>
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5" />
                  <span>Established 2023</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Our Values" subtitle="The principles that guide everything we do" />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Meet the Founder" subtitle="The visionary behind JobPortal" />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  {/* Profile Image */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-8 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl font-bold">AA</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{founder.name}</h3>
                      <p className="text-blue-100 mb-4">{founder.title}</p>
                      <div className="flex items-center justify-center gap-2 text-blue-100">
                        <MapPin className="w-4 h-4" />
                        {founder.location}
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-8">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{founder.bio}</p>

                    {/* Skills */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Skills & Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                      <Link href={founder.socialLinks.linkedin} target="_blank">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </Link>
                      <Link href={founder.socialLinks.github} target="_blank">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Github className="w-4 h-4" />
                          GitHub
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </Link>
                      <Link href={`mailto:${founder.socialLinks.email}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience & Education */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Experience */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experience
                  </h4>
                  <div className="space-y-4">
                    {founder.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-500 pl-4">
                        <h5 className="font-medium text-gray-900 dark:text-white">{exp.title}</h5>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{exp.company}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{exp.duration}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {founder.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Join thousands of students who have already found their dream careers through JobPortal.
            </p>
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  )
}
