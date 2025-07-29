import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OpportunitySearch } from "@/components/OpportunitySearch";
import { OpportunityFilters } from "@/components/OpportunityFilters";
import { OpportunityCard } from "@/components/OpportunityCard";
import { OpportunityDetailModal } from "@/components/OpportunityDetailModal";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

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

const Opportunities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
    types: [] as string[],
    deadlines: "",
    sortBy: "newest"
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Get the selected opportunity from URL parameter
  const selectedOpportunityId = searchParams.get('opportunity');
  const selectedOpportunity = selectedOpportunityId 
    ? mockOpportunities.find(opp => opp.id === selectedOpportunityId) 
    : null;

  // Function to handle opening opportunity modal
  const handleViewDetails = (opportunityId: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('opportunity', opportunityId);
      return newParams;
    });
  };

  // Function to handle closing opportunity modal
  const handleCloseModal = () => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('opportunity');
      return newParams;
    });
  };

  const filteredOpportunities = mockOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filters.types.length === 0 || filters.types.includes(opportunity.type);
    
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Explore Opportunities
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover thousands of scholarships, internships, and fellowships curated specifically for young professionals like you
              </p>
            </div>
            
            <OpportunitySearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-1/4">
                <OpportunityFilters 
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>

              {/* Results */}
              <div className="lg:w-3/4">
                {/* View Controls */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {paginatedOpportunities.length} of {filteredOpportunities.length} opportunities
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Opportunity Grid/List */}
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-4"
                }>
                  {paginatedOpportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                      viewMode={viewMode}
                      onViewDetails={() => handleViewDetails(opportunity.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      
      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Opportunities;