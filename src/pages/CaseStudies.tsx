import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedFooter from "@/components/EnhancedFooter";

const CaseStudies =   () => {
  const caseStudies = [
    {
      title: "Early Detection of Skin Conditions",
      description: "How Cerebrum.ai helped identify early signs of melanoma through image analysis",
      impact: "30% faster detection rate",
      details: "A study involving 1,000 patients showed that our AI system could identify potential skin conditions earlier than traditional methods, leading to better treatment outcomes.",
      image: "/case-studies/skin-detection.jpg"
    },
    {
      title: "Emergency Room Triage Optimization",
      description: "Implementing AI-powered triage in a busy urban hospital",
      impact: "40% reduction in wait times", 
      details: "By integrating Cerebrum.ai into their emergency room workflow, City General Hospital was able to significantly reduce patient wait times while maintaining accuracy in condition assessment.",
      image: "/case-studies/er-triage.jpg"
    },
    {
      title: "Rural Healthcare Access",
      description: "Bringing specialist-level care to remote communities",
      impact: "85% of patients received care within 24 hours",
      details: "In rural areas with limited access to specialists, Cerebrum.ai helped bridge the gap by providing initial assessments and connecting patients with appropriate care providers.",
      image: "/case-studies/rural-health.jpg"
    },
    {
      title: "Chronic Disease Management",
      description: "Improving outcomes for patients with chronic conditions",
      impact: "25% reduction in hospital readmissions",
      details: "Through continuous monitoring and AI-powered analysis, patients with chronic conditions experienced better management of their health and fewer complications.",
      image: "/case-studies/chronic-care.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Case Studies</CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Real-world examples of how Cerebrum.ai is transforming healthcare delivery
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Featured Case Study */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Featured Case Study</h2>
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Early Detection of Skin Conditions</h3>
                    <p className="text-muted-foreground mb-4">
                      Our AI system demonstrated remarkable accuracy in identifying early signs of skin conditions, leading to earlier intervention and better patient outcomes.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Impact:</span>
                        <span className="text-muted-foreground">30% faster detection rate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Study Size:</span>
                        <span className="text-muted-foreground">1,000 patients</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Duration:</span>
                        <span className="text-muted-foreground">6 months</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Key Results</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>95% accuracy in condition identification</li>
                        <li>Average detection time reduced by 2 weeks</li>
                        <li>Improved patient satisfaction scores</li>
                        <li>Cost savings in treatment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* All Case Studies */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">All Case Studies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseStudies.map((study, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{study.title}</h3>
                      <p className="text-muted-foreground mb-4">{study.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Impact:</span>
                          <span className="text-muted-foreground">{study.impact}</span>
                        </div>
                        <p className="text-muted-foreground">{study.details}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Methodology Section */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Methodology</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Data Collection</h3>
                  <p className="text-muted-foreground">
                    Rigorous data collection protocols ensuring privacy and accuracy
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Analysis</h3>
                  <p className="text-muted-foreground">
                    Comprehensive analysis using advanced AI algorithms
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Validation</h3>
                  <p className="text-muted-foreground">
                    Peer-reviewed validation of results and methodologies
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default CaseStudies; 