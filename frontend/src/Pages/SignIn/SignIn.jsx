// import { useEffect, useState } from "react";
// import 'ldrs/waveform'
// import { Link, useNavigate } from "react-router-dom";
// import useAPIRequest from "../../useAPIRequest"
// import './styles/SignIn.scss'


// function SignIn() {

//     // === Use State ===
//     const [showNavBar, setShowNavBar] = useState(false);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isDisable, setIsDisable] = useState(true);
//     let navigate = useNavigate();

//     // == API Calls ===

//     const {
//         data: signInData
//     } = useAPIRequest("http://localhost:3000/accounts")

//     // === Functions ===

//     const updateEmail = ((e) => {
//         setEmail(e.target.value)
//         let temp = true
//         signInData.map((index) => {
//             if (e.target.value === index.email) {
//                 temp = false
//             }
//         })
//         if (temp) {
//             alert("Don't Have an Account ..!")
//             document.getElementById('refreshEmail').value = '';
//         }
//     })

//     const updatePassword = ((e) => {
//         setPassword(e.target.value)
//     })

//     const handleFormSubmit = ((e) => {
//         e.preventDefault();
//         if (signInData) {
//             if (!isDisable) {
//                 fetch("http://localhost:3000/accounts")
//                     .then((res) => { return res.json() })
//                     .then((data) => {
//                         let temp = false;
//                         for (let i = 0; i < data.length; i++) {
//                             const user = data[i]
//                             if (user.email === email && user.password === password) {
//                                 temp = true
//                                 break;
//                             }
//                         }
//                         if (!temp) {
//                             alert("Invalid Details")
//                         }
//                         else {
//                             navigate("/", { state: true })
//                         }
//                     })
//             }
//         }
//         else {
//             alert("Server is Down")
//         }
//     })

//     // === Use Effect ===

//     useEffect(() => {
//         if (email && password) {
//             setIsDisable(false)
//         }
//         else {
//             setIsDisable(true)
//         }
//     }, [email, password])

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowNavBar(true);
//         }, 2000);
//         return () => clearTimeout(timer);
//     }, [])

//     return (
//         <>
//             {
//                 showNavBar ?
//                     <div className="signInFormContainer">
//                         <div className="formWrapper">
//                             <h2>Login to your account</h2>
//                             <form action="">
//                                 <div className="inputWrapper">
//                                     <label htmlFor="email">Email </label>
//                                     <input
//                                         type="email"
//                                         required
//                                         name="email"
//                                         placeholder="Enter Your Email"
//                                         onBlur={updateEmail}
//                                         id="refreshEmail"
//                                     />
//                                 </div>
//                                 <div className="inputWrapper">
//                                     <label htmlFor="password">Password </label>
//                                     <input
//                                         type="password"
//                                         required
//                                         minLength={4}
//                                         maxLength={10}
//                                         name="password"
//                                         placeholder="Enter Your Password"
//                                         onChange={updatePassword}
//                                         id="refreshPasswword"
//                                     />
//                                 </div>
//                                 <div className="inputWrapper">
//                                     <button className="SignUpBtn" autoFocus={true} disabled={isDisable} onClick={handleFormSubmit}>Create Account</button>
//                                 </div>
//                             </form>
//                             <div className="noteWrapper">
//                                 <span>
//                                     Don’t have an account ?
//                                     <Link to="/sign-up">
//                                         Register Here
//                                     </Link>
//                                 </span>
//                             </div>
//                         </div>
//                     </div> :
//                     <div className='loader'>
//                         <l-waveform
//                             size="80"
//                             stroke="4.5"
//                             speed="1"
//                             color="#ffff"
//                         >
//                         </l-waveform>
//                     </div>
//             }
//         </>
//     );
// };
// export default SignIn;


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './SignIn.scss';

export default function SignIn() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) { toast.error('Fill in all fields'); return; }
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back! 🎬');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__bg" />
            <div className="auth-card glass-card">
                <div className="auth-card__brand">🎬 CINEMABOOK</div>
                <h1 className="auth-card__title">Welcome Back</h1>
                <p className="auth-card__sub">Sign in to book your seats</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form__field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </div>
                    <div className="auth-form__field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="btn-primary auth-form__submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-card__switch">
                    Don't have an account? <Link to="/sign-up">Register</Link>
                </p>
            </div>
        </div>
    );
}
