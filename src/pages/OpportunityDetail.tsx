import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, ExternalLink, ArrowLeft, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Opportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  deadline: string;
  location: string;
  amount?: string;
  link: string;
  fullDescription: string;
  applicationInstructions: string;
  eligibility: string[];
  benefits: string[];
}

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Google Summer of Code 2024",
    type: "Internship",
    description: "Join open source projects and work with mentors from leading tech companies. Perfect for computer science students.",
    fullDescription: "Google Summer of Code is a global program focused on bringing new contributors into open source software development. Students work with an open source organization on a 12+ week programming project during their break from school. This program provides students with real-world software development skills and experience working with a mentor from industry-leading companies.",
    applicationInstructions: "1. Choose an organization and project idea\n2. Submit your proposal through the GSoC website\n3. Include your programming experience and project timeline\n4. Deadline: March 18, 2024",
    eligibility: ["18+ years old", "Enrolled in university", "Programming experience required"],
    benefits: ["$6,600 stipend", "Mentorship from industry experts", "Open source contribution experience"],
    deadline: "March 18, 2024",
    location: "Remote",
    amount: "$6,600",
    link: "https://summerofcode.withgoogle.com/"
  },
  {
    id: "2",
    title: "Rhodes Scholarship",
    type: "Scholarship",
    description: "Full scholarship to study at Oxford University. One of the world's most prestigious academic awards.",
    fullDescription: "The Rhodes Scholarship is an international postgraduate award for students to study at the University of Oxford. It is widely considered one of the world's most prestigious scholarships. Rhodes Scholars are chosen not only for their outstanding scholarly achievements, but also for their character, commitment to others and to the common good, and for their potential for leadership.",
    applicationInstructions: "1. Complete online application with essays\n2. Submit academic transcripts and references\n3. Participate in regional interviews if selected\n4. Deadline: September 1, 2024",
    eligibility: ["Bachelor's degree completed", "Age 18-24", "Outstanding academic record", "Leadership experience"],
    benefits: ["Full tuition coverage", "Living stipend", "Travel allowance", "Access to Oxford network"],
    deadline: "September 1, 2024",
    location: "Oxford, UK",
    amount: "Full tuition + living expenses",
    link: "https://www.rhodeshouse.ox.ac.uk/"
  },
  {
    id: "3",
    title: "Fulbright Student Program",
    type: "Fellowship",
    description: "Study, research, and teach abroad with this prestigious international exchange program.",
    fullDescription: "The Fulbright Student Program provides opportunities for U.S. graduating seniors, graduate students, and young professionals to study, conduct research, and teach abroad for one academic year. The program aims to increase mutual understanding between the people of the United States and other countries through educational and cultural exchange.",
    applicationInstructions: "1. Choose your country and program type\n2. Complete online application with project proposal\n3. Submit language evaluations if required\n4. Deadline: October 8, 2024",
    eligibility: ["U.S. citizenship", "Bachelor's degree", "Language proficiency for non-English countries"],
    benefits: ["Full funding for year abroad", "Cultural immersion", "Professional development", "Global network"],
    deadline: "October 8, 2024",
    location: "Various Countries",
    amount: "Full funding",
    link: "https://us.fulbrightonline.org/"
  },
  {
    id: "4",
    title: "Microsoft Internship Program",
    type: "Internship",
    description: "12-week summer internship at Microsoft with mentorship and hands-on experience in cutting-edge technology.",
    fullDescription: "Microsoft's internship program offers students the opportunity to work on real projects that impact millions of users worldwide. Interns are treated as full-time employees, receiving mentorship, training, and the chance to contribute to Microsoft's innovative products and services. The program includes both technical and non-technical roles across various divisions.",
    applicationInstructions: "1. Apply through Microsoft careers website\n2. Complete online assessments\n3. Participate in virtual or on-site interviews\n4. Deadline: January 31, 2024",
    eligibility: ["Currently enrolled student", "Relevant coursework or experience", "Strong problem-solving skills"],
    benefits: ["$8,000/month salary", "Housing assistance", "Mentorship program", "Full-time job opportunity"],
    deadline: "January 31, 2024",
    location: "Redmond, WA",
    amount: "$8,000/month",
    link: "https://careers.microsoft.com/"
  },
  {
    id: "5",
    title: "Gates Millennium Scholarship",
    type: "Scholarship",
    description: "Full scholarship for outstanding minority students pursuing undergraduate and graduate studies.",
    fullDescription: "The Gates Millennium Scholars Program, funded by the Bill & Melinda Gates Foundation, provides outstanding African American, American Indian/Alaska Native, Asian Pacific Islander American, and Hispanic American students with an opportunity to complete an undergraduate college education in any discipline area of interest.",
    applicationInstructions: "1. Complete online application\n2. Submit transcripts and test scores\n3. Provide recommendation letters\n4. Deadline: January 15, 2024",
    eligibility: ["High school senior", "Minority background", "3.3 GPA minimum", "Financial need"],
    benefits: ["Full tuition coverage", "Books and supplies", "Graduate school funding", "Leadership development"],
    deadline: "January 15, 2024",
    location: "USA",
    amount: "Full tuition",
    link: "https://www.thegatesscholarship.org/"
  },
  {
    id: "6",
    title: "UN Youth Climate Summit",
    type: "Fellowship",
    description: "Join young climate leaders from around the world at the United Nations headquarters.",
    fullDescription: "The UN Youth Climate Summit brings together young climate activists, innovators, and entrepreneurs from around the world to showcase their solutions and influence international climate action. Participants will have the opportunity to address world leaders, participate in high-level discussions, and build networks for future collaboration on climate initiatives.",
    applicationInstructions: "1. Submit application with climate project proposal\n2. Provide video pitch (3 minutes max)\n3. Include recommendations from mentors\n4. Deadline: April 30, 2024",
    eligibility: ["Age 18-29", "Climate action experience", "Demonstrated leadership", "English proficiency"],
    benefits: ["Travel to New York", "Accommodation provided", "Networking opportunities", "UN platform access"],
    deadline: "April 30, 2024",
    location: "New York, NY",
    amount: "Travel + accommodation",
    link: "https://www.un.org/en/climatechange/youth-summit"
  }
];

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'scholarship':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    case 'internship':
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    case 'fellowship':
      return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
    case 'grant':
      return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
  }
};

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const opportunity = mockOpportunities.find(opp => opp.id === id);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Opportunity Not Found</h1>
            <p className="text-muted-foreground mb-6">The opportunity you're looking for doesn't exist.</p>
            <Link to="/opportunities">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Opportunities
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: opportunity.description,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/opportunities")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Opportunities
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getTypeColor(opportunity.type)}>
                    {opportunity.type}
                  </Badge>
                  {opportunity.amount && (
                    <span className="text-lg font-semibold text-primary">
                      {opportunity.amount}
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {opportunity.title}
                </h1>
                
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>Deadline: {opportunity.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{opportunity.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              size="lg"
              className="mb-6"
              onClick={() => window.open(opportunity.link, '_blank')}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Apply Now
            </Button>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {opportunity.fullDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Eligibility */}
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.eligibility.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Application Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Apply</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line text-muted-foreground">
                    {opportunity.applicationInstructions}
                  </div>
                  <Separator className="my-6" />
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => window.open(opportunity.link, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Start Your Application
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default OpportunityDetail;