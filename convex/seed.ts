import { mutation } from "./_generated/server";

export const seedDoctors = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if doctors already exist
    const existingDoctors = await ctx.db.query("doctors").collect();
    if (existingDoctors.length > 0) {
      return { message: "Doctors already seeded", count: existingDoctors.length };
    }

    const sampleDoctors = [
      {
        name: "Dr. Sarah Johnson",
        specialty: "General Medicine",
        email: "sarah.johnson@medibot.com",
        phone: "+1 (555) 123-4567",
        licenseNumber: "MD123456",
        experience: "8 years",
        education: "MD from Harvard Medical School",
        about: "Dr. Sarah Johnson is a dedicated general practitioner with over 8 years of experience in primary care. She specializes in preventive medicine and chronic disease management.",
        languages: ["English", "Spanish"],
        availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        consultationFee: 150,
        rating: 4.8,
        totalReviews: 245,
        image: "/placeholder-user.jpg",
        status: "active" as const,
      },
      {
        name: "Dr. Michael Chen",
        specialty: "Cardiology",
        email: "michael.chen@medibot.com",
        phone: "+1 (555) 234-5678",
        licenseNumber: "MD234567",
        experience: "12 years",
        education: "MD from Johns Hopkins University",
        about: "Dr. Michael Chen is a board-certified cardiologist with extensive experience in treating heart conditions. He specializes in interventional cardiology.",
        languages: ["English", "Mandarin"],
        availability: ["Monday", "Wednesday", "Friday"],
        consultationFee: 250,
        rating: 4.9,
        totalReviews: 189,
        image: "/placeholder-user.jpg",
        status: "active" as const,
      },
      {
        name: "Dr. Emily Rodriguez",
        specialty: "Pediatrics",
        email: "emily.rodriguez@medibot.com",
        phone: "+1 (555) 345-6789",
        licenseNumber: "MD345678",
        experience: "10 years",
        education: "MD from Stanford University",
        about: "Dr. Emily Rodriguez is a compassionate pediatrician who has been caring for children and adolescents for over 10 years.",
        languages: ["English", "Spanish"],
        availability: ["Tuesday", "Thursday", "Saturday"],
        consultationFee: 180,
        rating: 4.7,
        totalReviews: 156,
        image: "/placeholder-user.jpg",
        status: "active" as const,
      },
      {
        name: "Dr. David Wilson",
        specialty: "Dermatology",
        email: "david.wilson@medibot.com",
        phone: "+1 (555) 456-7890",
        licenseNumber: "MD456789",
        experience: "15 years",
        education: "MD from UCLA Medical School",
        about: "Dr. David Wilson is a renowned dermatologist with 15 years of experience in treating skin conditions.",
        languages: ["English"],
        availability: ["Monday", "Tuesday", "Thursday", "Friday"],
        consultationFee: 200,
        rating: 4.6,
        totalReviews: 203,
        image: "/placeholder-user.jpg",
        status: "active" as const,
      },
      {
        name: "Dr. Lisa Thompson",
        specialty: "Psychiatry",
        email: "lisa.thompson@medibot.com",
        phone: "+1 (555) 567-8901",
        licenseNumber: "MD567890",
        experience: "9 years",
        education: "MD from Yale University",
        about: "Dr. Lisa Thompson is a compassionate psychiatrist specializing in anxiety disorders, depression, and cognitive behavioral therapy.",
        languages: ["English", "French"],
        availability: ["Monday", "Wednesday", "Thursday", "Friday"],
        consultationFee: 220,
        rating: 4.8,
        totalReviews: 167,
        image: "/placeholder-user.jpg",
        status: "active" as const,
      },
    ];

    const doctorIds = [];
    for (const doctor of sampleDoctors) {
      const id = await ctx.db.insert("doctors", doctor);
      doctorIds.push(id);
    }

    return { 
      message: "Sample doctors seeded successfully", 
      count: doctorIds.length,
      doctorIds 
    };
  },
});

export const seedPharmacies = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if pharmacies already exist
    const existingPharmacies = await ctx.db.query("pharmacies").collect();
    if (existingPharmacies.length > 0) {
      return { message: "Pharmacies already seeded", count: existingPharmacies.length };
    }

    const samplePharmacies = [
      {
        name: "MediCare Pharmacy",
        address: "123 Health St, Medical District",
        phone: "+1 (555) 111-2222",
        email: "orders@medicare-pharmacy.com",
        deliveryTime: "30-45 mins",
        medicines: [
          { id: "med_1", name: "Paracetamol 500mg", price: 5.99, description: "Pain relief and fever reducer", inStock: true },
          { id: "med_2", name: "Vitamin D3", price: 12.99, description: "Bone health supplement", inStock: true },
          { id: "med_3", name: "Cough Syrup", price: 8.50, description: "Relief from dry cough", inStock: true },
        ],
        status: "active" as const,
      },
      {
        name: "QuickMeds Express",
        address: "456 Wellness Ave, Downtown",
        phone: "+1 (555) 333-4444",
        email: "support@quickmeds.com",
        deliveryTime: "20-30 mins",
        medicines: [
          { id: "med_4", name: "Ibuprofen 400mg", price: 7.99, description: "Anti-inflammatory medication", inStock: true },
          { id: "med_5", name: "Multivitamin", price: 15.99, description: "Daily vitamin supplement", inStock: true },
          { id: "med_6", name: "Antacid Tablets", price: 6.50, description: "Stomach acid relief", inStock: false },
        ],
        status: "active" as const,
      },
    ];

    const pharmacyIds = [];
    for (const pharmacy of samplePharmacies) {
      const id = await ctx.db.insert("pharmacies", pharmacy);
      pharmacyIds.push(id);
    }

    return { 
      message: "Sample pharmacies seeded successfully", 
      count: pharmacyIds.length,
      pharmacyIds 
    };
  },
});