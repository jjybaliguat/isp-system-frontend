"use client";

import { modemDocs } from '@/app/constants/modem-docs';
import ImageViewer from '@/components/dialogs/image-viewer-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { use, useState } from 'react';

export default function ModemDetailPage({
  params
}: {
  params:  Promise<{ slug: string }>
}) {
    const { slug } = use(params);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const modem = modemDocs.find(m => m.slug === slug);

  if (!modem) return notFound();

  return (
    <>
        <div className="min-h-screen bg-gray-50">
        {/* HEADER */}
        <div className="bg-white border-b">
            <Button onClick={() => window.history.back()} className="mb-4">
                ← Back
            </Button>
            <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                
                <Image
                src={modem.image}
                alt={modem.name}
                width={220}
                height={140}
                className="rounded-xl border object-cover"
                />

                <div className="flex-1">
                <h1 className="text-3xl font-bold">{modem.name}</h1>

                <span className="inline-block mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                    {modem.connectionType}
                </span>

                <p className="text-gray-600 mt-3 max-w-2xl">
                    {modem.description}
                </p>
                </div>
            </div>
            </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto p-6 space-y-8">

            {/* GRID LAYOUT */}
            <div className="grid md:grid-cols-3 gap-6">

            {/* LEFT SIDE */}
            <div className="md:col-span-1 space-y-6">

                {/* CREDENTIALS CARD */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border">
                <h2 className="font-semibold text-lg mb-4">
                    🔐 Login Credentials
                </h2>

                <div className="space-y-2 text-sm">
                    <p><span className="font-medium">IP:</span> {modem.credentials.ipAddress}</p>
                    <p><span className="font-medium">Username:</span> {modem.credentials.username}</p>
                    <p><span className="font-medium">Password:</span> {modem.credentials.password}</p>

                    {modem.credentials.defaultSuperAdminPass && (
                    <p className="text-red-600">
                        <span className="font-medium">Super Admin:</span> {modem.credentials.defaultSuperAdminPass}
                    </p>
                    )}
                </div>
                </div>

                {/* WIFI INFO */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border">
                <h2 className="font-semibold text-lg mb-4">
                    📶 Default WiFi
                </h2>

                <p className="text-sm">
                    <span className="font-medium">SSID:</span> {modem.networkConfig.wifi.defaultSSID}
                </p>
                <p className="text-sm">
                    <span className="font-medium">Password:</span> {modem.networkConfig.wifi.defaultPassword}
                </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="md:col-span-2 space-y-6">

                {/* LOGIN UI */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border">
                <h2 className="font-semibold text-lg mb-4">
                    🖥️ Login Interface
                </h2>

                <Image
                    src={modem.loginImage}
                    alt="Login"
                    width={800}
                    height={400}
                    className="rounded-xl border"
                />
                </div>

                {/* WAN CONFIG */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border">
                <h2 className="font-semibold text-lg mb-4">
                    🌐 WAN Configuration
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    {modem.networkConfig.wanConfigImage.map((img, i) => (
                    <Image
                        key={i}
                        src={img}
                        alt="WAN"
                        width={400}
                        height={250}
                        className="rounded-xl border hover:scale-[1.02] transition"
                        onClick={() => setSelectedImage(img)}
                    />
                    ))}
                </div>
                </div>

                {/* WIFI CONFIG */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border">
                <h2 className="font-semibold text-lg mb-4">
                    📡 WiFi Configuration
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    {modem.networkConfig.wifi.configImages.map((img, i) => (
                    <Image
                        key={i}
                        src={img}
                        alt="WiFi"
                        width={400}
                        height={250}
                        className="rounded-xl border hover:scale-[1.02] transition"
                        onClick={() => setSelectedImage(img)}
                    />
                    ))}
                </div>
                </div>

            </div>
            </div>
        </div>
        </div>
        <ImageViewer previewImage={selectedImage} setPreviewImage={setSelectedImage} />
    </>
  );
}