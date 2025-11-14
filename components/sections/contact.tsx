import React from 'react'
import { Button } from '../ui/button'
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-muted/80 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white md:text-4xl">
                Get in Touch
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Have questions about our fiber plans or need support? Reach out and we’ll get back to you as soon as possible.
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Contact Info */}
            <div className="space-y-6">
                <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Contact Information
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Sierra Communications<br />
                    Montalban, Rizal, Philippines
                </p>
                </div>

                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p className='flex gap-2 items-center'>
                    <Phone className='h-5 w-5' /> <span>+63 912 345 6789</span>
                </p>
                <p className='flex gap-2 items-center'>
                    <Mail className='h-5 w-5' />
                    <a href="mailto:support@sierracommunications.ph" className="text-primary hover:underline">
                    support@sierracommunications.ph
                    </a>
                </p>
                <p className='flex gap-2 items-center'>
                    <MapPin className='h-5 w-5' /> <span className="font-medium"></span> Block 7 Lot 95 Double L Luma San Isidro Rodriguez Rizal
                </p>
                </div>
            </div>

            {/* Right: Contact Form */}
            <form className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                    </label>
                    <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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

  )
}

export default ContactSection