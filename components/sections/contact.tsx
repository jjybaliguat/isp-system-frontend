"use client"

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

interface FormDataProps {
  fullName: string
  email: string
  message: string
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    fullName: "",
    email: "",
    message: ""
  })

  const handleSendMessage = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <section id="contact" className="py-24 bg-muted/50 dark:bg-background transition-colors">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
            Get in Touch
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have questions about our fiber plans, need technical support, or want to discuss enterprise solutions? 
            Contact us and we’ll get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left – Contact Info */}
          <div className="space-y-8">
            {/* Info Card */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sierra Communications<br />
                Montalban, Rizal, Philippines
              </p>

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-medium">+63 912 345 6789</span>
                </p>

                <p className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a
                    href="mailto:support@sierracommunications.ph"
                    className="text-primary hover:underline font-medium"
                  >
                    support@sierracommunications.ph
                  </a>
                </p>

                <p className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-1 text-primary" />
                  <span className="font-medium">
                    Block 7 Lot 95, Double L, Luma San Isidro, Rodriguez, Rizal
                  </span>
                </p>

                <p className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Mon – Sat: 8:00 AM – 5:00 PM</span>
                </p>
              </div>
            </div>

            {/* Optional Map Placeholder */}
            <div className="h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <iframe
                title="Sierra Communications Location"
                src="https://maps.google.com/maps?q=Montalban,%20Rizal&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Right – Contact Form */}
          <form onSubmit={handleSendMessage} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 space-y-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Send Us a Message
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Fill out the form below and we&apos;ll respond within 24 hours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e)=> setFormData({...formData, fullName: e.target.value})}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e)=> setFormData({...formData, email: e.target.value})}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e)=>setFormData({...formData, message: e.target.value})}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
