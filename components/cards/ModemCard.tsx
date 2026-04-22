'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ModemDoc } from '@/app/constants/modem-docs';

export default function ModemCard({ modem }: { modem: ModemDoc }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dashboard/modem-docs/${modem.slug}`)}
      className="cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition border bg-white overflow-hidden"
    >
      {/* FIXED IMAGE CONTAINER */}
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={modem.image}
          alt={modem.name}
          fill
          className="object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h2 className="text-lg font-semibold line-clamp-1">
          {modem.name}
        </h2>

        <p className="text-sm text-gray-500">
          {modem.connectionType}
        </p>
      </div>
    </div>
  );
}