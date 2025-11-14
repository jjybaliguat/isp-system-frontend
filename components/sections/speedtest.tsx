import React from 'react'

const SpeedTestSection = () => {
  return (
    <section id='speedtest' className="py-16 md:py-24 bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-3xl font-semibold md:text-4xl text-gray-900 dark:text-white">
            Test Your Internet Speed
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
            Measure your current internet speed powered by OpenSpeedTest.
            </p>

            <div className="relative mt-10 w-full overflow-hidden rounded-2xl shadow-lg aspect-video min-h-[360px] bg-white dark:bg-gray-800">
            <iframe
                src="//openspeedtest.com/speedtest"
                className="absolute inset-0 h-full w-full border-none"
                allowFullScreen
            />
            </div>
{/* 
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Provided by{" "}
            <a
                href="https://openspeedtest.com"
                className="font-medium text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
            >
                OpenSpeedTest.com
            </a>
            </p> */}
        </div>
        </section>
  )
}

export default SpeedTestSection