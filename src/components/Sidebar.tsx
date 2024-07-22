import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav>
        <ul className="p-2">
          <li className="w-full">
            <input 
              className="w-full text-lg border rounded-lg text-black py-1 px-2 focus:outline-none focus:ring-2
              foucs:ring-blue-500 focus:border-transparent"
              placeholder="Search..."
            />
          </li>
          <li className="w-full  justify-between border-2 border-blue-500 mt-2 rounded-lg text-white bg-blue-800 py-1">
            <button className="w-full flex flex-row justify-between text-lg px-1.5">
                {/* TODO add logos/icons and a notifications */}
                Friend Requests
                <h1 className=" rounded-full px-2.5 bg-red-500 border border-red-800">2</h1>
            
            </button>
            
          </li>
        </ul>
      </nav>
    </aside>
  );
}