"use client"
import React from 'react'
import { FiHome, FiCamera, FiCrosshair } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function BottomBar({ activePage }) {
    const router = useRouter();

    const navItems = [
        { name: "Home", icon: <FiHome />, path: "/Home" },
        { name: "About", icon: <FiCrosshair />, path: "/about" },
        { name: "Camera", icon: <FiCamera />, path: "/camera" },
      ];

  return (
    <div className="block fixed bottom-0 left-0 w-full bg-black shadow-md z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center text-sm cursor-pointer transition-all ${
              activePage === item.name ? "text-[#FDC700] font-bold" : "text-[#8D8686]"
            }`}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                activePage === item.name ? "text-[#FDC700]" : "text-[#8D8686]"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
    
  )
}
