import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username && password) {
      alert(`Username: ${username}\nPassword: ${password}`);
      navigate('/dashboard'); // Navigate to the Dashboard page
    } else {
      alert('Please fill in both fields.');
    }
  };

  return (
    <main className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-[#fffaf5] via-[#e7fdfd] to-[#aeeaf5] bg-cover bg-center">
      <section className="w-[900px] bg-white/50 backdrop-blur-md border-green-500/30 border rounded-lg justify-center items-center space-x-5 flex flex-col">
        <section className=' flex items-center py-5 space-x-5 justify-start w-full px-5 '>
          <img 
          className='w-[50px] rounded-full '
          src="./depEdCNLogo.png" alt="depedLogo" />
          <h1 className='text-xl font-semibold'>Database of Travel Authority</h1>
        </section>
        <div className='flex justify-center items-center space-x-5 p-5'>
        <section className="p-8 border-green-500/30 border h-[75%] rounded-xl shadow-lg max-w-sm w-full bg-white/80">
          <header>
            <h1 className="text-xl font-bold mb-5 text-center">Log in</h1>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Update state
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'} // Toggle input type
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update state
                className="w-full border p-2 rounded"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '🙈'} {/* Eye icon */}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-600"
            >
              Log in
            </button>
          </form>
        </section>
        <section className='hidden md:block'>
          <img className="w-[500px]" src="./authen.png" alt="image" />
        </section>
        </div>
      </section>
    </main>
  );
};

export default LogIn;