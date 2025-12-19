import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  HeartPulse, Brain, Calendar, FileText, Activity, 
  Sparkles, AlertTriangle, CheckCircle, User, Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Symptom {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
}

interface HealthInsight {
  category: string;
  value: string;
  trend: "up" | "down" | "stable";
  aiNote?: string;
}

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
}

const commonSymptoms: Symptom[] = [
  { id: "headache", name: "Headache", severity: "mild" },
  { id: "fever", name: "Fever", severity: "moderate" },
  { id: "cough", name: "Cough", severity: "mild" },
  { id: "fatigue", name: "Fatigue", severity: "mild" },
  { id: "nausea", name: "Nausea", severity: "moderate" },
  { id: "bodyache", name: "Body Ache", severity: "mild" },
  { id: "chestpain", name: "Chest Pain", severity: "severe" },
  { id: "breathing", name: "Shortness of Breath", severity: "severe" },
];

const healthInsights: HealthInsight[] = [
  { category: "Heart Rate", value: "72 bpm", trend: "stable", aiNote: "Within normal range" },
  { category: "Blood Pressure", value: "118/76", trend: "down", aiNote: "Improved from last week" },
  { category: "Sleep Quality", value: "7.2 hrs", trend: "up", aiNote: "Better than your average" },
  { category: "Activity Level", value: "8,432 steps", trend: "stable" },
];

const upcomingAppointments: Appointment[] = [
  { id: 1, doctor: "Dr. Sarah Chen", specialty: "General Practice", date: "Dec 22", time: "10:00 AM", type: "Check-up" },
  { id: 2, doctor: "Dr. Michael Park", specialty: "Cardiology", date: "Jan 5", time: "2:30 PM", type: "Follow-up" },
];

