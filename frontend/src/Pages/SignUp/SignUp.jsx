// import 'ldrs/trefoil'
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./styles/SignUp.scss";
// import useAPIRequest from "../../useAPIRequest"

// function SignUp() {

//     // === Use State ===
//     const [showNavBar, setShowNavBar] = useState(false);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [isDisable, setIsDisable] = useState(true);
//     const [isPasswordMatching, setIsPasswordMatching] = useState(false)
//     let navigate = useNavigate();

//     // === API Call ===

//     const {
//         data: signUpData
//     } = useAPIRequest("http://localhost:3000/accounts")

//     // === Functions ===

//     const handleEmail = ((e) => {
//         setEmail(e.target.value)
//         // let temp = e.target.value
//         // let found = false
//         let temp = true
//         signUpData.map((index) => {
//             if (e.target.value === index.email) {
//                 temp = false
//             }
//         })
//         if (!temp) {
//             alert("Email Already Exist..!")
//             document.getElementById('refreshEmail').value = null;
//         }
//     })

//     const handlePassword = ((e) => {
//         setPassword(e.target.value)
//     })

//     const handleConfirmPassword = ((e) => {
//         setConfirmPassword(e.target.value)
//     })

//     const handleFormSubmit = ((e) => {
//         e.preventDefault();
//         if (signUpData) {
//             if (!isDisable) {
//                 fetch("http://localhost:3000/accounts", {
//                     headers: {
//                         "content-type": "application/json"
//                     },
//                     method: "POST",
//                     body: JSON.stringify({
//                         email,
//                         password
//                     }),
//                 })
//                 navigate("/", { state: true })
//             }
//         }
//         else {
//             alert("Server is Down")
//         }
//     })

//     // === Use Effect ===

//     useEffect(() => {
//         if (email && password && confirmPassword && password === confirmPassword) {
//             setIsDisable(false)
//         }
//         else {
//             if (password && confirmPassword && password === confirmPassword) {
//                 setIsPasswordMatching(false)
//             }
//             else {
//                 setIsPasswordMatching(true)
//             }
//             setIsDisable(true)
//         }
//     }, [email, password, confirmPassword])

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowNavBar(true); 4
//         }, 2500);
//         return () => clearTimeout(timer);
//     }, [])

//     return (
//         <>
//             {
//                 showNavBar ? <div className="formContainer">
//                     <div className="leftSide">
//                         <div className="logo">
//                             <img src="/src/assets/Images/logo2.png" alt="" />
//                         </div>
//                         <div className="welcomeInfo">
//                             <h1>
//                                 Welcome.<br />
//                                 Begin your cinematic adventure now with our ticketing platform !
//                             </h1>
//                         </div>
//                     </div>
//                     <div className="rightSide">
//                         <div className="formContainer">
//                             <h2>Create an account</h2>
//                             <div className="formWrapper">
//                                 <form action="">
//                                     <div className="inputWrapper">
//                                         <label htmlFor="email">Email </label>
//                                         <input
//                                             type="email"
//                                             required
//                                             name="email"
//                                             placeholder="Enter Your Email"
//                                             onChange={handleEmail}
//                                             id="refreshEmail"
//                                         />
//                                     </div>
//                                     <div className="inputWrapper">
//                                         <label htmlFor="password">Password </label>
//                                         <input
//                                             type="password"
//                                             maxLength={10}
//                                             name="password"
//                                             placeholder="Enter Your Password"
//                                             onChange={handlePassword}
//                                         />
//                                         <input
//                                             type="password"
//                                             maxLength={10}
//                                             name="confirmPassword"
//                                             className="confirmPassword"
//                                             placeholder="Confirm Your Password"
//                                             onChange={handleConfirmPassword}
//                                         />
//                                     </div>
//                                     {confirmPassword && isPasswordMatching && <span className="alertMessage">Password Not Matched</span>}
//                                     <div className="inputWrapper">
//                                         <button className="SignUpBtn" autoFocus={true} disabled={isDisable} onClick={handleFormSubmit}>Create Account</button>
//                                     </div>
//                                 </form>
//                                 <div className="noteWrapper">
//                                     <span>
//                                         Already Have An Account ?
//                                         <Link to="/sign-in">
//                                             Log In
//                                         </Link>
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div > :
//                     <div className='loader'>
//                         <l-trefoil
//                             size="100"
//                             stroke="8"
//                             stroke-length="0.29"
//                             bg-opacity="0.1"
//                             speed="1.4"
//                             color="#ffff"
//                         ></l-trefoil>
//                     </div>
//             }
//         </>
//     );
// };
// export default SignUp

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import '../SignIn/SignIn.scss';// Reuse same styles

export default function SignUp() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) { toast.error('Fill in all fields'); return; }
        if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            toast.success('Account created! 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__bg" />
            <div className="auth-card glass-card">
                <div className="auth-card__brand">🎬 CINEMABOOK</div>
                <h1 className="auth-card__title">Create Account</h1>
                <p className="auth-card__sub">Join CinemaBook and start booking</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form__field">
                        <label>Full Name</label>
                        <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="auth-form__field">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="auth-form__field">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
                    </div>
                    <div className="auth-form__field">
                        <label>Confirm Password</label>
                        <input type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn-primary auth-form__submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-card__switch">
                    Already have an account? <Link to="/sign-in">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
