import { type NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Helper function to validate appointment data
function validateAppointmentData(data: any) {
  const required = ["patientName", "patientEmail", "appointmentDate", "appointmentTime", "reason"]
  const missing = required.filter((field) => !data[field])

  if (missing.length > 0) {
    return { valid: false, message: `Missing required fields: ${missing.join(", ")}` }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.patientEmail)) {
    return { valid: false, message: "Invalid email format" }
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(data.appointmentDate)) {
    return { valid: false, message: "Invalid date format. Use YYYY-MM-DD" }
  }

  // Validate time format (HH:MM)
  const timeRegex = /^\d{2}:\d{2}$/
  if (!timeRegex.test(data.appointmentTime)) {
    return { valid: false, message: "Invalid time format. Use HH:MM" }
  }

  return { valid: true }
}

// POST - Book appointment with specific doctor
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/appointments/book - Booking appointment with doctor")

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    console.log("Received booking data:", body)

    // Validate required fields
    const validation = validateAppointmentData(body)
    if (!validation.valid) {
      console.error("Validation error:", validation.message)
      return NextResponse.json({ error: validation.message }, { status: 400 })
    }

    // Create appointment data
    const appointmentData = {
      patientId: body.patientId || "patient_ronakw",
      patientName: body.patientName.trim(),
      patientEmail: body.patientEmail.trim().toLowerCase(),
      patientPhone: body.patientPhone?.trim() || "",
      doctorId: body.doctorId,
      doctorName: body.doctorName,
      doctorEmail: body.doctorEmail,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      reason: body.reason.trim(),
      symptoms: body.symptoms?.trim() || "",
      consultationFee: body.consultationFee || 0,
    }

    // Save to database
    const appointmentId = await convex.mutation(api.appointments.createAppointment, appointmentData)

    console.log("Appointment created successfully:", appointmentId)

    // Send email notification to doctor
    try {
      console.log("Sending real-time email notification to doctor...")
      const emailResponse = await fetch(`${request.nextUrl.origin}/api/notifications/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "appointmentRequest",
            ...appointmentData,
            id: appointmentId,
        }),
      })

      const emailResult = await emailResponse.json()
      
      if (emailResponse.ok && emailResult.success) {
        console.log("✅ Real-time email sent successfully to doctor:", emailResult.messageId)
      } else {
        console.error("❌ Failed to send email notification:", emailResult.error)
      }
    } catch (emailError) {
      console.error("Error sending email notification:", emailError)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully! Doctor notified via email in real-time.",
        appointmentId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error booking appointment:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Failed to book appointment",
      },
      { status: 500 },
    )
  }
}