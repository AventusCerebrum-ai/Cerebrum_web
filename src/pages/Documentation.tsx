import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedFooter from "@/components/EnhancedFooter";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="getting-started" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="api">API Reference</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* Getting Started Tab */}
              <TabsContent value="getting-started" className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                  <p className="text-muted-foreground mb-4">
                    Welcome to Cerebrum.ai's documentation. This guide will help you understand and effectively use our medical triage system.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Quick Start Guide</h2>
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">1. Account Setup</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                      <li>Create an account at cerebrum.ai</li>
                      <li>Verify your email address</li>
                      <li>Complete your medical profile</li>
                    </ol>

                    <h3 className="text-xl font-medium">2. First Analysis</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                      <li>Navigate to the Dashboard</li>
                      <li>Click "New Analysis"</li>
                      <li>Follow the guided process</li>
                      <li>Review your results</li>
                    </ol>
                  </div>
                </section>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">Multimodal Analysis</h3>
                        <p className="text-muted-foreground">
                          Process text, images, and behavioral data for comprehensive medical assessment.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">AI-Powered Triage</h3>
                        <p className="text-muted-foreground">
                          Advanced algorithms for accurate symptom assessment and prioritization.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">Doctor Connect</h3>
                        <p className="text-muted-foreground">
                          Seamless integration with healthcare professionals when needed.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">Medical History</h3>
                        <p className="text-muted-foreground">
                          Comprehensive tracking and management of your medical records.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </TabsContent>

              {/* API Reference Tab */}
              <TabsContent value="api" className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">API Overview</h2>
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">Authentication</h3>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                      <code>
                        {`Authorization: Bearer <your-api-key>
Content-Type: application/json`}
                      </code>
                    </pre>

                    <h3 className="text-xl font-medium">Endpoints</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Analysis Endpoint</h4>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                          <code>
                            {`POST /api/v1/analysis
Content-Type: multipart/form-data

{
  "symptoms": "string",
  "images": "file[]",
  "medical_history": "object"
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Security Measures</h2>
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">Data Protection</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>End-to-end encryption</li>
                      <li>HIPAA compliance</li>
                      <li>Regular security audits</li>
                      <li>Secure data centers</li>
                    </ul>

                    <h3 className="text-xl font-medium">Access Control</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Role-based access control</li>
                      <li>Two-factor authentication</li>
                      <li>Session management</li>
                      <li>Activity logging</li>
                    </ul>
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default Documentation; 