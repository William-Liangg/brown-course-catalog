import { useState } from 'react'

const Navbar = () => {
  return (
    <nav className="bg-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          Brown Course Catalog
        </div>
        <div className="space-x-6">
          <a href="#" className="hover:text-blue-200 transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors">
            Courses
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors">
            Schedule
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors">
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Hello World
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to the Brown Course Catalog
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;