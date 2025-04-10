import { Header } from './Header';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export default function Layout () {

    console.log('This is the layout! 💃')

    return (
        <>
            <Header />
                <Outlet />
            <Footer />
        </>
    )
}