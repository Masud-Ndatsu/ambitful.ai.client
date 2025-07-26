import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, RefreshCw, Star, Edit, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const aiDrafts = [
  {
    id: 1,
    title: "AWS Cloud Training Program 2024",
    source: "aws.amazon.com/training",
    status: "pending",
    priority: "high",
    dateScraped: "2024-01-25",
    original: `Amazon Web Services (AWS) is pleased to announce the launch of our comprehensive Cloud Training Program for 2024. This program is designed to equip participants with essential cloud computing skills and prepare them for AWS certification exams.

Program Details:
- Duration: 6 months (part-time)
- Format: Online with hands-on labs
- Prerequisites: Basic programming knowledge
- Cost: Free for selected participants
- Certificates: AWS Certified Cloud Practitioner preparation
- Start Date: March 1, 2024
- Application Deadline: February 15, 2024

Who Should Apply:
The program is ideal for recent graduates, professionals looking to transition into cloud computing, and anyone interested in gaining practical AWS skills. We welcome applications from all backgrounds and are committed to diversity and inclusion.

Application Process:
1. Complete online application form
2. Submit resume and cover letter
3. Technical assessment (programming basics)
4. Virtual interview with AWS engineers
5. Final selection notification

Benefits:
- Free access to AWS training materials
- Hands-on experience with AWS services
- Mentorship from AWS certified instructors
- Job placement assistance upon completion
- Networking opportunities with industry professionals

For more information and to apply, visit our website or contact our training team.`,
    aiSummary: `🌟 **AWS Cloud Training Program 2024** - Transform Your Career with Free Cloud Computing Training!

**What's This About?**
Amazon Web Services is offering a comprehensive 6-month cloud training program designed to launch your career in cloud computing. This is your gateway to one of the most in-demand tech skills today!

**📅 Key Dates:**
- Application Deadline: February 15, 2024
- Program Start: March 1, 2024
- Duration: 6 months (part-time, online)

**💪 What You'll Gain:**
✅ Free AWS certification preparation (Cloud Practitioner)
✅ Hands-on experience with real AWS services
✅ Mentorship from certified AWS instructors
✅ Job placement assistance after completion
✅ Networking with industry professionals

**🎯 Perfect For:**
- Recent graduates entering tech
- Professionals switching to cloud computing
- Anyone wanting practical AWS skills
- All backgrounds welcome (they value diversity!)

**📋 Application Process:**
1. Online application + resume
2. Basic technical assessment
3. Virtual interview with AWS engineers
4. Selection notification

**Requirements:** Basic programming knowledge (that's it!)

**💰 Cost:** Completely FREE for selected participants

This is a rare opportunity to get premium training from AWS at no cost while building job-ready skills in cloud computing!`,
    feedback: null,
    rating: null
  },
  {
    id: 2,
    title: "IBM Developer Challenge 2024",
    source: "developer.ibm.com/challenges",
    status: "pending",
    priority: "medium",
    dateScraped: "2024-01-24",
    original: `IBM Developer Challenge 2024: Build the Future with AI

IBM invites developers worldwide to participate in our annual Developer Challenge 2024. This year's theme focuses on artificial intelligence and machine learning solutions that can make a positive impact on society.

Challenge Categories:
1. Healthcare AI Solutions
2. Environmental Sustainability Tech
3. Educational Technology Innovations
4. Accessibility and Inclusion Tools

Timeline:
Registration Opens: February 1, 2024
Submission Deadline: May 31, 2024
Judging Period: June 1-15, 2024
Winners Announced: June 30, 2024

Prizes:
Grand Prize: $50,000 + IBM Cloud credits
Category Winners: $15,000 each + IBM mentorship
Top 20 Finalists: $2,000 + IBM certification vouchers

Eligibility:
- Open to developers aged 18 and above
- Individual or team participation (max 4 members)
- Global participation welcome
- Must use IBM technologies in solution

Judging Criteria:
- Innovation and creativity (30%)
- Technical implementation (25%)
- Social impact potential (25%)
- Use of IBM technologies (20%)

Resources:
IBM provides free access to cloud services, AI tools, and technical documentation. Participants also get access to exclusive webinars and mentorship sessions.`,
    aiSummary: `🚀 **IBM Developer Challenge 2024** - Build AI Solutions That Change the World!

**The Big Picture:**
IBM's calling all developers to create AI and machine learning solutions that make a real difference. This isn't just a coding contest - it's your chance to build technology that matters!

**🏆 Amazing Prizes:**
- Grand Prize: $50,000 + IBM Cloud credits
- Category Winners: $15,000 each + IBM mentorship
- Top 20: $2,000 + IBM certification vouchers

**🎯 Four Challenge Categories:**
1. 🏥 Healthcare AI Solutions
2. 🌱 Environmental Sustainability Tech  
3. 📚 Educational Technology
4. ♿ Accessibility & Inclusion Tools

**📅 Important Dates:**
- Registration: February 1, 2024
- Submission Deadline: May 31, 2024
- Winners Announced: June 30, 2024

**✅ Who Can Participate:**
- Developers 18+ years old
- Individual or teams (up to 4 people)
- Global participation welcome
- Must incorporate IBM technologies

**🔥 What You Get:**
- Free IBM Cloud services access
- AI tools and documentation
- Exclusive webinars and mentorship
- Potential career opportunities with IBM

**💡 Judging Focus:**
Innovation (30%) + Technical skills (25%) + Social impact (25%) + IBM tech usage (20%)

Ready to code for a cause and win big? This is your chance to showcase skills while building solutions that actually help people!`,
    feedback: null,
    rating: null
  }
];

