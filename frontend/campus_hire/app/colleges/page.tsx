"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { SectionHeading } from "@/components/ui/section-heading"
import { FeatureCard } from "@/components/ui/feature-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Users,
  BarChart3,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Building2,
  Briefcase,
  TrendingUp,
  Clock,
  Star,
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

const features = [
  {
    icon: Users,
    title: "Student Management",
    description: "Easily manage student registrations, approvals, and track their application progress.",
  },
  {
    icon: Briefcase,
    title: "Job Posting",
    description: "Post verified job opportunities and internships directly to your students.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Get insights into placement rates, popular skills, and student engagement metrics.",
  },
  {
    icon: Shield,
    title: "Quality Control",
    description: "Maintain high standards with our verification system for all job postings.",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description: "Keep students informed about new opportunities and application updates in real-time.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect your students with opportunities from companies worldwide.",
  },
]

const benefits = [
  {
    title: "Increased Placement Rates",
    description: "Colleges using JobPortal see an average 40% increase in student placement rates.",
    stat: "40%",
    icon: TrendingUp,
  },
  {
    title: "Time Savings",
    description: "Reduce administrative overhead by 60% with our automated application management.",
    stat: "60%",
    icon: Clock,
  },
  {
    title: "Student Satisfaction",
    description: "95% of students report higher satisfaction with career services through our platform.",
    stat: "95%",
    icon: Star,
  },
  {
    title: "Employer Partnerships",
    description: "Access to our network of 1000+ verified employers actively seeking talent.",
    stat: "1000+",
    icon: Building2,
  },
]

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Dean of Career Services",
    college: "Tech University",
    content:
      "JobPortal has transformed how we connect our students with career opportunities. The platform is intuitive and our placement rates have increased significantly.",
    rating: 5,
  },
  {
    name: "Prof. Michael Chen",
    role: "Head of Placement Cell",
    college: "Engineering College",
    content:
      "The analytics and reporting features help us understand our students' career preferences better and tailor our programs accordingly.",
    rating: 5,
  },
  {
    name: "Dr. Emily Davis",
    role: "Career Counselor",
    college: "Business School",
    content:
      "Our students love the user-friendly interface and the quality of opportunities available. It's made our job much easier.",
    rating: 5,
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for small colleges getting started",
    features: ["Up to 100 students", "Basic job posting", "Email support", "Standard analytics", "Mobile app access"],
    popular: false,
  },
  {
    name: "Professional",
    price: "$99/month",
    description: "Ideal for medium-sized institutions",
    features: [
      "Up to 1,000 students",
      "Advanced job posting",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large universities and college networks",
    features: [
      "Unlimited students",
      "White-label solution",
      "Dedicated support",
      "Custom integrations",
      "Advanced reporting",
      "Training & onboarding",
    ],
    popular: false,
  },
]

export default function CollegesPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Building2 className="w-4 h-4" />
                For Educational Institutions
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Empower Your Students with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Career Success
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Join hundreds of colleges using JobPortal to boost student placement rates, streamline career services,
                and connect students with top employers worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-3">
                  Schedule Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free for small colleges
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Setup in minutes
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  24/7 support
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500 ml-2">College Admin Dashboard</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">250</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Active Students</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">45</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Job Postings</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">89%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Placement Rate</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          SE
                        </div>
                        <div>
                          <div className="font-medium text-sm">Software Engineer Intern</div>
                          <div className="text-xs text-gray-500">TechCorp • 12 applications</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          DA
                        </div>
                        <div>
                          <div className="font-medium text-sm">Data Analyst</div>
                          <div className="text-xs text-gray-500">DataFlow • 8 applications</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Why Colleges Choose JobPortal" subtitle="Proven results that speak for themselves" />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{benefit.stat}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Comprehensive Platform Features"
            subtitle="Everything you need to manage student careers in one place"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What College Administrators Say"
            subtitle="Hear from institutions already transforming their career services"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {testimonial.role} • {testimonial.college}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Simple, Transparent Pricing"
            subtitle="Choose the plan that fits your institution's needs"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className={`h-full relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mt-4">{plan.price}</div>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full mt-6 ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Career Services?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Join hundreds of colleges already using JobPortal to boost student success and streamline career services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  )
}
