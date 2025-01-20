import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isAuth, logout } from '../helpers/auth';
import styles from '../styles/Layout.module.css';

const Layout = ({ children }) => {
    const router = useRouter();
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        setAuth(isAuth());
    }, []);

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>My App</title>
            </Head>
            <nav className={`navbar navbar-expand-lg navbar-light bg-warning ${styles.navbar}`}>
                <Link href="/" className="navbar-brand text-dark">Home</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ml-auto">
                        {!auth && (
                            <>
                                <li className="nav-item">
                                    <Link href="/login" className="nav-link text-dark">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/register" className="nav-link text-dark">Register</Link>
                                </li>
                            </>
                        )}
                        {auth && auth.role === 'admin' && (
                            <li className="nav-item">
                                <Link href="/admin" className="nav-link text-dark">{auth.name}</Link>
                            </li>
                        )}
                        {auth && auth.role === 'subscriber' && (
                            <li className="nav-item">
                                <Link href="/user" className="nav-link text-dark">{auth.name}</Link>
                            </li>
                        )}
                        {auth && (
                            <li className="nav-item">
                                <a
                                    onClick={() => {
                                        logout();
                                        router.push('/login');
                                    }}
                                    className="nav-link text-dark"
                                    style={{ cursor: 'pointer' }}
                                >
                                    Logout
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
            <div className="container pt-5 pb-5">{children}</div>
        </>
    );
};

export default Layout;
