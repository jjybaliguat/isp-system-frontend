import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <section className="py-20 bg-muted/40 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/"><Button variant="secondary" className="mb-4 cursor-pointer"><ArrowLeft /> Homepage</Button></Link>
        <h1 className="text-4xl font-semibold text-center mb-10 text-gray-900 dark:text-white">
          Terms and Conditions
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Please read these Terms and Conditions carefully before availing any
          service provided by <strong>SierraCommunications Services</strong>.
        </p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <div>
            <h2 className="font-semibold text-lg">1. Service Provision</h2>
            <p>
              SierraCommunications Services will provide a reliable and stable
              internet connection according to the subscriber&apos;s allocated
              bandwidth.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">2. Subscriber Responsibilities</h2>
            <p>
              Subscribers are responsible for providing access and clearance to
              allow duly authorized SierraCommunications Services personnel to
              enter and leave the subscriber&apos;s premises at reasonable hours, or
              as may be necessary, and subject to prior notice, for the purpose
              of installation and maintenance.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">3. Service Problems and Troubleshooting</h2>
            <p>
              In the event of a service problem, SierraCommunications Services will
              provide technicians in the area to ensure a quick response and
              restoration.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">4. Equipment Warranty</h2>
            <p>
              Availed or borrowed routers have a six (6) month warranty from the
              date of installation and activation. SierraCommunications Services is
              responsible for replacement in case of factory defects only.
              Warranty is void if damage is due to misuse or subscriber&apos;s fault.
              The company is not responsible for UTP wires after one (1) week
              from activation.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">5. Billing Commencement</h2>
            <p>
              Billing shall commence one (1) day after activation of the
              service.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">6. Payment Due Date</h2>
            <p>
              Subscribers must pay before the due date to avoid automatic
              downgrading of service.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">7. Promissory Notice</h2>
            <p>
              Subscribers are required to request a reasonable promissory note
              before the due date if unable to pay to avoid disconnection.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">8. Service Suspension</h2>
            <p>
              SierraCommunications Services may suspend service after two (2) days
              past the due date if the subscriber fails to pay their bill.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">9. Termination of Subscription</h2>
            <p>
              The subscriber may terminate their subscription by providing
              written or verbal notice one (1) month prior to cancellation, and
              by fully settling all outstanding obligations with THOMHOUSE
              PROJECT Services.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">10. No Lock-In Period</h2>
            <p>
              This service contract does not include any lock-in period.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">11. Modification of Terms</h2>
            <p>
              SierraCommunications Services reserves the right, at its discretion,
              to modify, delete, or add any of the terms and conditions of this
              agreement at any time. It is the subscriber&apos;s responsibility to
              regularly review these terms. Continued use of the service
              constitutes acceptance of any changes.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">12. Related Documents</h2>
            <p>
              The following documents form an integral part of this agreement
              between SierraCommunications Services and the subscriber.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">13. Conflict Resolution</h2>
            <p>
              In the event of any conflict in interpretation, these Terms and
              Conditions shall prevail over any other document.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} SierraCommunications Services. All rights
            reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
