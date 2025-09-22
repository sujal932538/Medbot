"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, UserCheck, Phone, Mail, GraduationCap, Award } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

const specialties = [
  "General Medicine",
  "Cardiology", 
  "Pediatrics",
  "Dermatology",
  "Psychiatry",
  "Orthopedics",
  "Neurology",
  "Gynecology",
  "Ophthalmology",
  "ENT (Otolaryngology)"
]

const languages = [
  "English",
  "Spanish", 
  "French",
  "German",
  "Mandarin",
  "Hindi",
  "Arabic",
  "Portuguese"
]

const availabilityDays = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

export default function DoctorsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
  const { toast } = useToast()

  const doctors = useQuery(api.doctors.getAllDoctors, {}) || []
  const createDoctor = useMutation(api.doctors.createDoctor)
  const updateDoctor = useMutation(api.doctors.updateDoctor)
  const deleteDoctor = useMutation(api.doctors.deleteDoctor)

  const handleAddDoctor = async (formData: FormData) => {
    try {
      const doctorData = {
        name: formData.get("name") as string,
        specialty: formData.get("specialty") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        licenseNumber: formData.get("licenseNumber") as string,
        experience: formData.get("experience") as string,
        education: formData.get("education") as string,
        about: formData.get("about") as string,
        languages: selectedLanguages,
        availability: selectedAvailability,
        consultationFee: parseInt(formData.get("consultationFee") as string) || 150,
      }

      await createDoctor(doctorData)

      // Send welcome email to doctor
      try {
        const emailResponse = await fetch("/api/notifications/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "doctorWelcome",
            doctor: doctorData,
          }),
        })

        if (emailResponse.ok) {
          console.log("Welcome email sent to doctor successfully")
        }
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError)
      }

      setIsAddDialogOpen(false)
      setSelectedLanguages(["English"])
      setSelectedAvailability(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
      
      toast({
        title: "Doctor Added Successfully",
        description: "New doctor has been added to the system and notified via email.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add doctor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditDoctor = async (formData: FormData) => {
    if (!editingDoctor) return

    try {
      await updateDoctor({
        id: editingDoctor._id,
        name: formData.get("name") as string,
        specialty: formData.get("specialty") as string,
        phone: formData.get("phone") as string,
        licenseNumber: formData.get("licenseNumber") as string,
        experience: formData.get("experience") as string,
        education: formData.get("education") as string,
        about: formData.get("about") as string,
        consultationFee: parseInt(formData.get("consultationFee") as string),
      })

      setEditingDoctor(null)
      toast({
        title: "Doctor Updated Successfully",
        description: "Doctor information has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update doctor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      await deleteDoctor({ id: doctorId as any })
      toast({
        title: "Doctor Removed",
        description: "Doctor has been removed from the system.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove doctor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const DoctorForm = ({ doctor, onSubmit }: { doctor?: any; onSubmit: (formData: FormData) => void }) => (
    <form onSubmit={(e) => {
      e.preventDefault()
      onSubmit(new FormData(e.currentTarget))
    }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" defaultValue={doctor?.name} placeholder="Dr. John Smith" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty</Label>
          <Select name="specialty" defaultValue={doctor?.specialty} required>
            <SelectTrigger>
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={doctor?.email} placeholder="doctor@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={doctor?.phone} placeholder="+1 (555) 123-4567" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input id="licenseNumber" name="licenseNumber" defaultValue={doctor?.licenseNumber} placeholder="MD123456" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Experience</Label>
          <Input id="experience" name="experience" defaultValue={doctor?.experience} placeholder="5 years" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Input id="education" name="education" defaultValue={doctor?.education} placeholder="MD from Harvard Medical School" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <Textarea id="about" name="about" defaultValue={doctor?.about} placeholder="Brief description about the doctor..." rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
        <Input id="consultationFee" name="consultationFee" type="number" defaultValue={doctor?.consultationFee || 150} min="0" />
      </div>

      <div className="space-y-2">
        <Label>Languages</Label>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((language) => (
            <label key={language} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedLanguages.includes(language)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedLanguages([...selectedLanguages, language])
                  } else {
                    setSelectedLanguages(selectedLanguages.filter(l => l !== language))
                  }
                }}
              />
              <span className="text-sm">{language}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Availability</Label>
        <div className="grid grid-cols-2 gap-2">
          {availabilityDays.map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedAvailability.includes(day)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAvailability([...selectedAvailability, day])
                  } else {
                    setSelectedAvailability(selectedAvailability.filter(d => d !== day))
                  }
                }}
              />
              <span className="text-sm">{day}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {doctor ? "Update Doctor" : "Add Doctor"}
      </Button>
    </form>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage doctor profiles and credentials</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>Enter doctor details to add them to the system</DialogDescription>
              </DialogHeader>
              <DoctorForm onSubmit={handleAddDoctor} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription className="text-blue-600 font-medium">{doctor.specialty}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                    {doctor.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span>{doctor.email}</span>
                    </div>
                    {doctor.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{doctor.phone}</span>
                      </div>
                    )}
                    {doctor.licenseNumber && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Award className="h-3 w-3 text-gray-400" />
                        <span>License: {doctor.licenseNumber}</span>
                      </div>
                    )}
                    {doctor.education && (
                      <div className="flex items-center space-x-2 text-sm">
                        <GraduationCap className="h-3 w-3 text-gray-400" />
                        <span>{doctor.education}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Experience & Fee</h4>
                    <div className="flex justify-between text-sm">
                      <span>{doctor.experience}</span>
                      <span className="font-semibold text-green-600">${doctor.consultationFee}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.map((language: string) => (
                        <Badge key={language} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Availability</h4>
                    <div className="flex flex-wrap gap-1">
                      {doctor.availability.map((day: string) => (
                        <Badge key={day} variant="secondary" className="text-xs">
                          {day.slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {doctor.about && (
                    <div>
                      <h4 className="font-medium mb-1">About</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {doctor.about}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingDoctor(doctor)
                          setSelectedLanguages(doctor.languages || ["English"])
                          setSelectedAvailability(doctor.availability || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
                        }}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Doctor</DialogTitle>
                          <DialogDescription>Update doctor information</DialogDescription>
                        </DialogHeader>
                        <DoctorForm doctor={editingDoctor} onSubmit={handleEditDoctor} />
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteDoctor(doctor._id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {doctors.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Doctors Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Add medical professionals to enable patient consultations.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Doctor
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}