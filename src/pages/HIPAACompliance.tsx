import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedFooter from "@/components/EnhancedFooter";

const HIPAACompliance = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">HIPAA Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Our Commitment to HIPAA Compliance</h2>
              <p className="text-muted-foreground">
                Cerebrum.ai is committed to maintaining the privacy and security of protected health information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA) regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Security Measures</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">2.1 Technical Safeguards</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security assessments and audits</li>
                  <li>Automatic logoff and session management</li>
                  <li>Emergency access procedures</li>
                </ul>

                <h3 className="text-xl font-medium">2.2 Physical Safeguards</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Secure data center facilities</li>
                  <li>Access control and monitoring</li>
                  <li>Workstation security</li>
                  <li>Device and media controls</li>
                </ul>

                <h3 className="text-xl font-medium">2.3 Administrative Safeguards</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Security management processes</li>
                  <li>Assigned security responsibility</li>
                  <li>Workforce security</li>
                  <li>Information access management</li>
                  <li>Security awareness and training</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Privacy Practices</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We maintain strict privacy practices in accordance with HIPAA requirements:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Notice of Privacy Practices</li>
                  <li>Individual rights regarding PHI</li>
                  <li>Uses and disclosures of PHI</li>
                  <li>Minimum necessary standard</li>
                  <li>Business associate agreements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Breach Notification</h2>
              <p className="text-muted-foreground">
                In the event of a breach of unsecured PHI, we will notify affected individuals, the Department of Health and Human Services, and in some cases, the media, in accordance with HIPAA breach notification requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Training and Compliance</h2>
              <p className="text-muted-foreground">
                All employees and contractors receive regular training on HIPAA requirements and our privacy and security policies. We conduct regular audits and assessments to ensure ongoing compliance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Under HIPAA, you have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access your medical records</li>
                  <li>Request corrections to your records</li>
                  <li>Receive an accounting of disclosures</li>
                  <li>Request restrictions on certain uses and disclosures</li>
                  <li>Receive confidential communications</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about our HIPAA compliance or to exercise your rights, please contact our Privacy Officer:
                <br />
                Email: privacy@cerebrum.ai
                <br />
                Phone: +1 (800) 123-4567
                <br />
                Address: [Your Business Address]
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default HIPAACompliance; 