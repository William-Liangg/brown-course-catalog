import { useState } from 'react'

const Navbar = () => {
  return (
    <nav className="bg-amber-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          Brown Course Catalog
        </div>
        <div className="space-x-6">
          <a href="#" className="hover:text-amber-200 transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-amber-200 transition-colors">
            Courses
          </a>
          <a href="#" className="hover:text-amber-200 transition-colors">
            Schedule
          </a>
          <a href="#" className="hover:text-amber-200 transition-colors">
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <main className="container mx-auto px-4 py-8"> {/* fixed max-width, added vertical and horizontal padding */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Trouble Picking Classes?
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to Brown Course Catalog
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;