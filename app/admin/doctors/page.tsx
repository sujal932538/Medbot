"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function DoctorsPage() {
  const doctors = useQuery(api.doctors.getAllDoctors, {}) || []
  const createDoctor = useMutation(api.doctors.createDoctor)
  const updateDoctor = useMutation(api.doctors.updateDoctor)
  const deleteDoctor = useMutation(api.doctors.deleteDoctor)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  const { toast } = useToast()

  const handleAddDoctor = async (formData: FormData) => {
    try {
      const doctorData = {
        name: formData.get("name") as string,
        specialty: formData.get("specialty") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        licenseNumber: formData.get("licenseNumber") as string,
        experience: formData.get("experience") as string || "5+ years",
        education: formData.get("education") as string || "Medical Degree",
        about: formData.get("about") as string || "Experienced medical professional",
        languages: ["English"],
        availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        consultationFee: 150,
        status: "active" as const,
      }

      await createDoctor(doctorData)
      setIsAddDialogOpen(false)
      toast({
        title: "Doctor Added Successfully",
        description: `${doctorData.name} has been added to the system.`,
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
        status: formData.get("status") as "active" | "inactive",
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
          <Select name="specialty" defaultValue={doctor?.specialty}>
            <SelectTrigger>
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General Medicine">General Medicine</SelectItem>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              <SelectItem value="Dermatology">Dermatology</SelectItem>
              <SelectItem value="Psychiatry">Psychiatry</SelectItem>
              <SelectItem value="Orthopedics">Orthopedics</SelectItem>
              <SelectItem value="Neurology">Neurology</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={doctor?.email} placeholder="doctor@medibot.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={doctor?.phone} placeholder="+1 (555) 123-4567" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input id="licenseNumber" name="licenseNumber" defaultValue={doctor?.licenseNumber} placeholder="MD123456" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Experience</Label>
          <Input id="experience" name="experience" defaultValue={doctor?.experience} placeholder="5+ years" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Input id="education" name="education" defaultValue={doctor?.education} placeholder="MD from Medical School" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <Input id="about" name="about" defaultValue={doctor?.about} placeholder="Brief description about the doctor" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {doctor && (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={doctor.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
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
            <p className="text-gray-600 dark:text-gray-300">Manage doctor profiles and their access to the platform</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>Enter the doctor's information to add them to the platform</DialogDescription>
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
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-green-600" />
                      <span>{doctor.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <span>{doctor.specialty}</span>
                      </div>
                      {doctor.licenseNumber && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">License: {doctor.licenseNumber}</span>
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                    {doctor.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {doctor.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{doctor.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span>{doctor.email}</span>
                    </div>
                    {doctor.experience && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Experience: {doctor.experience}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Fee: ${doctor.consultationFee}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingDoctor(doctor)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Doctor</DialogTitle>
                          <DialogDescription>Update doctor information</DialogDescription>
                        </DialogHeader>
                        <PharmacyForm pharmacy={editingDoctor} onSubmit={handleEditDoctor} />
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteDoctor(doctor._id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}