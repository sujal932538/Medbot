"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
  Video,
  AlertTriangle,
  Stethoscope,
} from "lucide-react"
import { DoctorLayout } from "@/components/doctor-layout"
import { useToast } from "@/hooks/use-toast"
import { AppointmentList } from "./components/appointment-list"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"

export default function DoctorDashboard() {
  const { user } = useUser()
  const doctor = useQuery(api.doctors.getDoctorByClerkId, 
    user ? { clerkId: user.id } : "skip"
  )
  const appointments = useQuery(api.appointments.getDoctorAppointments, 
    doctor ? { doctorId: doctor._id } : "skip"
  ) || []
  const updateAppointmentMutation = useMutation(api.appointments.updateAppointment)

  const { toast } = useToast()

  const handleAppointmentAction = async (appointmentId: string, action: "approve" | "reject") => {
    const appointment = appointments.find(apt => apt._id === appointmentId)
    if (!appointment) return

    try {
      // Update appointment status in Convex
      await updateAppointmentMutation({
        id: appointmentId as any,
        status: action === "approve" ? "approved" : "rejected",
        doctorNotes: action === "reject" ? "Doctor is not available at the requested time" : "Appointment confirmed",
        meetingLink: action === "approve" ? `https://medibot-meet.com/room/${appointmentId}` : undefined,
      })

      // Send email notification to patient
      const emailResponse = await fetch("/api/notifications/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: action === "approve" ? "appointmentConfirmation" : "appointmentRejection",
          appointment: {
            ...appointment,
            id: appointmentId,
            status: action === "approve" ? "approved" : "rejected",
            doctorNotes: action === "reject" ? "Doctor is not available at the requested time" : "Appointment confirmed",
            meetingLink: action === "approve" ? `${process.env.NEXT_PUBLIC_APP_URL}/video-call/${appointmentId}` : undefined,
          },
        }),
      })

      const emailResult = await emailResponse.json()
      if (emailResponse.ok && emailResult.success) {
        console.log("✅ Email notification sent to patient successfully:", emailResult.messageId)
      } else {
        console.error("❌ Failed to send email to patient:", emailResult.error)
      }

      toast({
        title: action === "approve" ? "Appointment Approved" : "Appointment Rejected",
        description: emailResponse.ok 
          ? `Patient notified via email! ${action === "approve" ? "Confirmation" : "Rejection"} email sent successfully.`
          : `Appointment ${action}d but email notification failed. Please contact the patient directly.`,
      })
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20"
      case "medium":
        return "bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20"
      case "low":
        return "bg-green-100 border-green-200 text-green-800 dark:bg-green-900/20"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-900/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const stats = {
    totalAppointments: appointments?.length || 0,
    pendingApprovals: appointments?.filter((apt) => apt.status === "pending").length || 0,
    todayScheduled: appointments?.filter((apt) => apt.status === "approved").length || 0,
    highPriority: 0, // Will be calculated from symptoms analysis
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your appointments and patient consultations</p>
          </div>
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium">{doctor?.name || "Doctor"}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingApprovals}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Schedule</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayScheduled}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Appointments Yet</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You don't have any appointment requests yet. Patients will be able to book appointments with you.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                        <CardDescription>{appointment.patientEmail}</CardDescription>
                      </div>
                      <Badge variant={appointment.status === "pending" ? "secondary" : 
                                   appointment.status === "approved" ? "default" : "destructive"}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-1">Appointment Details</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Reason</h4>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                      </div>
                      {appointment.symptoms && (
                        <div>
                          <h4 className="font-medium mb-1">Symptoms</h4>
                          <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium mb-1">Consultation Fee</h4>
                        <p className="text-sm text-green-600 font-semibold">${appointment.consultationFee}</p>
                      </div>
                      
                      {appointment.status === "pending" && (
                        <div className="flex space-x-2 pt-3 border-t">
                          <Button 
                            size="sm" 
                            className="flex-1" 
                            onClick={() => handleAppointmentAction(appointment._id, "approve")}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="flex-1" 
                            onClick={() => handleAppointmentAction(appointment._id, "reject")}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {appointment.status === "approved" && (
                        <div className="flex space-x-2 pt-3 border-t">
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <a href={appointment.meetingLink || `https://medibot-meet.com/room/${appointment._id}`} target="_blank">
                              <Video className="mr-2 h-4 w-4" />
                              Start Call
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DoctorLayout>
  )
}