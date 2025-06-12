"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { SectionHeading } from "@/components/ui/section-heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  Code,
  Send,
  MessageCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

// Mock GitHub data - In a real app, you'd fetch this from GitHub API
const githubData = {
  login: "AbhimanyuAhuja12",
  name: "Abhimanyu Ahuja",
  bio: "Full Stack Developer | Building innovative web solutions",
  avatar_url: "/placeholder.svg?height=150&width=150",
  location: "India",
  email: "abhimanyuahuja12@gmail.com",
  public_repos: 40,
  followers: 15,
  following: 8,
  created_at: "2020-01-15T00:00:00Z",
  html_url: "https://github.com/AbhimanyuAhuja12",
  repositories: [
    {
      name: "job-portal",
      description: "A modern job portal connecting students with opportunities",
      language: "TypeScript",
      stars: 45,
      forks: 12,
      updated_at: "2024-01-15T00:00:00Z",
    },
    {
      name: "react-dashboard",
      description: "Modern React dashboard with TypeScript and Tailwind CSS",
      language: "JavaScript",
      stars: 32,
      forks: 8,
      updated_at: "2024-01-10T00:00:00Z",
    },
    {
      name: "Airline Booking System",
      description: "Microservice driven NodeJs based project",
      language: "TypeScript",
      stars: 28,
      forks: 6,
      updated_at: "2024-01-05T00:00:00Z",
    },
  ],
}

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "abhimanyuahuja12@gmail.com",
    href: "mailto:abhimanyuahuja12@gmail.com",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 8527950240",
    href: "tel:+918527950240",
    description: "Call us during business hours",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Delhi,India",
    href: "#",
    description: "Our headquarters",
  },
  {
    icon: MessageCircle,
    title: "Support",
    value: "24/7 Available",
    href: "#",
    description: "We're here to help",
  },
]

const socialLinks = [
  {
    icon: Github,
    name: "GitHub",
    href: "https://github.com/AbhimanyuAhuja12",
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/abhimanyu-ahuja12/",
    color: "hover:text-blue-600",
  },
  {
    icon: Twitter,
    name: "Twitter",
    href: "https://x.com/Abhii_Ahuja",
    color: "hover:text-blue-400",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [github] = useState(githubData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
    alert("Message sent successfully!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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
              Get in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions about JobPortal? Want to collaborate? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              animate: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{info.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{info.description}</p>
                    {info.href !== "#" ? (
                      <Link href={info.href} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        {info.value}
                      </Link>
                    ) : (
                      <p className="text-blue-600 dark:text-blue-400 font-medium">{info.value}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* GitHub Profile */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="w-6 h-6" />
                    GitHub Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      AA
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{github.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">@{github.login}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{github.bio}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {github.location}
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        Joined {formatDate(github.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{github.public_repos}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Repositories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{github.followers}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{github.following}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Following</div>
                    </div>
                  </div>

                  <Link href={github.html_url} target="_blank">
                    <Button variant="outline" className="w-full">
                      <Github className="mr-2 h-4 w-4" />
                      View GitHub Profile
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Popular Repositories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-6 h-6" />
                    Popular Repositories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {github.repositories.map((repo, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{repo.name}</h4>
                          <Badge variant="outline">{repo.language}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{repo.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {repo.stars}
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="w-4 h-4" />
                            {repo.forks}
                          </div>
                          <div>Updated {formatDate(repo.updated_at)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Connect with Us" subtitle="Follow us on social media for updates and insights" />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center gap-8"
          >
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                className={`flex flex-col items-center gap-2 p-6 rounded-lg border hover:shadow-lg transition-all ${social.color}`}
              >
                <social.icon className="w-8 h-8" />
                <span className="font-medium">{social.name}</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Frequently Asked Questions" subtitle="Quick answers to common questions" />

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How do I get started with JobPortal?",
                answer:
                  "Simply sign up for a free account, complete your profile, and start browsing opportunities that match your skills and interests.",
              },
              {
                question: "Is JobPortal free for students?",
                answer:
                  "Yes! JobPortal is completely free for students. We believe in making career opportunities accessible to everyone.",
              },
              {
                question: "How are job opportunities verified?",
                answer:
                  "All job postings go through our verification process and are approved by college administrators to ensure quality and legitimacy.",
              },
              {
                question: "Can I apply to jobs from different colleges?",
                answer:
                  "Currently, students can only apply to jobs posted by their own college to ensure relevance and proper coordination.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
