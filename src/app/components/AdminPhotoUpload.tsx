"use client"

import { useRef, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function AdminPhotoUpload() {
    const inputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [location, setLocation] = useState("")
    const [alt, setAlt] = useState("")
    const [status, setStatus] = useState<string>("")

    const onSelectFile = (f: File) => {
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (e.dataTransfer.files?.[0]) {
            onSelectFile(e.dataTransfer.files[0])
        }
    }

    const submit = async () => {
        if (!file) return setStatus("Choisis une photo")
        setStatus("Upload en cours…")

        const fd = new FormData()
        fd.append("photo", file)
        fd.append("location", location)
        fd.append("alt", alt)

        try {
            const r = await fetch("/api/gallery/upload", {
                method: "POST",
                body: fd,
                credentials: "include",
            })

            if (!r.ok) {
                const txt = await r.text()
                throw new Error(txt)
            }

            setStatus("✅ Photo envoyée")
            setFile(null)
            setPreview(null)
            setLocation("")
            setAlt("")
            if (inputRef.current) inputRef.current.value = ""
        } catch (e: any) {
            setStatus("❌ Erreur: " + String(e?.message ?? e))
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Uploader une photo</h1>

            {/* Zone drop */}
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-muted/30 transition"
            >
                {preview ? (
                    <img src={preview} className="max-h-64 mx-auto rounded-lg" />
                ) : (
                    <p className="text-muted-foreground">
                        Clique ou glisse une photo ici
                    </p>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    if (e.target.files?.[0]) onSelectFile(e.target.files[0])
                }}
            />

            <div className="space-y-3">
                <Input
                    placeholder="Lieu (optionnel)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <Input
                    placeholder="Description (alt) (optionnel)"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                />
            </div>

            <Button onClick={submit} disabled={!file}>
                Uploader
            </Button>

            {status && <div className="text-sm">{status}</div>}
        </div>
    )
}
