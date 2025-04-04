"use client";
import { useState, useEffect } from "react";
import { FiArrowLeft,FiArrowRight,FiArrowUp,FiArrowDown } from "react-icons/fi";

export default function BluetoothController() {
  const [bluetoothDevice, setBluetoothDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [pid, setPid] = useState({ P: "", I: "", D: "" });
  const [fopid, setFopid] = useState({ F: "", O: "", P: "", I: "", D: "" });
  const [activeSection, setActiveSection] = useState(null);

  // ✅ Load stored values from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPID = JSON.parse(localStorage.getItem("pid")) || { P: "", I: "", D: "" };
      const savedFOPID = JSON.parse(localStorage.getItem("fopid")) || { F: "", O: "", P: "", I: "", D: "" };
      setPid(savedPID);
      setFopid(savedFOPID);
    }
  }, []);

  // ✅ Save values to LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pid", JSON.stringify(pid));
      localStorage.setItem("fopid", JSON.stringify(fopid));
    }
  }, [pid, fopid]);

  // ✅ Connect Phone's Bluetooth to HC-05
  async function connectBluetooth() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["00001101-0000-1000-8000-00805f9b34fb"], // HC-05 Serial UUID
      });

      const server = await device.gatt.connect();
      setBluetoothDevice(device);
      setConnected(true);

      device.addEventListener("gattserverdisconnected", () => {
        setConnected(false);
        setBluetoothDevice(null);
      });

      alert("Connected to phone's Bluetooth!");
    } catch (error) {
      alert("Bluetooth Connection Failed: " + error.message);
    }
  }

  // ✅ Disconnect Bluetooth
  function disconnectBluetooth() {
    if (bluetoothDevice) {
      bluetoothDevice.gatt.disconnect();
      setConnected(false);
      setBluetoothDevice(null);
      alert("Disconnected from Bluetooth.");
    }
  }

  // ✅ Send Data to HC-05
  async function sendData(data) {
    if (!connected || !bluetoothDevice) {
      alert("Not connected to a Bluetooth device.");
      return;
    }

    try {
      const service = await bluetoothDevice.gatt.getPrimaryService("00001101-0000-1000-8000-00805f9b34fb");
      const characteristic = await service.getCharacteristic("00001101-0000-1000-8000-00805f9b34fb");

      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(data));

      alert(`Sent Data: ${data}`);
    } catch (error) {
      alert("Failed to send data: " + error.message);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="w-full bg-yellow-400 text-black text-xl font-bold text-center py-3">
        Bluetooth Controller
      </div>

      {/* Bluetooth Connect Buttons */}
      <div className="mt-8 flex items-center space-x-2">
        <p className="text-white">Connect to Bluetooth?</p>
        <button
          onClick={connectBluetooth}
          className={`px-4 py-2 rounded-md font-bold ${connected ? "bg-yellow-400 text-black" : "bg-blue-500 text-white"}`}
        >
          {connected ? "Connected" : "Connect"}
        </button>
        <button onClick={disconnectBluetooth} className="px-4 py-2 bg-red-500 text-white rounded-md font-bold">
          Disconnect
        </button>
      </div>

      {/* Movement Controls */}
      <div className="flex flex-col items-center mt-20">
        <button className="bg-purple-500 p-5 w-15 rounded-md mb-6"><FiArrowUp/></button>
        <div className="flex items-center space-x-6">
          <button className="bg-purple-500 p-5 rounded-md"><FiArrowLeft/></button>
          <div className="bg-black p-8 rounded-full">
            <p className="text-white font-bold text-lg">SBR</p>
          </div>
          <button className="bg-purple-500 p-5 rounded-md"><FiArrowRight/></button>
        </div>
        <button className="bg-purple-500 p-5 w-15 rounded-md mt-5"><FiArrowDown/></button>
      </div>

      {/* PID & FOPID Sections */}
      <div className="fixed bottom-22 w-full flex item-justify-center ">
        <button
          className={`flex-1 py-5  text-center font-bold rounded-lg ${activeSection === "PID" ? "bg-yellow-400 text-black" : "bg-purple-500 text-white"}`}
          onClick={() => setActiveSection(activeSection === "PID" ? null : "PID")}
        >
          Edit PID
        </button>
        <button
          className={`flex-1 py-5 text-center font-bold rounded-lg ${activeSection === "FOPID" ? "bg-yellow-400 text-black" : "bg-purple-500 text-white"}`}
          onClick={() => setActiveSection(activeSection === "FOPID" ? null : "FOPID")}
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
          <button className="bg-yellow-400 py-2 mt-2 w-full rounded-md font-bold" onClick={() => sendData(JSON.stringify(pid))}>
            Send PID to HC-05
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
          <button className="bg-yellow-400 py-2 mt-2 w-full rounded-md font-bold" onClick={() => sendData(JSON.stringify(fopid))}>
            Send FOPID to HC-05
          </button>
        </div>
      )}
    </div>
  );
}
