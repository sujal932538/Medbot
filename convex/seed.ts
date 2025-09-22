import { mutation } from "./_generated/server";

export const seedDoctors = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if doctors already exist
    const existingDoctors = await ctx.db.query("doctors").collect();
    // Remove this check to allow re-seeding for development
    // if (existingDoctors.length > 0) {
    //   return { message: "Doctors already seeded", count: existingDoctors.length };
    // }

    // Only seed if no doctors exist
    if (existingDoctors.length === 0) {
      const sampleDoctors = [
        {
          name: "Dr. Sarah Johnson",
          specialty: "General Medicine",
          email: "sarah.johnson@medibot.com",
          phone: "+1 (555) 123-4567",
          licenseNumber: "MD123456",
          experience: "8 years",
          education: "MD from Harvard Medical School",
          about: "Dr. Sarah Johnson is a dedicated general practitioner with over 8 years of experience in primary care.",
          languages: ["English", "Spanish"],
          availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          consultationFee: 150,
          rating: 4.8,
          totalReviews: 245,
          image: "/placeholder-user.jpg",
          status: "active" as const,
        }
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
    }

    return { message: "Doctors already exist", count: existingDoctors.length };
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