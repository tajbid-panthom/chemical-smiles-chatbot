"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChemicalResults from "@/components/ChemicalResults";
import Link from "next/link";

interface BondAnalysis {
  bondType: string;
  count: number;
  percentage: number;
  averageDistance?: number;
  averageAngle?: number;
  distances?: number[];
  angles?: number[];
}

interface ChemicalResult {
  isDetected: boolean;
  compound: string;
  description: string;
  smiles: string;
  molecularFormula: string;
  molecularWeight: number;
  structure2D?: string;
  structure3D?: string;
  bondAnalysis: BondAnalysis[];
  properties?: {
    logP?: number;
    polarSurfaceArea?: number;
    rotorBonds?: number;
    hBondDonors?: number;
    hBondAcceptors?: number;
  };
  moleculeInfo?: {
    atomCount: number;
    bondCount: number;
    ringCount: number;
    aromaticRings: number;
    heavyAtomCount: number;
    formalCharge: number;
  };
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<ChemicalResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      // Simulate API call with enhanced mock data
      setTimeout(() => {
        const mockResult: ChemicalResult = {
          isDetected: query.toLowerCase().includes("benzene") || query.toLowerCase().includes("caffeine") || query.toLowerCase().includes("aspirin"),
          compound: query.toLowerCase().includes("benzene") ? "Benzene" : 
                   query.toLowerCase().includes("caffeine") ? "Caffeine" :
                   query.toLowerCase().includes("aspirin") ? "Aspirin" : "Unknown",
          description: query.toLowerCase().includes("benzene") ? 
            "Benzene is a colorless, highly flammable liquid with a sweet odor. It is a fundamental aromatic hydrocarbon and an important industrial solvent and precursor in the production of drugs, plastics, synthetic rubber, and dyes." :
            query.toLowerCase().includes("caffeine") ?
            "Caffeine is a central nervous system stimulant and the world's most widely consumed psychoactive drug. It is found naturally in coffee beans, tea leaves, and cacao beans." :
            query.toLowerCase().includes("aspirin") ?
            "Aspirin, also known as acetylsalicylic acid, is a medication used to reduce pain, fever, or inflammation. It is also used as an antiplatelet agent to reduce the risk of heart attacks and strokes." :
            "Chemical compound information not available.",
          smiles: query.toLowerCase().includes("benzene") ? "c1ccccc1" :
                 query.toLowerCase().includes("caffeine") ? "CN1C=NC2=C1C(=O)N(C(=O)N2C)C" :
                 query.toLowerCase().includes("aspirin") ? "CC(=O)OC1=CC=CC=C1C(=O)O" : "",
          molecularFormula: query.toLowerCase().includes("benzene") ? "C₆H₆" :
                           query.toLowerCase().includes("caffeine") ? "C₈H₁₀N₄O₂" :
                           query.toLowerCase().includes("aspirin") ? "C₉H₈O₄" : "",
          molecularWeight: query.toLowerCase().includes("benzene") ? 78.11 :
                          query.toLowerCase().includes("caffeine") ? 194.19 :
                          query.toLowerCase().includes("aspirin") ? 180.16 : 0,
          bondAnalysis: query.toLowerCase().includes("benzene") ? [
            { 
              bondType: "C-C Aromatic", 
              count: 6, 
              percentage: 50.0,
              averageDistance: 1.39,
              averageAngle: 120.0,
              distances: [1.39, 1.39, 1.39, 1.39, 1.39, 1.39],
              angles: [120.0, 120.0, 120.0, 120.0, 120.0, 120.0]
            },
            { 
              bondType: "C-H", 
              count: 6, 
              percentage: 50.0,
              averageDistance: 1.08,
              averageAngle: 120.0,
              distances: [1.08, 1.08, 1.08, 1.08, 1.08, 1.08],
              angles: [120.0, 120.0, 120.0, 120.0, 120.0, 120.0]
            }
          ] : query.toLowerCase().includes("caffeine") ? [
            { 
              bondType: "C-C", 
              count: 4, 
              percentage: 19.0,
              averageDistance: 1.52,
              averageAngle: 109.5,
              distances: [1.52, 1.53, 1.51, 1.52],
              angles: [109.2, 110.1, 108.9, 109.8]
            },
            { 
              bondType: "C-N", 
              count: 8, 
              percentage: 38.1,
              averageDistance: 1.47,
              averageAngle: 119.5,
              distances: [1.47, 1.46, 1.48, 1.47, 1.46, 1.47, 1.48, 1.46],
              angles: [119.2, 120.1, 118.9, 119.8, 119.3, 119.7, 119.1, 120.2]
            },
            { 
              bondType: "C=O", 
              count: 2, 
              percentage: 9.5,
              averageDistance: 1.23,
              averageAngle: 120.0,
              distances: [1.23, 1.23],
              angles: [120.0, 120.0]
            },
            { 
              bondType: "C-H", 
              count: 10, 
              percentage: 23.8,
              averageDistance: 1.09,
              averageAngle: 109.5,
              distances: [1.09, 1.09, 1.09, 1.09, 1.09, 1.09, 1.09, 1.09, 1.09, 1.09],
              angles: [109.5, 109.5, 109.5, 109.5, 109.5, 109.5, 109.5, 109.5, 109.5, 109.5]
            },
            { 
              bondType: "C=N", 
              count: 2, 
              percentage: 9.5,
              averageDistance: 1.32,
              averageAngle: 120.0,
              distances: [1.32, 1.32],
              angles: [120.0, 120.0]
            }
          ] : [
            { 
              bondType: "C-C", 
              count: 3, 
              percentage: 20.0,
              averageDistance: 1.52,
              averageAngle: 120.0,
              distances: [1.52, 1.53, 1.51],
              angles: [120.1, 119.8, 120.2]
            },
            { 
              bondType: "C=C", 
              count: 6, 
              percentage: 40.0,
              averageDistance: 1.39,
              averageAngle: 120.0,
              distances: [1.39, 1.39, 1.39, 1.39, 1.39, 1.39],
              angles: [120.0, 120.0, 120.0, 120.0, 120.0, 120.0]
            },
            { 
              bondType: "C-O", 
              count: 3, 
              percentage: 20.0,
              averageDistance: 1.43,
              averageAngle: 109.5,
              distances: [1.43, 1.44, 1.42],
              angles: [109.2, 109.8, 109.3]
            },
            { 
              bondType: "C=O", 
              count: 2, 
              percentage: 13.3,
              averageDistance: 1.23,
              averageAngle: 120.0,
              distances: [1.23, 1.23],
              angles: [120.0, 120.0]
            },
            { 
              bondType: "O-H", 
              count: 1, 
              percentage: 6.7,
              averageDistance: 0.96,
              averageAngle: 104.5,
              distances: [0.96],
              angles: [104.5]
            }
          ],
          properties: {
            logP: query.toLowerCase().includes("benzene") ? 2.13 :
                 query.toLowerCase().includes("caffeine") ? -0.07 :
                 query.toLowerCase().includes("aspirin") ? 1.19 : undefined,
            polarSurfaceArea: query.toLowerCase().includes("benzene") ? 0 :
                             query.toLowerCase().includes("caffeine") ? 58.44 :
                             query.toLowerCase().includes("aspirin") ? 63.6 : undefined,
            rotorBonds: query.toLowerCase().includes("benzene") ? 0 :
                       query.toLowerCase().includes("caffeine") ? 0 :
                       query.toLowerCase().includes("aspirin") ? 3 : undefined,
            hBondDonors: query.toLowerCase().includes("benzene") ? 0 :
                        query.toLowerCase().includes("caffeine") ? 0 :
                        query.toLowerCase().includes("aspirin") ? 1 : undefined,
            hBondAcceptors: query.toLowerCase().includes("benzene") ? 0 :
                           query.toLowerCase().includes("caffeine") ? 6 :
                           query.toLowerCase().includes("aspirin") ? 4 : undefined
          },
          moleculeInfo: {
            atomCount: query.toLowerCase().includes("benzene") ? 12 :
                      query.toLowerCase().includes("caffeine") ? 24 :
                      query.toLowerCase().includes("aspirin") ? 21 : 0,
            bondCount: query.toLowerCase().includes("benzene") ? 12 :
                      query.toLowerCase().includes("caffeine") ? 25 :
                      query.toLowerCase().includes("aspirin") ? 21 : 0,
            ringCount: query.toLowerCase().includes("benzene") ? 1 :
                      query.toLowerCase().includes("caffeine") ? 2 :
                      query.toLowerCase().includes("aspirin") ? 1 : 0,
            aromaticRings: query.toLowerCase().includes("benzene") ? 1 :
                          query.toLowerCase().includes("caffeine") ? 2 :
                          query.toLowerCase().includes("aspirin") ? 1 : 0,
            heavyAtomCount: query.toLowerCase().includes("benzene") ? 6 :
                           query.toLowerCase().includes("caffeine") ? 14 :
                           query.toLowerCase().includes("aspirin") ? 13 : 0,
            formalCharge: 0
          }
        };

        setResults(mockResult);
        setIsLoading(false);
      }, 1500);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Search
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Chemical Analysis Results</span>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              Query: "{query}"
            </Badge>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="container mx-auto px-4 py-8">
        <ChemicalResults 
          results={results} 
          isLoading={isLoading} 
          query={query}
          isFullPage={true}
        />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading results...</span>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}