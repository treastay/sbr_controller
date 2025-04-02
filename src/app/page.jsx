"use client";
import BottomBar from "../components/bottombar";
import BluetoothController from "../components/BluetoothController";

export default function Home() {
  return (
  <div> 
  <BluetoothController />

      <BottomBar activePage="Home"/> 
        </div> 
        );
      }
