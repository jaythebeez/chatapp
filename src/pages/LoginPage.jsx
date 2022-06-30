import { useState } from "react";
import {  Link  } from "react-router-dom";
import { login } from "../firebase/auth";

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        try{
            setError(null);
            e.preventDefault();
            await login(email, password);
        }
        catch (e) {
            setError(e.message)
        }
    }

    return ( 
    <section className="h-screen">
    <div className="px-6 h-full text-gray-800">
        <div className="flex justify-center items-center flex-wrap h-full g-6">
            <div className="">
            <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h1 className="text-3xl text-center font-medium">Login Page</h1>
            </div>
            <div className="mb-6">
                <input
                type="text"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="Email address"
                />
            </div>
            <div className="mb-6">
                <input
                type="password"
                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                placeholder="Password"
                />
            </div>
            {error && <span className="text-red-300 text-xs ">{error}</span>}

            <div className="text-center lg:text-left">
                <button
                className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                Login
                </button>
                <p className="text-sm font-normal mt-2 pt-1 mb-0">
                Don't have an account? 
                <Link to="/auth/register" className="text-red-600" > Register</Link>
                </p>
            </div>
            </form>
        </div>
        </div>
    </div>
    </section>
    );
}
 
export default LoginPage;