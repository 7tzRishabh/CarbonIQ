import React from "react";
import { Hammer } from "lucide-react";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-3xl shadow-sm border border-gray-100 m-8">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
        <Hammer className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-sm">
        This section is currently under construction. Stay tuned for updates as we continue building CarbonIQ!
      </p>
    </div>
  );
}
