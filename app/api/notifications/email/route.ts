import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Create transporter for Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Email templates
const emailTemplates = {
  doctorWelcome: (doctor: any) => ({
    subject: `🏥 Welcome to MEDIBOT - ${doctor.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .doctor-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 Welcome to MEDIBOT!</h1>
          </div>
          <div class="content">
            <h2>Hello ${doctor.name},</h2>
            <p>Welcome to the MEDIBOT healthcare platform! Your doctor profile has been successfully created.</p>
            
            <div class="doctor-details">
              <h3>👨‍⚕️ Your Profile Details</h3>
              <p><strong>Name:</strong> ${doctor.name}</p>
              <p><strong>Specialty:</strong> ${doctor.specialty}</p>
              <p><strong>Email:</strong> ${doctor.email}</p>
              <p><strong>Phone:</strong> ${doctor.phone || 'Not provided'}</p>
              <p><strong>License:</strong> ${doctor.licenseNumber || 'Not provided'}</p>
              <p><strong>Experience:</strong> ${doctor.experience || 'Not specified'}</p>
              <p><strong>Consultation Fee:</strong> $${doctor.consultationFee}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/doctor/dashboard" class="button">
                🩺 Access Doctor Dashboard
              </a>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Complete your profile setup in the doctor dashboard</li>
              <li>Review and approve patient appointment requests</li>
              <li>Conduct video consultations with patients</li>
              <li>Manage your availability and schedule</li>
            </ul>
            
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              This is an automated message from MEDIBOT.
              <br>For support, contact us at support@medibot.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  appointmentRequest: (appointment: any) => ({
    subject: `🏥 New Appointment Request - ${appointment.patientName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          .approve-btn { background: #28a745; }
          .reject-btn { background: #dc3545; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 MEDIBOT - New Appointment Request</h1>
          </div>
          <div class="content">
            <h2>Hello Dr. ${appointment.doctorName?.split(' ')[1] || 'Doctor'},</h2>
            <p>You have received a new appointment request from a patient.</p>
            
            <div class="appointment-details">
              <h3>📋 Patient Information</h3>
              <p><strong>Name:</strong> ${appointment.patientName}</p>
              <p><strong>Email:</strong> ${appointment.patientEmail}</p>
              <p><strong>Phone:</strong> ${appointment.patientPhone || 'Not provided'}</p>
            </div>

            <div class="appointment-details">
              <h3>📅 Appointment Details</h3>
              <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
              <p><strong>Consultation Fee:</strong> $${appointment.consultationFee}</p>
            </div>

            <div class="appointment-details">
              <h3>🩺 Medical Information</h3>
              <p><strong>Reason for Visit:</strong> ${appointment.reason}</p>
              ${appointment.symptoms ? `<p><strong>Symptoms:</strong> ${appointment.symptoms}</p>` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/doctor/dashboard" class="button approve-btn">
                ✅ View in Dashboard
              </a>
            </div>
            
            <p>Please log in to your doctor dashboard to approve or reject this appointment request.</p>
            
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              This is an automated message from MEDIBOT. Please do not reply to this email.
              <br>For support, contact us at support@medibot.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  appointmentConfirmation: (appointment: any) => ({
    subject: `✅ Appointment Confirmed - ${appointment.doctorName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Appointment Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hello ${appointment.patientName},</h2>
            <p>Great news! Your appointment has been confirmed by ${appointment.doctorName}.</p>
            
            <div class="appointment-details">
              <h3>📅 Appointment Details</h3>
              <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
              <p><strong>Consultation Fee:</strong> $${appointment.consultationFee}</p>
              <p><strong>Appointment ID:</strong> #${appointment.id}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${appointment.meetingLink || `${process.env.NEXT_PUBLIC_APP_URL}/video-call/${appointment.id}`}" class="button">
                🎥 Join Video Consultation
              </a>
            </div>

            <p><strong>Important Notes:</strong></p>
            <ul>
              <li>Please join the video call 5 minutes before your scheduled time</li>
              <li>Ensure you have a stable internet connection</li>
              <li>Have your medical history and current medications ready</li>
              <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
            </ul>
            
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              This is an automated message from MEDIBOT.
              <br>For support, contact us at support@medibot.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  appointmentRejection: (appointment: any) => ({
    subject: `❌ Appointment Request Update - ${appointment.doctorName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Appointment Request Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${appointment.patientName},</h2>
            <p>We regret to inform you that your appointment request with ${appointment.doctorName} could not be approved at this time.</p>
            
            <div class="appointment-details">
              <h3>📅 Requested Appointment</h3>
              <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
              <p><strong>Reason:</strong> ${appointment.reason}</p>
            </div>

            ${appointment.doctorNotes ? `
            <div class="appointment-details">
              <h3>📝 Doctor's Note</h3>
              <p>${appointment.doctorNotes}</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/patient/appointments" class="button">
                📅 Book Another Appointment
              </a>
            </div>
            
            <p>Don't worry! You can book another appointment with a different doctor or try a different time slot.</p>
            
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              This is an automated message from MEDIBOT.
              <br>For support, contact us at support@medibot.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),
}

// Send email using Nodemailer
async function sendEmail(emailData: {
  to: string
  subject: string
  html: string
  from?: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables.")
      return {
        success: false,
        error: "Email service not configured"
      }
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: emailData.from || process.env.EMAIL_USER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    }

    const result = await transporter.sendMail(mailOptions)
    
    console.log("✅ Email sent successfully!")
    console.log("📧 Message ID:", result.messageId)
    console.log("📧 To:", emailData.to)
    console.log("📧 Subject:", emailData.subject)
    
    return {
      success: true,
      messageId: result.messageId
    }
  } catch (error) {
    console.error("❌ Email sending error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error"
    }
  }
}

// POST - Send email notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, appointment, doctor } = body

    if (!type) {
      return NextResponse.json(
        { error: "Missing required field: type" },
        { status: 400 }
      )
    }

    let emailData: {
      to: string
      subject: string
      html: string
      from?: string
    }

    switch (type) {
      case "doctorWelcome":
        if (!doctor) {
          return NextResponse.json(
            { error: "Missing doctor data for welcome email" },
            { status: 400 }
          )
        }
        const welcomeTemplate = emailTemplates.doctorWelcome(doctor)
        emailData = {
          to: doctor.email,
          from: process.env.EMAIL_USER,
          subject: welcomeTemplate.subject,
          html: welcomeTemplate.html
        }
        break

      case "appointmentRequest":
        if (!appointment) {
          return NextResponse.json(
            { error: "Missing appointment data" },
            { status: 400 }
          )
        }
        const requestTemplate = emailTemplates.appointmentRequest(appointment)
        emailData = {
          to: appointment.doctorEmail,
          from: process.env.EMAIL_USER,
          subject: requestTemplate.subject,
          html: requestTemplate.html
        }
        break

      case "appointmentConfirmation":
        if (!appointment) {
          return NextResponse.json(
            { error: "Missing appointment data" },
            { status: 400 }
          )
        }
        const confirmTemplate = emailTemplates.appointmentConfirmation(appointment)
        emailData = {
          to: appointment.patientEmail,
          from: process.env.EMAIL_USER,
          subject: confirmTemplate.subject,
          html: confirmTemplate.html
        }
        break

      case "appointmentRejection":
        if (!appointment) {
          return NextResponse.json(
            { error: "Missing appointment data" },
            { status: 400 }
          )
        }
        const rejectionTemplate = emailTemplates.appointmentRejection(appointment)
        emailData = {
          to: appointment.patientEmail,
          from: process.env.EMAIL_USER,
          subject: rejectionTemplate.subject,
          html: rejectionTemplate.html
        }
        break

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        )
    }

    // Send email
    const result = await sendEmail(emailData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully!",
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { 
          error: result.error || "Failed to send email",
          details: "Please check your email configuration in environment variables"
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in email API:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}