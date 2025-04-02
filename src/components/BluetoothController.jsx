"use client"
import { useState } from "react";

export default function BluetoothController() {
  const [connected, setConnected] = useState(false);
  const [pid, setPid] = useState({ P: "", I: "", D: "" });
  const [fopid, setFopid] = useState({ F: "", O: "", P: "", I: "", D: "" });
  const [activeSection, setActiveSection] = useState(null); // Controls which section is open

  function toggleBluetooth() {
    setConnected(!connected);
  }

  function toggleSection(section) {
    setActiveSection(activeSection === section ? null : section);
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="w-full bg-yellow-400 text-black text-xl font-bold text-center py-3">
        Bluetooth Controller
      </div>

      {/* Bluetooth Connect Button */}
      <div className="mt-4 flex items-center space-x-2">
        <p className="text-white">Connect app to Bluetooth?</p>
        <button
          onClick={toggleBluetooth}
          className={`px-4 py-2 rounded-md font-bold ${
            connected ? "bg-yellow-400 text-black" : "bg-purple-500 text-white"
          }`}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
      </div>

      {/* Movement Controls */}
      <div className="flex flex-col items-center mt-15">
        <button className="bg-purple-500 p-4 rounded-md mb-2">↑</button>
        <div className="flex items-center space-x-4">
          <button className="bg-purple-500 p-4 rounded-md">←</button>
          <div className="bg-black p-6 rounded-full">
            <p className="text-white font-bold text-lg">TAAP</p>
          </div>
          <button className="bg-purple-500 p-4 rounded-md">→</button>
        </div>
        <button className="bg-purple-500 p-4 rounded-md mt-2">↓</button>
      </div>

      {/* PID & FOPID Sections */}
      <div className="fixed bottom-22 w-full flex">
        <button
          className={`flex-1 py-5 text-center font-bold rounded-lg ${
            activeSection === "PID" ? "bg-yellow-400 text-black" : "bg-purple-500 text-white"
          }`}
          onClick={() => toggleSection("PID")}
          >
          Edit PID
        </button>
        <button
          className={`flex-1 py-5 text-center font-bold rounded-lg ${
            activeSection === "FOPID" ? "bg-yellow-400 text-black" : "bg-purple-500 text-white"
          }`}
          onClick={() => toggleSection("FOPID")}
        >
          Edit FOPID
        </button>
      </div>

      {/* Expanded PID Input Fields */}
      {activeSection === "PID" && (
        <div className="absolute bottom-40 bg-gray-800 p-8 rounded-lg w-3/4">
          <p className="text-white font-semibold text-center">Edit PID</p>
          <div className="flex justify-center space-x-2 mt-2">
            {["P", "I", "D"].map((key) => (
              <input
                key={key}
                className="bg-gray-700 text-white p-2 rounded-md text-center w-16"
                placeholder={key}
                type="number"
                value={pid[key]}
                onChange={(e) => setPid({ ...pid, [key]: e.target.value })}
              />
            ))}
          </div>
          <button
            className="bg-yellow-400 py-2 mt-2 w-full rounded-md font-bold"
            onClick={() => setActiveSection(null)}
          >
            Save Values
          </button>
        </div>
      )}

      {/* Expanded FOPID Input Fields */}
      {activeSection === "FOPID" && (
        <div className="absolute bottom-40 bg-gray-800 p-8 rounded-lg w-3/4">
          <p className="text-white font-semibold text-center">Edit FOPID</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {["F", "O", "P", "I", "D"].map((key) => (
              <input
                key={key}
                className="bg-gray-700 text-white p-2 rounded-md text-center"
                placeholder={key}
                type="number"
                value={fopid[key]}
                onChange={(e) => setFopid({ ...fopid, [key]: e.target.value })}
              />
            ))}
          </div>
          <button
            className="bg-yellow-400 py-2 mt-2 w-full rounded-md font-bold"
            onClick={() => setActiveSection(null)}
          >
            Save Values
          </button>
        </div>
      )}
    </div>
  );
}