const Index = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [analysisState, setAnalysisState] = useState<"input" | "analyzing" | "results">("input");
  const [analysisResult, setAnalysisResult] = useState<{
    condition: string;
    confidence: number;
    urgency: "low" | "medium" | "high";
    recommendations: string[];
  } | null>(null);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      toast({ title: "Select symptoms", description: "Please select at least one symptom", variant: "destructive" });
      return;
    }
    setAnalysisState("analyzing");
    
    setTimeout(() => {
      const hasSevere = selectedSymptoms.some(id => 
        commonSymptoms.find(s => s.id === id)?.severity === "severe"
      );
      
      setAnalysisResult({
        condition: hasSevere 
          ? "Potential cardiac or respiratory concern" 
          : "Common viral symptoms",
        confidence: hasSevere ? 78 : 92,
        urgency: hasSevere ? "high" : "low",
        recommendations: hasSevere 
          ? [
              "Seek immediate medical attention",
              "Do not engage in strenuous activity",
              "Monitor symptoms closely",
              "Call emergency services if symptoms worsen"
            ]
          : [
              "Rest and stay hydrated",
              "Over-the-counter pain relievers may help",
              "Monitor temperature regularly",
              "Consult a doctor if symptoms persist beyond 3 days"
            ]
      });
      setAnalysisState("results");
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedSymptoms([]);
    setAdditionalNotes("");
    setAnalysisState("input");
    setAnalysisResult(null);
  };

  return (
    <>
      <Helmet>
        <title>HealthSync - AI Health Platform | Nizar Hussain</title>
        <meta name="description" content="AI-powered healthcare platform with symptom analysis and health insights" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-rose-950 to-background">
        <header className="sticky top-0 z-50 bg-rose-950/95 backdrop-blur border-b border-rose-800/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-6 h-6 text-rose-400" />
                <span className="text-xl font-bold text-foreground">HealthSync</span>
              </div>
              <Button variant="outline" size="sm" className="border-rose-800/50">
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-rose-800/30">
                <CardHeader className="border-b border-rose-800/30">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-rose-400" />
                    AI Symptom Checker
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {analysisState === "input" && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Select your symptoms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {commonSymptoms.map(symptom => (
                            <Badge
                              key={symptom.id}
                              variant={selectedSymptoms.includes(symptom.id) ? "default" : "outline"}
                              className={`cursor-pointer transition-all ${
                                selectedSymptoms.includes(symptom.id)
                                  ? symptom.severity === "severe" 
                                    ? "bg-red-600 hover:bg-red-700" 
                                    : "bg-rose-600 hover:bg-rose-700"
                                  : "border-rose-800/50 hover:bg-rose-900/50"
                              }`}
                              onClick={() => toggleSymptom(symptom.id)}
                            >
                              {symptom.name}
                              {symptom.severity === "severe" && (
                                <AlertTriangle className="w-3 h-3 ml-1" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Additional notes (optional):</h4>
                        <Textarea
                          value={additionalNotes}
                          onChange={(e) => setAdditionalNotes(e.target.value)}
                          placeholder="Describe your symptoms in more detail..."
                          className="bg-rose-900/20 border-rose-800/50"
                          rows={3}
                        />
                      </div>
                      <Button 
                        className="w-full bg-rose-600 hover:bg-rose-700" 
                        size="lg"
                        onClick={analyzeSymptoms}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze Symptoms with AI
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        This is not a medical diagnosis. Always consult a healthcare professional.
                      </p>
                    </div>
                  )}

                  {analysisState === "analyzing" && (
                    <div className="py-12 text-center">
                      <Brain className="w-16 h-16 text-rose-400 mx-auto mb-4 animate-pulse" />
                      <h3 className="text-xl font-semibold mb-2">Analyzing Your Symptoms</h3>
                      <p className="text-muted-foreground">
                        Our LLM is processing your symptoms using medical knowledge...
                      </p>
                    </div>
                  )}

                  {analysisState === "results" && analysisResult && (
                    <div className="space-y-6">
                      <div className={`p-4 rounded-lg ${
                        analysisResult.urgency === "high" 
                          ? "bg-red-900/30 border border-red-700/50" 
                          : "bg-rose-900/20 border border-rose-800/50"
                      }`}>
                        <div className="flex items-start gap-3">
                          {analysisResult.urgency === "high" ? (
                            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                          ) : (
                            <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                          )}
                          <div>
                            <h4 className="font-semibold text-lg">{analysisResult.condition}</h4>
                            <p className="text-sm text-muted-foreground">
                              Confidence: {analysisResult.confidence}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Recommendations:</h4>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-rose-400 mt-0.5">◆</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-rose-800/50"
                          onClick={resetAnalysis}
                        >
                          New Analysis
                        </Button>
                        <Button className="flex-1 bg-rose-600 hover:bg-rose-700">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-rose-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-400" />
                    Health Insights
                    <Badge className="ml-2 bg-rose-600/20 text-rose-400 border-rose-600/30 text-xs">
                      AI Powered
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {healthInsights.map((insight, i) => (
                      <div key={i} className="p-4 rounded-lg bg-rose-900/20 border border-rose-800/30">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-muted-foreground">{insight.category}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${
                              insight.trend === "up" ? "text-green-400 border-green-600/30" :
                              insight.trend === "down" ? "text-blue-400 border-blue-600/30" :
                              "text-muted-foreground border-muted/30"
                            }`}
                          >
                            {insight.trend === "up" ? "↑" : insight.trend === "down" ? "↓" : "→"} {insight.trend}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{insight.value}</p>
                        {insight.aiNote && (
                          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {insight.aiNote}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-rose-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-rose-400" />
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.map(apt => (
                    <div key={apt.id} className="p-3 rounded-lg bg-rose-900/20 border border-rose-800/30">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{apt.doctor}</p>
                          <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{apt.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{apt.date} at {apt.time}</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-rose-800/50">
                    Schedule New Appointment
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-rose-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-rose-400" />
                    Records
                    <Badge className="ml-auto bg-rose-600/20 text-rose-400 text-[10px]">
                      AI Summarized
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Lab Results - Nov 2024", "Prescription - Oct 2024", "Visit Summary - Sep 2024"].map((record, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-rose-900/20 hover:bg-rose-900/30 cursor-pointer transition-colors">
                      <span className="text-sm">{record}</span>
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <footer className="border-t border-rose-800/30 mt-16 py-8 bg-rose-950/50">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground text-sm mb-4">
              <Badge variant="outline" className="mr-2">Demo Project</Badge>
              Built with LLM-powered health analysis
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["React", "FastAPI", "Python", "LangChain", "OpenAI", "PostgreSQL", "FHIR"].map(tech => (
                <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;

