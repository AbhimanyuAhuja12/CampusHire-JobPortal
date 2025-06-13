"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/main-layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureCard } from "@/components/ui/feature-card";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { JobCard } from "@/components/ui/job-card";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  CheckCircle,
  Target,
  Shield,
  Zap,
  Globe,
  Users,
  Building2,
  Briefcase,
  Award,
  Rocket,
  Filter,
  MapPin,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const stats = [
  { icon: Users, label: "Active Students", value: "10,000+" },
  { icon: Building2, label: "Partner Colleges", value: "500+" },
  { icon: Briefcase, label: "Job Opportunities", value: "5,000+" },
  { icon: Award, label: "Success Rate", value: "95%" },
];

const features = [
  {
    icon: Target,
    title: "Smart Job Matching",
    description:
      "AI-powered algorithm matches students with relevant opportunities based on skills and preferences.",
  },
  {
    icon: Shield,
    title: "Verified Opportunities",
    description:
      "All job postings are verified by college administrators ensuring quality and legitimacy.",
  },
  {
    icon: Zap,
    title: "Instant Applications",
    description:
      "Apply to multiple jobs with one click using your pre-filled profile and resume.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Connect with opportunities from companies worldwide, including remote positions.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Computer Science Graduate",
    college: "MIT",
    content:
      "JobPortal helped me land my dream internship at Google. The platform made the application process so smooth!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Business Student",
    college: "Stanford University",
    content:
      "The quality of opportunities on JobPortal is exceptional. I found my current role through this platform.",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Engineering Student",
    college: "UC Berkeley",
    content:
      "Love how easy it is to track applications and get feedback. The interface is intuitive and modern.",
    rating: 5,
  },
];

const recentJobs = [
  {
    title: "Software Engineer Intern",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Internship",
    salary: "$8,000/month",
  },
  {
    title: "Data Science Analyst",
    company: "DataFlow Inc",
    location: "Remote",
    type: "Full-time",
    salary: "$95,000/year",
  },
  {
    title: "UX Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Part-time",
    salary: "$45/hour",
  },
];

export default function LandingPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
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
                <Rocket className="w-4 h-4" />
                Launch Your Career Today
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Connect with Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dream Career
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                The premier job portal connecting talented students with top
                employers. Discover opportunities, build your future, and launch
                your career with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a
                  href="https://www.loom.com/share/2e979a609cd4416a838f87e7c26545cd?sid=a4231bdd-bd42-4b77-a1e9-81fa91949596"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-lg px-8 py-3 cursor-pointer"
                  >
                    Watch Demo
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free to join
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Verified opportunities
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Instant applications
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
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Search className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Search for your dream job...
                    </span>
                  </div>

                  {recentJobs.map((job, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {job.company}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <span className="font-medium text-green-600">
                          {job.salary}
                        </span>
                      </div>
                    </motion.div>
                  ))}
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

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose JobPortal?"
            subtitle="We've built the most comprehensive platform to help students find their perfect career match"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Job Search Preview */}
      <section id="jobs" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Discover Amazing Opportunities"
            subtitle="Browse through thousands of verified job opportunities from top companies"
          />

          <div className="max-w-md mx-auto relative mb-12">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search jobs, companies, or skills..."
              className="pl-10 h-12 text-lg"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by Location
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by Job Type
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by Industry
            </Button>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {recentJobs.map((job, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <JobCard
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  type={job.type}
                  salary={job.salary}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                View All Jobs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What Students Say"
            subtitle="Join thousands of successful students who found their dream careers through JobPortal"
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
                <TestimonialCard
                  content={testimonial.content}
                  name={testimonial.name}
                  role={testimonial.role}
                  college={testimonial.college}
                  rating={testimonial.rating}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Launch Your Career?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Join thousands of students who have already found their dream
              jobs. Your perfect opportunity is waiting for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