export function AIDraftReview() {
  const [selectedDraft, setSelectedDraft] = useState(aiDrafts[0]);
  const [editedSummary, setEditedSummary] = useState(selectedDraft.aiSummary);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState<string>("");

  const handleDraftSelect = (draft: typeof aiDrafts[0]) => {
    setSelectedDraft(draft);
    setEditedSummary(draft.aiSummary);
    setIsEditing(false);
    setRating("");
  };

  const handleApprove = () => {
    // Handle approval logic
    console.log("Approved:", selectedDraft.title);
  };

  const handleReject = () => {
    // Handle rejection logic
    console.log("Rejected:", selectedDraft.title);
  };

  const handleRegenerate = (tone: string) => {
    // Handle regeneration logic with different tone
    console.log("Regenerating with tone:", tone);
  };

  const handleSaveEdit = () => {
    setSelectedDraft({ ...selectedDraft, aiSummary: editedSummary });
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">AI Draft Review</h2>
        <p className="text-muted-foreground">Review and approve AI-generated opportunity summaries</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Draft List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Drafts ({aiDrafts.filter(d => d.status === 'pending').length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiDrafts.map((draft) => (
              <div 
                key={draft.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedDraft.id === draft.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleDraftSelect(draft)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-2">{draft.title}</h4>
                  <Badge variant={getPriorityColor(draft.priority) as any} className="ml-2">
                    {draft.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{draft.source}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{draft.dateScraped}</span>
                  <Badge variant="outline" className="text-xs">
                    {draft.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Content Review */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedDraft.title}</CardTitle>
                  <CardDescription>Source: {selectedDraft.source}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getPriorityColor(selectedDraft.priority) as any}>
                    {selectedDraft.priority} priority
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="comparison" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="comparison">Side-by-Side</TabsTrigger>
                  <TabsTrigger value="edit">Edit Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="comparison" className="space-y-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* Original Content */}
                    <div>
                      <Label className="text-sm font-medium">Original Content</Label>
                      <div className="mt-2 p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-sans">
                          {selectedDraft.original}
                        </pre>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div>
                      <Label className="text-sm font-medium">AI Summary</Label>
                      <div className="mt-2 p-4 bg-primary/5 border border-primary/20 rounded-lg max-h-96 overflow-y-auto">
                        <div className="text-sm whitespace-pre-wrap">
                          {selectedDraft.aiSummary}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="edit" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="summary-edit">Edit AI Summary</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                    <Textarea
                      id="summary-edit"
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      disabled={!isEditing}
                      rows={15}
                      className="font-mono text-sm"
                    />
                    {isEditing && (
                      <div className="flex justify-end mt-2">
                        <Button onClick={handleSaveEdit}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              {/* Actions */}
              <div className="space-y-4">
                {/* Rating */}
                <div>
                  <Label className="text-sm font-medium">Rate AI Output</Label>
                  <Select value={rating} onValueChange={setRating}>
                    <SelectTrigger className="w-48 mt-2">
                      <SelectValue placeholder="Rate the AI summary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">⭐⭐⭐ Excellent</SelectItem>
                      <SelectItem value="good">⭐⭐ Good</SelectItem>
                      <SelectItem value="needs-improvement">⭐ Needs Improvement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Regenerate Options */}
                <div>
                  <Label className="text-sm font-medium">Regenerate with Different Style</Label>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRegenerate("concise")}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      More Concise
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRegenerate("detailed")}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      More Detailed
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRegenerate("simple")}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Simpler Language
                    </Button>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleApprove}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Publish
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => console.log("Save as draft")}
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleReject}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}