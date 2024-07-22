"use client";
import React, { useState } from 'react';
import Modal from "@/components/Modal";

export default function Sidebar() {
  const [isFRModalOpen, setIsFRModalOpen] = useState(false);

  const openFRModal = () => setIsFRModalOpen(true);
  const closeFRModal = () => setIsFRModalOpen(false);

  const [isADDModalOpen, setIsADDModalOpen] = useState(false);

  const openADDModal = () => setIsADDModalOpen(true);
  const closeADDModal = () => setIsADDModalOpen(false);
  return (
    <aside className="w-64 bg-gray-800  p-4">
      <nav>
        <ul className="p-2">
          <li className="w-full">
            <input 
              className="w-full text-lg border rounded-lg text-black py-1 px-2 focus:outline-none focus:ring-2
              foucs:ring-blue-500 focus:border-transparent"
              placeholder="Search..."
            />
          </li>
          <li className="w-full  justify-between border-2 border-green-500 mt-2 rounded-lg text-white bg-green-800 py-1">
            <button  onClick={openADDModal} className="w-full flex flex-row justify-between text-lg px-1.5">Add Friends
            </button>
            
          </li>
          <li className="w-full  justify-between border-2 border-blue-500 mt-2 rounded-lg text-white bg-blue-800 py-1">
            <button  onClick={openFRModal} className="w-full flex flex-row justify-between text-lg px-1.5">
                {/* TODO add logos/icons and a notifications */}
                Friend Requests
                <h1 className=" rounded-full px-2.5 bg-red-500 border border-red-800">2</h1>
            
            </button>
            
          </li>
         
        </ul>
        <Modal 
        isOpen={isFRModalOpen} 
        onClose={closeFRModal}
        width="400px"
        height="300px"
      >
        <h2 className="text-xl mb-4">Friend Requets</h2>
        <p>This is the content of your center modal.</p>
      </Modal>
      <Modal 
        isOpen={isADDModalOpen} 
        onClose={closeADDModal}
        width="400px"
        height="300px"
      >
        <h2 className="text-xl mb-4">Add Friends</h2>
        <p>This is the content of your center modal.</p>
      </Modal>
      </nav>
    </aside>
  );
}