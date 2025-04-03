"use client";
import { useState } from "react";

export default function BluetoothControl() {
  const [device, setDevice] = useState(null);

  async function connectBluetooth() {
    try {
      const bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"], // Change this to your service UUID
      });

      setDevice(bluetoothDevice);
      console.log("Connected to:", bluetoothDevice.name);
    } catch (error) {
      console.error("Bluetooth Connection Error:", error);
    }
  }

  async function sendBluetoothData(data) {
    if (!device) {
      alert("No Bluetooth device connected!");
      return;
    }

    try {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService("battery_service"); // Change this
      const characteristic = await service.getCharacteristic("battery_level"); // Change this
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(data));

      alert("Data sent successfully!");
    } catch (error) {
      console.error("Bluetooth Data Send Error:", error);
    }
  }

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-lg font-semibold">Bluetooth Control</h2>
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={connectBluetooth}
      >
        Connect to Bluetooth
      </button>
      <button
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md"
        onClick={() => sendBluetoothData("PID:1,2,3")}
      >
        Send PID Data
      </button>
    </div>
  );
}
