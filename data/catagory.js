const categories = [
  { 
    name: "School Equipment", 
    slug: "school-equipment",
    subCategories: [
      { 
        name: "Biology", 
        slug: "biology",
        subCategories: [
          { name: "Models", slug: "models" },
          { name: "Lab Tools", slug: "lab-tools" },
          { name: "Specimens", slug: "specimens" },
        ]
      },
      { 
        name: "Chemistry", 
        slug: "chemistry",
        subCategories: [
          { name: "Glassware", slug: "glassware" },
          { name: "Lab Tools", slug: "lab-tools" },
          { name: "Safety Equipment", slug: "safety-equipment" },
          { name: "Indicators & Dyes", slug: "indicators-dyes" }
        ]
      },
      { 
        name: "Physics", 
        slug: "physics",
        subCategories: [
          { name: "Apparatus", slug: "apparatus" },
          { name: "Measurement Tools", slug: "measurement-tools" }
        ]
      },
      { 
        name: "Physical Education", 
        slug: "physical-education",
        subCategories: [
          { name: "Fitness Testing", slug: "fitness-testing" },
          { name: "Measurement Tools", slug: "measurement-tools" }
        ]
      }
    ]
  },
  { 
    name: "University Equipment", 
    slug: "university-equipment",
    subCategories: [
      { 
        name: "Teaching Kits", 
        slug: "teaching-kits",
        subCategories: [
          { name: "School Kits", slug: "school-kits" },
          { name: "University Kits", slug: "university-kits" },
          { name: "Professional Kits", slug: "professional-kits" }
        ]
      },
      { 
        name: "Research Equipment", 
        slug: "research-equipment",
        subCategories: [
          { name: "Analytical Instruments", slug: "analytical-instruments" },
          { name: "Sample Preparation", slug: "sample-preparation" },
          { name: "Data Collection Tools", slug: "data-collection-tools" }
        ]
      },
      { 
        name: "Lab Furniture", 
        slug: "lab-furniture",
        subCategories: [
          { name: "Workbenches", slug: "workbenches" },
          { name: "Storage Units", slug: "storage-units" },
          { name: "Safety Equipment", slug: "safety-equipment" }
        ]
      }
    ]
  },
  { 
    name: "Manufacturing Equipment", 
    slug: "manufacturing-equipment",
    subCategories: [
      { 
        name: "Quality Control", 
        slug: "quality-control",
        subCategories: [
          { name: "Measuring Instruments", slug: "measuring-instruments" },
          { name: "Testing Equipment", slug: "testing-equipment" },
          { name: "Calibration Tools", slug: "calibration-tools" }
        ]
      },
      { 
        name: "Production Tools", 
        slug: "production-tools",
        subCategories: [
          { name: "Assembly Equipment", slug: "assembly-equipment" },
          { name: "Processing Tools", slug: "processing-tools" },
          { name: "Packaging Equipment", slug: "packaging-equipment" }
        ]
      }
    ]
  },
  // { 
  //   name: "Chemicals", 
  //   slug: "chemicals",
  //   subCategories: [
  //     { 
  //       name: "Laboratory Chemicals", 
  //       slug: "laboratory-chemicals",
  //       subCategories: [
  //         { name: "Acids", slug: "acids" },
  //         { name: "Bases", slug: "bases" },
  //         { name: "Salts", slug: "salts" },
  //         { name: "Organic Chemicals", slug: "organic-chemicals" },
  //         { name: "Inorganic Chemicals", slug: "inorganic-chemicals" },
  //       ]
  //     },
  //     { 
  //       name: "Industrial Chemicals", 
  //       slug: "industrial-chemicals",
  //       subCategories: [
  //         { name: "Cleaning Agents", slug: "cleaning-agents" },
  //         { name: "Adhesives & Resins", slug: "adhesives-resins" },
  //         { name: "Acids & Bases", slug: "acids-bases" }
  //       ]
  //     }
  //   ]
  // },
  { 
    name: "Agricultural Supplies", 
    slug: "agricultural-supplies",
    subCategories: [
      { 
        name: "Agricultural Chemicals", 
        slug: "agricultural-chemicals",
        subCategories: [
          { name: "Fertilizers", slug: "fertilizers" },
          { name: "Pesticides", slug: "pesticides" },
          { name: "Herbicides", slug: "herbicides" },
          { name: "Soil Conditioners", slug: "soil-conditioners" }
        ]
      },
      { 
        name: "Agricultural Medicines", 
        slug: "agricultural-medicines",
        subCategories: [
          { name: "Veterinary Medicines", slug: "veterinary-medicines" },
          { name: "Growth Regulators", slug: "growth-regulators" },
          { name: "Supplements", slug: "supplements" }
        ]
      }
    ]
  },
  { 
    name: "Medical Equipment", 
    slug: "medical-equipment",
    subCategories: [
      { 
        name: "Hospital Equipment", 
        slug: "hospital-equipment",
        subCategories: [
          { name: "Diagnostic Tools", slug: "diagnostic-tools" },
          { name: "Surgical Instruments", slug: "surgical-instruments" },
          { name: "Protective Equipment", slug: "protective-equipment" }
        ]
      },
      { 
        name: "Laboratory Kits", 
        slug: "laboratory-kits",
        subCategories: [
          { name: "Medical Testing Kits", slug: "medical-testing-kits" },
          { name: "Sample Collection Kits", slug: "sample-collection-kits" },
          { name: "Analysis Kits", slug: "analysis-kits" }
        ]
      }
    ]
  }
];

export default categories;
