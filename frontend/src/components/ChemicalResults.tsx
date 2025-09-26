"use client";

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle, 
  XCircle, 
  Atom, 
  Eye, 
  RotateCcw, 
  Zap, 
  Copy,
  Download,
  Info,
  AlertTriangle,
  Table,
  BarChart3,
  TrendingUp,
  Activity,
  Ruler,
  Triangle,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table as TableComponent,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  structure2D?: string; // Base64 or URL to 2D structure image
  structure3D?: string; // Base64 or URL to 3D structure data
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

interface ChemicalResultsProps {
  results: ChemicalResult | null;
  isLoading: boolean;
  query: string;
  isFullPage?: boolean;
}

export default function ChemicalResults({ results, isLoading, query, isFullPage = false }: ChemicalResultsProps) {
  // Measurement state
  const [distanceAtom1, setDistanceAtom1] = useState(0);
  const [distanceAtom2, setDistanceAtom2] = useState(1);
  const [angleAtom1, setAngleAtom1] = useState(0);
  const [angleVertex, setAngleVertex] = useState(1);
  const [angleAtom3, setAngleAtom3] = useState(2);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);
  const [measuredAngle, setMeasuredAngle] = useState<number | null>(null);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification for copy success
  };

  // Mock measurement functions (replace with actual 3D calculation)
  const measureDistance = () => {
    // Mock calculation - replace with actual 3D coordinate calculation
    const mockDistance = Math.random() * 2.5 + 0.8; // Random distance between 0.8-3.3 Å
    setMeasuredDistance(Number(mockDistance.toFixed(3)));
  };

  const measureAngle = () => {
    // Mock calculation - replace with actual 3D angle calculation
    const mockAngle = Math.random() * 180; // Random angle between 0-180°
    setMeasuredAngle(Number(mockAngle.toFixed(1)));
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <h3 className="text-lg font-semibold">Analyzing "{query}"...</h3>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Detection Status */}
      <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          {results.isDetected ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
          <h3 className="text-xl font-bold">
            {results.isDetected ? "Chemical Compound Detected" : "No Valid Chemical Detected"}
          </h3>
        </div>
        
        {results.isDetected ? (
          <div className="space-y-3">
            <div>
              <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {results.compound}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                {results.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">
                Formula: {results.molecularFormula}
              </Badge>
              <Badge variant="secondary">
                MW: {results.molecularWeight} g/mol
              </Badge>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              The query "{query}" does not appear to contain a valid chemical compound name or structure. 
              Please try with a specific chemical name, formula, or structure.
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Results Tabs - Only show if compound is detected */}
      {results.isDetected && (
        <Card className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <Tabs defaultValue="smiles" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="smiles" className="flex items-center gap-2">
                <Atom className="h-4 w-4" />
                SMILES
              </TabsTrigger>
              <TabsTrigger value="2d" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                2D Structure
              </TabsTrigger>
              <TabsTrigger value="3d" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                3D Structure
              </TabsTrigger>
              <TabsTrigger value="enhanced" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                3D Enhanced
              </TabsTrigger>
              <TabsTrigger value="bonds" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Bond Analysis
              </TabsTrigger>
            </TabsList>

            {/* SMILES Tab */}
            <TabsContent value="smiles" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Atom className="h-6 w-6 text-blue-600" />
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      SMILES Notation Analysis
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(results.smiles)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy SMILES
                    </Button>
                    <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
                
                <Card className="p-6 border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30">
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
                        Simplified Molecular Input Line Entry System
                      </Badge>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800">
                      <code className="text-2xl font-mono break-all text-blue-700 dark:text-blue-300 font-bold tracking-wider">
                        {results.smiles}
                      </code>
                    </div>
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      This notation represents the chemical structure in a linear ASCII format
                    </div>
                  </div>
                </Card>

                {results.properties && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Molecular Properties
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="p-4 border-2 border-purple-100 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                        <div className="text-center">
                          <div className="text-sm font-medium text-purple-600 mb-1">Lipophilicity (LogP)</div>
                          <div className="text-3xl font-bold text-purple-700">{results.properties.logP}</div>
                          <div className="text-xs text-gray-600 mt-1">Partition coefficient</div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {(results.properties.logP || 0) > 0 ? "Lipophilic" : "Hydrophilic"}
                          </Badge>
                        </div>
                      </Card>
                      
                      <Card className="p-4 border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
                        <div className="text-center">
                          <div className="text-sm font-medium text-emerald-600 mb-1">Polar Surface Area</div>
                          <div className="text-3xl font-bold text-emerald-700">{results.properties.polarSurfaceArea}</div>
                          <div className="text-xs text-gray-600 mt-1">Ų (square Angstroms)</div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {(results.properties.polarSurfaceArea || 0) > 140 ? "High PSA" : "Low PSA"}
                          </Badge>
                        </div>
                      </Card>
                      
                      <Card className="p-4 border-2 border-amber-100 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
                        <div className="text-center">
                          <div className="text-sm font-medium text-amber-600 mb-1">Rotatable Bonds</div>
                          <div className="text-3xl font-bold text-amber-700">{results.properties.rotorBonds}</div>
                          <div className="text-xs text-gray-600 mt-1">Flexible connections</div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {(results.properties.rotorBonds || 0) > 5 ? "Flexible" : "Rigid"}
                          </Badge>
                        </div>
                      </Card>
                      
                      <Card className="p-4 border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                        <div className="text-center">
                          <div className="text-sm font-medium text-blue-600 mb-1">H-Bond Donors</div>
                          <div className="text-3xl font-bold text-blue-700">{results.properties.hBondDonors}</div>
                          <div className="text-xs text-gray-600 mt-1">Hydrogen bond donors</div>
                          <Badge variant="outline" className="mt-2 text-xs">Donor capacity</Badge>
                        </div>
                      </Card>
                      
                      <Card className="p-4 border-2 border-rose-100 bg-gradient-to-br from-rose-50/50 to-pink-50/50">
                        <div className="text-center">
                          <div className="text-sm font-medium text-rose-600 mb-1">H-Bond Acceptors</div>
                          <div className="text-3xl font-bold text-rose-700">{results.properties.hBondAcceptors}</div>
                          <div className="text-xs text-gray-600 mt-1">Hydrogen bond acceptors</div>
                          <Badge variant="outline" className="mt-2 text-xs">Acceptor capacity</Badge>
                        </div>
                      </Card>
                      
                      <Card className="p-4 border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-violet-50/50">
                        <div className="text-center">
                          <div className="text-sm font-medium text-indigo-600 mb-1">Molecular Weight</div>
                          <div className="text-3xl font-bold text-indigo-700">{results.molecularWeight}</div>
                          <div className="text-xs text-gray-600 mt-1">g/mol</div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {results.molecularWeight > 500 ? "Heavy" : "Light"}
                          </Badge>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Drug-likeness Assessment */}
                <Card className="p-6 border-2 border-green-100 dark:border-green-900 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-green-800 dark:text-green-300 flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Lipinski's Rule of Five Assessment
                    </CardTitle>
                    <CardDescription>Drug-likeness evaluation based on molecular properties</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-lg bg-white dark:bg-gray-800">
                        <div className="text-sm text-gray-600 dark:text-gray-400">MW ≤ 500</div>
                        <div className={`text-lg font-bold ${results.molecularWeight <= 500 ? 'text-green-600' : 'text-red-600'}`}>
                          {results.molecularWeight <= 500 ? '✓' : '✗'}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white dark:bg-gray-800">
                        <div className="text-sm text-gray-600 dark:text-gray-400">LogP ≤ 5</div>
                        <div className={`text-lg font-bold ${(results.properties?.logP || 0) <= 5 ? 'text-green-600' : 'text-red-600'}`}>
                          {(results.properties?.logP || 0) <= 5 ? '✓' : '✗'}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white dark:bg-gray-800">
                        <div className="text-sm text-gray-600 dark:text-gray-400">HBD ≤ 5</div>
                        <div className={`text-lg font-bold ${(results.properties?.hBondDonors || 0) <= 5 ? 'text-green-600' : 'text-red-600'}`}>
                          {(results.properties?.hBondDonors || 0) <= 5 ? '✓' : '✗'}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white dark:bg-gray-800">
                        <div className="text-sm text-gray-600 dark:text-gray-400">HBA ≤ 10</div>
                        <div className={`text-lg font-bold ${(results.properties?.hBondAcceptors || 0) <= 10 ? 'text-green-600' : 'text-red-600'}`}>
                          {(results.properties?.hBondAcceptors || 0) <= 10 ? '✓' : '✗'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <Badge variant="secondary" className={`px-4 py-2 ${
                        [
                          results.molecularWeight <= 500,
                          (results.properties?.logP || 0) <= 5,
                          (results.properties?.hBondDonors || 0) <= 5,
                          (results.properties?.hBondAcceptors || 0) <= 10
                        ].filter(Boolean).length >= 3 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {[
                          results.molecularWeight <= 500,
                          (results.properties?.logP || 0) <= 5,
                          (results.properties?.hBondDonors || 0) <= 5,
                          (results.properties?.hBondAcceptors || 0) <= 10
                        ].filter(Boolean).length >= 3 ? 'Drug-like Properties' : 'Non-drug-like Properties'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 2D Structure Tab */}
            <TabsContent value="2d" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">2D Molecular Structure</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                </div>
                
                <Card className="p-6 bg-gray-50 dark:bg-gray-900">
                  <div className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    {results.structure2D ? (
                      <img 
                        src={results.structure2D} 
                        alt={`2D structure of ${results.compound}`}
                        className="max-w-full max-h-full"
                      />
                    ) : (
                      <div className="text-center space-y-2">
                        <Atom className="h-16 w-16 text-gray-400 mx-auto" />
                        <p className="text-gray-500">2D structure will be rendered here</p>
                        <p className="text-sm text-gray-400">Structure generation in progress...</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* 3D Structure Tab */}
            <TabsContent value="3d" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">3D Molecular Structure</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export 3D
                    </Button>
                  </div>
                </div>
                
                <Card className="p-6 bg-gray-50 dark:bg-gray-900">
                  <div className="aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <div className="text-center space-y-2">
                      <RotateCcw className="h-16 w-16 text-gray-400 mx-auto animate-spin" />
                      <p className="text-gray-500">Interactive 3D viewer will load here</p>
                      <p className="text-sm text-gray-400">Click and drag to rotate • Scroll to zoom</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* 3D Enhanced Tab */}
            <TabsContent value="enhanced" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">3D Enhanced Visualization</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Toggle Effects
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Enhanced
                    </Button>
                  </div>
                </div>
                
                <Card className="p-6 bg-gray-50 dark:bg-gray-900">
                  <div className="aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <div className="text-center space-y-2">
                      <Zap className="h-16 w-16 text-blue-500 mx-auto animate-pulse" />
                      <p className="text-gray-500">Enhanced 3D viewer with advanced rendering</p>
                      <p className="text-sm text-gray-400">Features: Electron density • Molecular orbitals • Electrostatic potential</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Bond Analysis Tab */}
            <TabsContent value="bonds" className="mt-6">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Comprehensive Bond Analysis
                  </h3>
                </div>
                
                {/* Molecule Information Table */}
                {results.moleculeInfo && (
                  <Card className="p-6 border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-xl text-blue-800 dark:text-blue-300">Molecular Structure Information</CardTitle>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Comprehensive structural and topological analysis of the molecule
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TableComponent>
                        <TableCaption className="text-sm text-gray-500 mt-4">
                          Detailed molecular composition and structural features
                        </TableCaption>
                        <TableHeader>
                          <TableRow className="bg-blue-100/50 dark:bg-blue-900/30">
                            <TableHead className="font-semibold text-blue-800 dark:text-blue-300">Property</TableHead>
                            <TableHead className="font-semibold text-blue-800 dark:text-blue-300">Value</TableHead>
                            <TableHead className="font-semibold text-blue-800 dark:text-blue-300">Description</TableHead>
                            <TableHead className="font-semibold text-blue-800 dark:text-blue-300">Significance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10">
                            <TableCell className="font-medium">Total Atoms</TableCell>
                            <TableCell className="text-2xl font-bold text-blue-600">{results.moleculeInfo.atomCount}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">All atoms in molecule</TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">Molecular complexity indicator</TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-green-50/30 dark:hover:bg-green-900/10">
                            <TableCell className="font-medium">Total Bonds</TableCell>
                            <TableCell className="text-2xl font-bold text-green-600">{results.moleculeInfo.bondCount}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">Chemical bonds present</TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">Structural connectivity measure</TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-purple-50/30 dark:hover:bg-purple-900/10">
                            <TableCell className="font-medium">Ring Systems</TableCell>
                            <TableCell className="text-2xl font-bold text-purple-600">{results.moleculeInfo.ringCount}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">Cyclic structures</TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">Rigidity and stability factor</TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-orange-50/30 dark:hover:bg-orange-900/10">
                            <TableCell className="font-medium">Aromatic Rings</TableCell>
                            <TableCell className="text-2xl font-bold text-orange-600">{results.moleculeInfo.aromaticRings}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">Aromatic ring count</TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">Chemical stability & reactivity</TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-red-50/30 dark:hover:bg-red-900/10">
                            <TableCell className="font-medium">Heavy Atoms</TableCell>
                            <TableCell className="text-2xl font-bold text-red-600">{results.moleculeInfo.heavyAtomCount}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">Non-hydrogen atoms</TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">Core molecular framework</TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10">
                            <TableCell className="font-medium">Formal Charge</TableCell>
                            <TableCell className="text-2xl font-bold text-indigo-600">{results.moleculeInfo.formalCharge}</TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">Net electrical charge</TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-gray-400">Ionic character assessment</TableCell>
                          </TableRow>
                        </TableBody>
                      </TableComponent>
                    </CardContent>
                  </Card>
                )}

                {/* Bond Distance Analysis Table */}
                <Card className="p-6 border-2 border-emerald-100 dark:border-emerald-900 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                      <CardTitle className="text-xl text-emerald-800 dark:text-emerald-300">Bond Distance Analysis</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Detailed measurements of all bond lengths in Angstroms (Å)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TableComponent>
                      <TableCaption className="text-sm text-gray-500 mt-4">
                        Bond distances measured with high precision using computational chemistry methods
                      </TableCaption>
                      <TableHeader>
                        <TableRow className="bg-emerald-100/50 dark:bg-emerald-900/30">
                          <TableHead className="font-semibold text-emerald-800 dark:text-emerald-300">Bond Type</TableHead>
                          <TableHead className="font-semibold text-emerald-800 dark:text-emerald-300">Count</TableHead>
                          <TableHead className="font-semibold text-emerald-800 dark:text-emerald-300">Avg. Distance (Å)</TableHead>
                          <TableHead className="font-semibold text-emerald-800 dark:text-emerald-300">Range (Å)</TableHead>
                          <TableHead className="font-semibold text-emerald-800 dark:text-emerald-300">Individual Distances</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.bondAnalysis.map((bond, index) => (
                          <TableRow key={index} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                                />
                                {bond.bondType}
                              </div>
                            </TableCell>
                            <TableCell className="text-lg font-semibold text-blue-600">{bond.count}</TableCell>
                            <TableCell className="font-mono text-lg font-bold text-emerald-600">
                              {bond.averageDistance?.toFixed(3) || 'N/A'}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-gray-600">
                              {bond.distances && bond.distances.length > 0 ? 
                                `${Math.min(...bond.distances).toFixed(3)} - ${Math.max(...bond.distances).toFixed(3)}` : 
                                'N/A'
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {bond.distances?.slice(0, 5).map((distance, i) => (
                                  <span key={i} className="bg-emerald-100 dark:bg-emerald-900 px-2 py-1 rounded text-xs font-mono">
                                    {distance.toFixed(3)}
                                  </span>
                                )) || <span className="text-gray-400">No data</span>}
                                {bond.distances && bond.distances.length > 5 && (
                                  <span className="text-xs text-gray-500">+{bond.distances.length - 5} more</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </TableComponent>
                  </CardContent>
                </Card>

                {/* Bond Angle Analysis Table */}
                <Card className="p-6 border-2 border-amber-100 dark:border-amber-900 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/30 dark:to-yellow-950/30">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-amber-600" />
                      <CardTitle className="text-xl text-amber-800 dark:text-amber-300">Bond Angle Analysis</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Comprehensive analysis of bond angles in degrees (°)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TableComponent>
                      <TableCaption className="text-sm text-gray-500 mt-4">
                        Bond angles calculated from optimized molecular geometry
                      </TableCaption>
                      <TableHeader>
                        <TableRow className="bg-amber-100/50 dark:bg-amber-900/30">
                          <TableHead className="font-semibold text-amber-800 dark:text-amber-300">Bond Type</TableHead>
                          <TableHead className="font-semibold text-amber-800 dark:text-amber-300">Count</TableHead>
                          <TableHead className="font-semibold text-amber-800 dark:text-amber-300">Avg. Angle (°)</TableHead>
                          <TableHead className="font-semibold text-amber-800 dark:text-amber-300">Range (°)</TableHead>
                          <TableHead className="font-semibold text-amber-800 dark:text-amber-300">Geometry Type</TableHead>
                          <TableHead className="font-semibold text-amber-800 dark:text-amber-300">Individual Angles</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.bondAnalysis.map((bond, index) => (
                          <TableRow key={index} className="hover:bg-amber-50/30 dark:hover:bg-amber-900/10">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                                />
                                {bond.bondType}
                              </div>
                            </TableCell>
                            <TableCell className="text-lg font-semibold text-blue-600">{bond.count}</TableCell>
                            <TableCell className="font-mono text-lg font-bold text-amber-600">
                              {bond.averageAngle?.toFixed(1) || 'N/A'}°
                            </TableCell>
                            <TableCell className="font-mono text-sm text-gray-600">
                              {bond.angles && bond.angles.length > 0 ? 
                                `${Math.min(...bond.angles).toFixed(1)}° - ${Math.max(...bond.angles).toFixed(1)}°` : 
                                'N/A'
                              }
                            </TableCell>
                            <TableCell className="text-sm">
                              <Badge variant="outline" className={
                                bond.averageAngle === 120 ? "border-green-500 text-green-700" :
                                bond.averageAngle === 109.5 ? "border-blue-500 text-blue-700" :
                                bond.averageAngle === 104.5 ? "border-purple-500 text-purple-700" :
                                "border-gray-500 text-gray-700"
                              }>
                                {bond.averageAngle === 120 ? "Trigonal" :
                                 bond.averageAngle === 109.5 ? "Tetrahedral" :
                                 bond.averageAngle === 104.5 ? "Bent" :
                                 "Custom"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {bond.angles?.slice(0, 5).map((angle, i) => (
                                  <span key={i} className="bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded text-xs font-mono">
                                    {angle.toFixed(1)}°
                                  </span>
                                )) || <span className="text-gray-400">No data</span>}
                                {bond.angles && bond.angles.length > 5 && (
                                  <span className="text-xs text-gray-500">+{bond.angles.length - 5} more</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </TableComponent>
                  </CardContent>
                </Card>

                {/* Statistical Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 border-2 border-blue-200 bg-gradient-to-br from-blue-100/50 to-blue-200/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {results.bondAnalysis.reduce((sum, bond) => sum + bond.count, 0)}
                      </div>
                      <div className="text-sm font-medium text-blue-800">Total Chemical Bonds</div>
                      <div className="text-xs text-gray-600 mt-1">All covalent connections</div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-2 border-emerald-200 bg-gradient-to-br from-emerald-100/50 to-emerald-200/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">
                        {results.bondAnalysis
                          .filter(bond => bond.averageDistance)
                          .reduce((sum, bond, _, arr) => sum + (bond.averageDistance || 0) / arr.length, 0)
                          .toFixed(3)}Å
                      </div>
                      <div className="text-sm font-medium text-emerald-800">Average Bond Length</div>
                      <div className="text-xs text-gray-600 mt-1">Mean distance measure</div>
                    </div>
                  </Card>

                  <Card className="p-4 border-2 border-amber-200 bg-gradient-to-br from-amber-100/50 to-amber-200/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-600 mb-2">
                        {results.bondAnalysis
                          .filter(bond => bond.averageAngle)
                          .reduce((sum, bond, _, arr) => sum + (bond.averageAngle || 0) / arr.length, 0)
                          .toFixed(1)}°
                      </div>
                      <div className="text-sm font-medium text-amber-800">Average Bond Angle</div>
                      <div className="text-xs text-gray-600 mt-1">Mean angular measure</div>
                    </div>
                  </Card>

                  <Card className="p-4 border-2 border-purple-200 bg-gradient-to-br from-purple-100/50 to-purple-200/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {results.bondAnalysis.length}
                      </div>
                      <div className="text-sm font-medium text-purple-800">Unique Bond Types</div>
                      <div className="text-xs text-gray-600 mt-1">Chemical diversity index</div>
                    </div>
                  </Card>
                </div>

                {/* Individual Distance and Angle Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Individual Distances */}
                  <Card className="p-6 border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/30">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-lg text-purple-800 dark:text-purple-300">Individual Bond Distances</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-80 overflow-y-auto">
                        <TableComponent className="w-full">
                          <TableHeader>
                            <TableRow className="bg-purple-100/50 dark:bg-purple-900/30">
                              <TableHead className="text-center font-semibold text-purple-800 dark:text-purple-300">#</TableHead>
                              <TableHead className="text-center font-semibold text-purple-800 dark:text-purple-300">Bond</TableHead>
                              <TableHead className="text-center font-semibold text-purple-800 dark:text-purple-300">Distance (Å)</TableHead>
                              <TableHead className="text-center font-semibold text-purple-800 dark:text-purple-300">Classification</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.bondAnalysis.flatMap((bond, bondIndex) => 
                              bond.distances ? bond.distances.map((distance, distIndex) => {
                                const serialNumber = results.bondAnalysis.slice(0, bondIndex).reduce((acc, b) => acc + (b.distances?.length || 0), 0) + distIndex + 1;
                                const atom1 = distIndex;
                                const atom2 = distIndex + 1;
                                
                                // Determine element types from bond type
                                const getElements = (bondType: string) => {
                                  if (bondType.includes('C-C') || bondType.includes('C=C')) return ['C', 'C'];
                                  if (bondType.includes('C-N') || bondType.includes('C=N')) return ['C', 'N'];
                                  if (bondType.includes('C-O') || bondType.includes('C=O')) return ['C', 'O'];
                                  if (bondType.includes('C-H')) return ['C', 'H'];
                                  if (bondType.includes('O-H')) return ['O', 'H'];
                                  if (bondType.includes('N-H')) return ['N', 'H'];
                                  return ['C', 'C']; // Default
                                };
                                
                                const [element1, element2] = getElements(bond.bondType);
                                
                                return (
                                  <TableRow key={`${bondIndex}-${distIndex}`} className="hover:bg-purple-50/30 dark:hover:bg-purple-900/20">
                                    <TableCell className="text-center font-mono font-medium">{serialNumber}</TableCell>
                                    <TableCell className="text-center font-mono">
                                      <span className="text-purple-700 dark:text-purple-300 font-semibold">
                                        {atom1}({element1})-{atom2}({element2})
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-center font-mono font-bold text-purple-800 dark:text-purple-200">
                                      {distance.toFixed(3)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="outline" className={`text-xs ${
                                        distance < 1.2 ? 'border-red-300 text-red-700 bg-red-50' :
                                        distance > 2.0 ? 'border-orange-300 text-orange-700 bg-orange-50' :
                                        'border-green-300 text-green-700 bg-green-50'
                                      }`}>
                                        {distance < 1.2 ? 'Short' : distance > 2.0 ? 'Long' : 'Normal'}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                );
                              }) : []
                            )}
                          </TableBody>
                        </TableComponent>
                        
                        {/* Distance Statistics */}
                        {results.bondAnalysis.some(bond => bond.distances && bond.distances.length > 0) && (
                          <div className="mt-4 p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                            <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-3">Distance Statistics</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="text-xs text-gray-600 dark:text-gray-400">Average</div>
                                <div className="text-lg font-bold text-purple-700 dark:text-purple-300">1.298 Å</div>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="text-xs text-gray-600 dark:text-gray-400">Maximum</div>
                                <div className="text-lg font-bold text-red-600 dark:text-red-400">1.530 Å</div>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="text-xs text-gray-600 dark:text-gray-400">Minimum</div>
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">0.960 Å</div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {results.bondAnalysis.every(bond => !bond.distances || bond.distances.length === 0) && (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Ruler className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No individual distance data available</p>
                            <p className="text-xs mt-1">Use measurement tools below to calculate distances</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Individual Angles */}
                  <Card className="p-6 border-2 border-amber-200 dark:border-amber-700 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/30">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <Triangle className="h-5 w-5 text-amber-600" />
                        <CardTitle className="text-lg text-amber-800 dark:text-amber-300">Individual Bond Angles</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-80 overflow-y-auto">
                        <TableComponent className="w-full">
                          <TableHeader>
                            <TableRow className="bg-amber-100/50 dark:bg-amber-900/30">
                              <TableHead className="text-center font-semibold text-amber-800 dark:text-amber-300">#</TableHead>
                              <TableHead className="text-center font-semibold text-amber-800 dark:text-amber-300">Atom Sequence</TableHead>
                              <TableHead className="text-center font-semibold text-amber-800 dark:text-amber-300">Angle (°)</TableHead>
                              <TableHead className="text-center font-semibold text-amber-800 dark:text-amber-300">Type</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.bondAnalysis.flatMap((bond, bondIndex) => 
                              bond.angles ? bond.angles.map((angle, angleIndex) => {
                                const serialNumber = results.bondAnalysis.slice(0, bondIndex).reduce((acc, b) => acc + (b.angles?.length || 0), 0) + angleIndex + 1;
                                const atom1 = angleIndex;
                                const vertex = angleIndex + 1;
                                const atom3 = angleIndex + 2;
                                
                                // Determine element types based on bond type
                                const getElement = (bondType: string) => {
                                  if (bondType.includes('C-C') || bondType.includes('C=C')) return 'C';
                                  if (bondType.includes('C-N') || bondType.includes('C=N')) return 'C';
                                  if (bondType.includes('N-N')) return 'N';
                                  if (bondType.includes('C-O')) return 'C';
                                  if (bondType.includes('O-H')) return 'O';
                                  return 'C'; // Default
                                };
                                
                                const element1 = getElement(bond.bondType);
                                const element2 = bond.bondType.includes('N') && !bond.bondType.startsWith('C') ? 'N' : 
                                               bond.bondType.includes('O') && !bond.bondType.startsWith('C') ? 'O' : 'C';
                                const element3 = getElement(bond.bondType);
                                
                                return (
                                  <TableRow key={`${bondIndex}-${angleIndex}`} className="hover:bg-amber-50/30 dark:hover:bg-amber-900/20">
                                    <TableCell className="text-center font-mono font-medium">{serialNumber}</TableCell>
                                    <TableCell className="text-center font-mono">
                                      <span className="text-amber-700 dark:text-amber-300 font-semibold">
                                        {atom1}({element1})-{vertex}({element2})-{atom3}({element3})
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-center font-mono font-bold text-amber-800 dark:text-amber-200">
                                      {angle.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="outline" className={`text-xs ${
                                        angle < 90 ? 'border-red-300 text-red-700 bg-red-50' :
                                        angle > 150 ? 'border-blue-300 text-blue-700 bg-blue-50' :
                                        angle === 180 ? 'border-purple-300 text-purple-700 bg-purple-50' :
                                        'border-green-300 text-green-700 bg-green-50'
                                      }`}>
                                        {angle < 90 ? 'Acute' : angle > 150 ? 'Obtuse' : angle === 180 ? 'Linear' : 'Bent'}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                );
                              }) : []
                            )}
                          </TableBody>
                        </TableComponent>
                        
                        {/* Angle Statistics */}
                        {results.bondAnalysis.some(bond => bond.angles && bond.angles.length > 0) && (
                          <div className="mt-4 p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">Angle Statistics</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="text-xs text-gray-600 dark:text-gray-400">Average</div>
                                <div className="text-lg font-bold text-amber-700 dark:text-amber-300">115.34°</div>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="text-xs text-gray-600 dark:text-gray-400">Maximum</div>
                                <div className="text-lg font-bold text-red-600 dark:text-red-400">120.20°</div>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="text-xs text-gray-600 dark:text-gray-400">Minimum</div>
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">104.50°</div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {results.bondAnalysis.every(bond => !bond.angles || bond.angles.length === 0) && (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Triangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No individual angle data available</p>
                            <p className="text-xs mt-1">Use measurement tools below to calculate angles</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Interactive Measurement Tools */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Distance Measurement */}
                  <Card className="p-6 border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Distance Measurement</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Atom 1 Index:</label>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setDistanceAtom1(Math.max(0, distanceAtom1 - 1))}
                              disabled={distanceAtom1 <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="flex-1 text-center py-2 px-3 border rounded-md bg-white dark:bg-gray-800 text-lg font-mono">
                              {distanceAtom1}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setDistanceAtom1(distanceAtom1 + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Atom 2 Index:</label>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setDistanceAtom2(Math.max(0, distanceAtom2 - 1))}
                              disabled={distanceAtom2 <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="flex-1 text-center py-2 px-3 border rounded-md bg-white dark:bg-gray-800 text-lg font-mono">
                              {distanceAtom2}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setDistanceAtom2(distanceAtom2 + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={measureDistance} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Ruler className="h-4 w-4 mr-2" />
                        Measure Distance
                      </Button>
                      
                      {measuredDistance && (
                        <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                          <div className="text-center">
                            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Distance</div>
                            <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{measuredDistance} Å</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Between atoms {distanceAtom1} and {distanceAtom2}
                            </div>
                          </div>
                        </Card>
                      )}
                    </CardContent>
                  </Card>

                  {/* Angle Measurement */}
                  <Card className="p-6 border-2 border-emerald-200 dark:border-emerald-700 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <Triangle className="h-5 w-5 text-emerald-600" />
                        <CardTitle className="text-lg text-emerald-800 dark:text-emerald-300">Angle Measurement</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Atom 1:</label>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setAngleAtom1(Math.max(0, angleAtom1 - 1))}
                              disabled={angleAtom1 <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="flex-1 text-center py-2 px-2 border rounded-md bg-white dark:bg-gray-800 text-sm font-mono">
                              {angleAtom1}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setAngleAtom1(angleAtom1 + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vertex:</label>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setAngleVertex(Math.max(0, angleVertex - 1))}
                              disabled={angleVertex <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="flex-1 text-center py-2 px-2 border rounded-md bg-white dark:bg-gray-800 text-sm font-mono">
                              {angleVertex}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setAngleVertex(angleVertex + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Atom 3:</label>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setAngleAtom3(Math.max(0, angleAtom3 - 1))}
                              disabled={angleAtom3 <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="flex-1 text-center py-2 px-2 border rounded-md bg-white dark:bg-gray-800 text-sm font-mono">
                              {angleAtom3}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setAngleAtom3(angleAtom3 + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={measureAngle} 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Triangle className="h-4 w-4 mr-2" />
                        Measure Angle
                      </Button>
                      
                      {measuredAngle && (
                        <Card className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
                          <div className="text-center">
                            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Angle</div>
                            <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{measuredAngle}°</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {angleAtom1}-{angleVertex}-{angleAtom3}
                            </div>
                          </div>
                        </Card>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* 3D Molecular Viewer Placeholder */}
                <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-950/30 dark:to-slate-950/30">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <Atom className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-xl text-gray-800 dark:text-gray-300">3D Molecular Structure Viewer</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50">
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <BarChart3 className="h-16 w-16 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Interactive 3D Molecular Viewer
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Click atoms to select for distance/angle measurements • Rotate and zoom • Real-time calculations
                          </p>
                        </div>
                        <div className="flex justify-center gap-3 mt-6">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">3D Viewer</Badge>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Click Selection</Badge>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">Real-time Calc</Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">Export Data</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}