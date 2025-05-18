import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import EnhancedFooter from "@/components/EnhancedFooter";

const HelpCenter = () => {
  const faqItems = [
    {
      question: "How does Cerebrum.ai work?",
      answer: "Cerebrum.ai is an advanced medical triage system that uses AI to analyze your symptoms, medical history, and any images you provide. It helps assess your condition and provides personalized recommendations, connecting you with healthcare professionals when necessary."
    },
    {
      question: "Is my medical information secure?",
      answer: "Yes, we take data security very seriously. All information is encrypted, and we comply with HIPAA regulations to ensure your medical data remains private and secure."
    },
    {
      question: "How accurate is the AI diagnosis?",
      answer: "Our AI system is trained on extensive medical data and is continuously improving. However, it's important to note that it's designed to assist, not replace, professional medical advice. Always consult with healthcare professionals for final diagnoses."
    },
    {
      question: "What types of conditions can Cerebrum.ai help with?",
      answer: "Cerebrum.ai can help with a wide range of conditions, from common symptoms to more complex issues. The system is particularly effective at triaging conditions that can be assessed through visual and textual information."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy! Simply create an account, complete your medical profile, and you can begin using the system. You'll be guided through the process of providing information about your symptoms and any relevant images."
    },
    {
      question: "What happens after I submit my information?",
      answer: "After submission, our AI analyzes your information and provides an initial assessment. Based on the results, you'll receive personalized recommendations and, if necessary, be connected with appropriate healthcare professionals."
    }
  ];

  const contactInfo = {
    email: "support@cerebrum.ai",
    phone: "+1 (800) 123-4567",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM EST"
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Help Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Search Section */}
            <section className="text-center">
              <h2 className="text-2xl font-semibold mb-4">How can we help you?</h2>
              <div className="max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#62d5d0]"
                />
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Contact Section */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-muted-foreground">{contactInfo.email}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Phone</h3>
                  <p className="text-muted-foreground">{contactInfo.phone}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Hours</h3>
                  <p className="text-muted-foreground">{contactInfo.hours}</p>
                </div>
              </div>
            </section>

            {/* Quick Links */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Getting Started Guide</h3>
                    <p className="text-muted-foreground">Learn how to use Cerebrum.ai effectively</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Troubleshooting</h3>
                    <p className="text-muted-foreground">Common issues and their solutions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Privacy & Security</h3>
                    <p className="text-muted-foreground">Learn about our security measures</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Account Management</h3>
                    <p className="text-muted-foreground">Manage your account settings</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default HelpCenter; 