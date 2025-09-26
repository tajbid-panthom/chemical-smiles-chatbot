"use client";

import { useState } from "react";
import { Search, Beaker, Dna, Atom, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // TODO: Implement API call to backend
    console.log("Searching for:", query);
    
    // Simulate API processing and redirect to results page
    setTimeout(() => {
      // Redirect to results page with query parameter
      window.location.href = `/results?q=${encodeURIComponent(query)}`;
    }, 1500);
  };

  const features = [
    {
      icon: Beaker,
      title: "SMILES Generation",
      description: "Get accurate SMILES notation for any chemical compound"
    },
    {
      icon: Dna,
      title: "Molecular Structure",
      description: "Visualize 2D and 3D molecular structures instantly"
    },
    {
      icon: Atom,
      title: "Chemical Properties",
      description: "Access detailed molecular properties and characteristics"
    },
    {
      icon: Zap,
      title: "Fast & Accurate",
      description: "Lightning-fast responses powered by advanced AI"
    }
  ];

  const examples = [
    "What is the SMILES for caffeine?",
    "Show me the structure of aspirin",
    "Convert ethanol to SMILES notation",
    "What is the molecular formula of glucose?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              🧪 AI-Powered Chemical Assistant
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Chemical SMILES
              <span className="text-blue-600 dark:text-blue-400"> Chatbot</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ask questions about any chemical compound and instantly get SMILES representations, 
              molecular structures, and detailed chemical information powered by advanced AI.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto space-y-4">
            <Card className="p-6 shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Ask about any chemical compound... (e.g., 'What is the SMILES for caffeine?')"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 pr-4 py-6 text-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={!query.trim() || isLoading}
                  size="lg"
                  className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Search
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            </Card>

            {/* Example Queries */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Try these example queries:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(example)}
                    className="text-xs hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-16" />

        {/* Features Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Powerful Chemical Intelligence
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive chemical information and molecular insights
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <feature.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-16" />

        {/* About Section */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            About Chemical SMILES Chatbot
          </h2>
          <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              The Chemical SMILES Chatbot is an advanced AI-powered tool designed to bridge the gap between 
              natural language queries and chemical data. Whether you're a researcher, student, or chemistry 
              enthusiast, our platform makes it easy to access molecular information.
            </p>
            <p>
              Simply ask questions in plain English about any chemical compound, and receive instant SMILES 
              notation, molecular structures, chemical properties, and more. Our intelligent system understands 
              context and provides accurate, relevant information for your chemical research needs.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Badge variant="secondary" className="px-3 py-1">AI-Powered</Badge>
            <Badge variant="secondary" className="px-3 py-1">SMILES Generation</Badge>
            <Badge variant="secondary" className="px-3 py-1">Molecular Visualization</Badge>
            <Badge variant="secondary" className="px-3 py-1">Chemical Database</Badge>
            <Badge variant="secondary" className="px-3 py-1">Research Tool</Badge>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 Chemical SMILES Chatbot. Powered by advanced AI technology.
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Beaker className="h-4 w-4" />
              <span>Making chemistry accessible through AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
