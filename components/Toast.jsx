"use client"

export default function Toast({ message, show }) {
  if (!show) return null

  return (
    <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50 animate-bounce">
      {message}
    </div>
  )
}