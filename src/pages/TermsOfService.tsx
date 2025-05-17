import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedFooter from "@/components/EnhancedFooter";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Cerebrum.ai's medical triage system, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Permission is granted to temporarily use Cerebrum.ai for personal, non-commercial medical triage purposes. This license does not include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Modifying or copying the materials</li>
                  <li>Using the materials for commercial purposes</li>
                  <li>Attempting to reverse engineer any software</li>
                  <li>Removing any copyright or proprietary notations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Medical Disclaimer</h2>
              <p className="text-muted-foreground">
                Cerebrum.ai is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  As a user of Cerebrum.ai, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account</li>
                  <li>Use the service in compliance with all applicable laws</li>
                  <li>Not misuse or abuse the service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall Cerebrum.ai be liable for any damages arising out of the use or inability to use the materials on our service, even if we have been notified of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Revisions and Errata</h2>
              <p className="text-muted-foreground">
                The materials appearing on Cerebrum.ai could include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Cerebrum.ai operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@cerebrum.ai
                <br />
                Phone: +1 (800) 123-4567
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default TermsOfService; 