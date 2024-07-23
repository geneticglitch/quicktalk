"use client";
import React, { use, useState, useRef } from 'react';
import Modal from "@/components/Modal";
import { useSession } from 'next-auth/react';
import { search_friend_SF , add_friend_SF} from '@/lib/server_actions/AddFriends';

export default function Sidebar() {

  const { data: session } = useSession();
  const userId = session?.user?.id;
  

  // State to manage the modal
  const [isFRModalOpen, setIsFRModalOpen] = useState(false);

  const openFRModal = () => setIsFRModalOpen(true);
  const closeFRModal = () => setIsFRModalOpen(false);

  const [isADDModalOpen, setIsADDModalOpen] = useState(false);

  const openADDModal = () => setIsADDModalOpen(true);
  const closeADDModal = () => setIsADDModalOpen(false);

  // Add_Friend Modal
  interface search_result {
    id: string;
    display_name: string;
    image: string;
  }
  
  const [searchState, setSearchState] = useState<{
    result: search_result | null;
    error: string | null;
    loading: boolean;
    friendRequestSent: boolean;
  }>({
    result: null,
    error: null,
    loading: false,
    friendRequestSent: false
  });


  const add_friend_username_input_field = useRef<HTMLInputElement>(null);

  const search_friend = async (e: any) => {
    e.preventDefault();
    const searchTerm = add_friend_username_input_field.current?.value.trim();

    if(!searchTerm) {
      setSearchState({ result: null, error: "Please enter a username", loading: false, friendRequestSent: false });
      return;
    }

    if(!userId) {
      setSearchState({ result: null, error: "Please login to search for friends", loading: false, friendRequestSent: false });
      return;
    }

    setSearchState({ result: null, error: null, loading: true, friendRequestSent: false });

    try {
      const result = await search_friend_SF(searchTerm, userId);
      setSearchState({ 
        result: result !== null ? result[0] : null, 
        error: result === null ? "No user found with that username" : null, 
        loading: false,
        friendRequestSent: false
      });
    } catch (error) {
      console.error('Error searching for friend:', error);
      setSearchState({ result: null, error: "An error occurred while searching", loading: false, friendRequestSent: false });
    }
  };
  const add_friend = async () => {
    if(!userId || !searchState.result) {
      return;
    }
    
    try {
      const response = await add_friend_SF(userId, searchState.result.id);
      if (response.success) {
        setSearchState(prevState => ({
          ...prevState,
          friendRequestSent: true,
          error: null
        }));
      } else {
        setSearchState(prevState => ({ ...prevState, error: response.message }));
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      setSearchState(prevState => ({ ...prevState, error: "An error occurred while adding friend" }));
    }
  }
  return (
    <aside className="w-64 bg-gray-800 p-2">
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
        isOpen={isADDModalOpen} 
        onClose={() => {
          setIsADDModalOpen(false);
          setSearchState({ result: null, error: null, loading: false, friendRequestSent: false });
        }}
        width="400px"
        height="220px"
      >
        <h2 className="text-xl mb-4">Add Friend</h2>
        <form onSubmit={search_friend} className="grid grid-cols-3 space-x-2">
          <input 
            className="col-span-2 text-lg border rounded-lg text-black py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ref={add_friend_username_input_field}
            placeholder="Enter username"
          />
          <button className="bg-blue-700 rounded-lg col-start-3 text-white" type="submit" disabled={searchState.loading}>
            {searchState.loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {searchState.error && (
          <p className="text-red-500 mt-2">{searchState.error}</p>
        )}

        {searchState.result && (
          <div className="mt-4 flex items-center">
            <img src={searchState.result.image} alt={`${searchState.result.display_name}'s avatar`} className="w-10 h-10 rounded-full mr-2" />
            <span className="flex-grow">{searchState.result.display_name}</span>
            <button 
              className={`ml-2 px-2 py-1.5 rounded-lg text-lg ${
                searchState.friendRequestSent ? 'bg-gray-500' : 'bg-green-500'
              } text-white`}
              onClick={add_friend}
              disabled={searchState.friendRequestSent}
            >
              {searchState.friendRequestSent ? 'Request Sent' : 'Add Friend'}
            </button>
          </div>
        )}
      </Modal>

        <Modal 
        isOpen={isFRModalOpen} 
        onClose={closeFRModal}
        width="400px"
        height="300px"
      >
        <h2 className="text-xl mb-4">Friend Requets</h2>
        <p>This is the content of your center modal.</p>
      </Modal>
      
      </nav>
    </aside>
  );
}