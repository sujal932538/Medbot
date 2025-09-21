"use client"

import React, { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function GetStartedPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [role, setRole] = useState<"patient" | "doctor" | "admin" | "">("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // applyRole: set clerk role, create convex user, then redirect
  async function applyRole(chosenRole: "patient" | "doctor" | "admin" | "") {
    if (!chosenRole) throw new Error("No role selected")
    if (!user) throw new Error("User not authenticated")
    setError(null)

    // Update Clerk user metadata
    await user.update({
      publicMetadata: { role: chosenRole }
    })

    // Create Convex user profile
    const createRes = await fetch("/api/users/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerkId: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.primaryPhoneNumber?.phoneNumber || "",
        role: chosenRole,
      }),
    })
    const createPayload = await createRes.json().catch(() => ({}))
    console.log("create user response", createRes.status, createPayload)
    if (!createRes.ok) {
      throw new Error(createPayload?.error || "Failed to create profile")
    }

    // Redirect
    if (chosenRole === "admin") router.push("/admin/dashboard")
    else if (chosenRole === "doctor") router.push("/doctor/dashboard")
    else router.push("/patient/dashboard")
  }

  // Auto-apply pending role after sign-in
  useEffect(() => {
    const run = async () => {
      try {
        const pending = typeof window !== "undefined" ? localStorage.getItem("pendingRole") : null
        if (pending && isLoaded && user) {
          localStorage.removeItem("pendingRole")
          setLoading(true)
          await applyRole(pending as "patient" | "doctor" | "admin")
        }
      } catch (e: any) {
        console.error("auto apply failed", e)
        setError(e?.message || String(e))
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [isLoaded, user])

  const handleCardClick = async (chosen: "patient" | "doctor" | "admin") => {
    setRole(chosen)
    if (isLoaded && user) {
      setLoading(true)
      try {
        await applyRole(chosen)
      } catch (e: any) {
        console.error(e)
        setError(e?.message || String(e))
      } finally {
        setLoading(false)
      }
    } else {
      try {
        localStorage.setItem("pendingRole", chosen)
      } catch {}
      router.push("/login")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!role) return setError("Please choose a role")
    setLoading(true)
    try {
      await applyRole(role)
    } catch (e: any) {
      console.error(e)
      setError(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold">Get started</h2>
        <p className="text-sm text-muted-foreground">Choose your role to continue</p>

        <div className="grid grid-cols-1 gap-3">
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick("patient")}
            className={`p-4 border rounded cursor-pointer ${role === "patient" ? "border-blue-500" : ""}`}
          >
            <input
              type="radio"
              name="role"
              value="patient"
              className="mr-2"
              onChange={() => setRole("patient")}
              checked={role === "patient"}
            />
            <strong>Patient</strong> — Chat with AI, track vitals, book appointments, order medicines
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick("doctor")}
            className={`p-4 border rounded cursor-pointer ${role === "doctor" ? "border-blue-500" : ""}`}
          >
            <input
              type="radio"
              name="role"
              value="doctor"
              className="mr-2"
              onChange={() => setRole("doctor")}
              checked={role === "doctor"}
            />
            <strong>Doctor</strong> — View and respond to appointment requests
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick("admin")}
            className={`p-4 border rounded cursor-pointer ${role === "admin" ? "border-blue-500" : ""}`}
          >
            <input
              type="radio"
              name="role"
              value="admin"
              className="mr-2"
              onChange={() => setRole("admin")}
              checked={role === "admin"}
            />
            <strong>Admin</strong> — Manage users, doctors, pharmacy info, view vitals
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  )
}