export const person = {
  fullName: "Saksham Mahajan",
  primaryLocation: "Delhi NCR, India",
  targetRoles: ["Business Development", "General Management", "Strategy and Growth"]
} as const;

export const links = {
  linkedin: "https://www.linkedin.com/in/sakshamahajan/",
  contactEmail: "contact@sakshammahajan.com",
  official: {
    isb: "https://www.isb.edu/",
    essec: "https://www.essec.edu/",
    christ: "https://christuniversity.in/",
    pitapit: "https://pitapitindia.in/",
    beamsuntory: "https://www.suntoryglobalspirits.com/"
  }
} as const;

export const education = [
  {
    school: "Indian School of Business (ISB)",
    programme: "Post Graduate Programme in Management",
    location: "Hyderabad, India",
    dates: "April 2025 – Present",
    website: links.official.isb,
    logo: "/logos/ISB.png"
  },
  {
    school: "ESSEC Business School",
    degree: "Master in Management",
    specialisation: "Innovation, Entrepreneurship and Sustainability",
    location: "Singapore and Paris",
    dates: "September 2021 – June 2023",
    website: links.official.essec,
    logo: "/logos/ESSEC.png"
  },
  {
    school: "Christ University, Bangalore",
    degree: "Bachelor of Business Administration",
    specialisation: "Marketing",
    dates: "June 2018 – July 2021",
    website: links.official.christ,
    logo: "/logos/christ-university.png"
  }
] as const;

export const work = {
  pitaPitIndia: {
    company: "Pita Pit India",
    industry: "Healthy QSR",
    globalPresence: "2200 plus outlets",
    location: "Delhi NCR, India",
    website: links.official.pitapit,
    logo: "/logos/pita%20pit%20logo.jpeg",
    roles: [
      {
        title: "Business Strategy and GTM Manager",
        dates: "January 2023 – December 2023"
      },
      {
        title: "Business Strategy and Growth Lead",
        dates: "January 2024 – March 2025"
      }
    ]
  },
  beamSuntory: {
    company: "Beam Suntory",
    industry: "Global Spirits and Consumer Brands",
    globalRank: "Third largest alcoholic beverages company",
    location: "Singapore",
    website: links.official.beamsuntory,
    logo: "/logos/beam%20suntory%20logo.png",
    roles: [
      {
        title: "Global Supply Planning Trainee",
        dates: "July 2022 – December 2022"
      }
    ]
  }
} as const;

