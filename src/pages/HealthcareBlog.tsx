import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedFooter from "@/components/EnhancedFooter";

const HealthcareBlog = () => {
  const blogPosts = [
    {
      title: "The Future of AI in Healthcare",
      excerpt: "Exploring how artificial intelligence is revolutionizing patient care and medical diagnosis",
      author: "Dr. Arnav Gupta",
      date: "March 15, 2024",
      category: "Technology",
      readTime: "5 min read"
    },
    {
      title: "Understanding Medical Triage",
      excerpt: "A comprehensive guide to how medical triage works and its importance in healthcare",
      author: "Dr. Gourav Sharma",
      date: "March 10, 2024",
      category: "Healthcare",
      readTime: "4 min read"
    },
    {
      title: "Digital Health Trends 2024",
      excerpt: "The latest trends shaping the future of digital healthcare and patient experience",
      author: "Dr. Ankit Patel",
      date: "March 5, 2024",
      category: "Trends",
      readTime: "6 min read"
    },
    {
      title: "Patient Privacy in the Digital Age",
      excerpt: "How healthcare providers are protecting patient data in an increasingly connected world",
      author: "Dr. Abhang Singh",
      date: "February 28, 2024",
      category: "Privacy",
      readTime: "4 min read"
    },
    {
      title: "The Role of Machine Learning in Diagnosis",
      excerpt: "How machine learning algorithms are improving diagnostic accuracy and efficiency",
      author: "Dr. Arnav Kumar",
      date: "February 20, 2024",
      category: "Technology",
      readTime: "5 min read"
    },
    {
      title: "Telemedicine Best Practices",
      excerpt: "Essential guidelines for effective remote healthcare delivery",
      author: "Dr. Gourav Verma",
      date: "February 15, 2024",
      category: "Healthcare",
      readTime: "4 min read"
    }
  ];

  const categories = [
    "All",
    "Technology",
    "Healthcare",
    "Trends",
    "Privacy",
    "Research"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Healthcare Blog</CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Insights and updates from the world of healthcare technology
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Featured Post */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Featured Post</h2>
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>Technology</span>
                      <span>•</span>
                      <span>5 min read</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">The Future of AI in Healthcare</h3>
                    <p className="text-muted-foreground mb-4">
                      Artificial intelligence is transforming healthcare delivery, from diagnosis to treatment planning. Learn how AI is making healthcare more efficient and accessible.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                        <span className="text-sm">Dr. Arnav Gupta</span>
                      </div>
                      <span className="text-sm text-muted-foreground">March 15, 2024</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-6 flex items-center justify-center">
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Key Takeaways</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>AI's impact on diagnostic accuracy</li>
                        <li>Improving patient outcomes</li>
                        <li>Reducing healthcare costs</li>
                        <li>Future developments</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Categories */}
            <section>
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>

            {/* Blog Posts Grid */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                          <span className="text-sm">{post.author}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
                <p className="text-muted-foreground mb-6">
                  Stay updated with the latest insights in healthcare technology
                </p>
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#62d5d0]"
                  />
                  <button className="px-6 py-2 bg-[#62d5d0] text-white rounded-lg hover:bg-[#4db3ae] transition-colors">
                    Subscribe
                  </button>
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

export default HealthcareBlog; 