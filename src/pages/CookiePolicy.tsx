import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedFooter from "@/components/EnhancedFooter";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience and enable certain features to function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We use cookies for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Essential cookies for website functionality</li>
                  <li>Authentication and security</li>
                  <li>Preferences and settings</li>
                  <li>Analytics and performance</li>
                  <li>User experience improvements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">3.1 Essential Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
                </p>

                <h3 className="text-xl font-medium">3.2 Performance Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>

                <h3 className="text-xl font-medium">3.3 Functionality Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
              <p className="text-muted-foreground">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience using our website. To learn more about cookies and how to manage them, visit www.aboutcookies.org.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                Some cookies are placed by third-party services that appear on our pages. We use trusted third-party services that track this information on our behalf.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our Cookie Policy, please contact us at:
                <br />
                Email: privacy@cerebrum.ai
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

export default CookiePolicy; 