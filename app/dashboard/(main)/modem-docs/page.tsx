"use client";

import { useState } from "react";
import { modemDocs } from "@/app/constants/modem-docs";
import ModemCard from "@/components/cards/ModemCard";
import { Router } from "lucide-react";
import { withRoleGuard } from "@/lib/withRoleGuard";
import { UserRole } from "@/types/users";

function ModemsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredModems = modemDocs.filter((modem) => {
    const matchesSearch = modem.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || modem.connectionType === filter;

    return matchesSearch && matchesFilter;
  });

  const connectionTypes = [
    "ALL",
    ...new Set(modemDocs.map((m) => m.connectionType)),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="flex gap-2 items-center text-3xl font-bold"><Router /> Modem Documentation</h1>
          <p className="text-gray-500 mt-1">
            Access configuration guides, credentials, and setup instructions.
          </p>

          {/* SEARCH + FILTER */}
          <div className="mt-4 flex flex-col md:flex-row gap-3">
            
            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search modem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-xl outline-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            {/* FILTER */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-xl"
            >
              {connectionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

          </div>
          <p className="mt-4">Modem Flasher Link: <a href="https://drive.google.com/drive/folders/1M_ICc0x7Y5kZFtr9meVJCWoh8mi-g8YZ?usp=sharing" target="_blank" className="text-blue-500 hover:underline">Click here</a></p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6">

        {/* RESULT COUNT */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredModems.length} modem(s)
        </p>

        {/* GRID */}
        {filteredModems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredModems.map((modem) => (
              <ModemCard key={modem.slug} modem={modem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No modems found</p>
            <p className="text-sm">Try adjusting your search or filter</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default withRoleGuard(ModemsPage, {roles: [UserRole.ADMIN, UserRole.SUPERADMIN]})