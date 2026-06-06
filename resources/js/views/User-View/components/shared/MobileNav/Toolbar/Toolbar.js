import React, {useState, useEffect} from 'react';
import clsx from "clsx";

import {AiOutlineMenu} from 'react-icons/ai'
import './Toolbar.scss';

const Toolbar = (props) => {

const [isSticky2, setIsSticky2] = useState(false);

    useEffect(() => {
    const mobileToolbar = document.querySelector(".mobile-toolbar");
    const navHeight = mobileToolbar.scrollHeight;

    const handleScroll = () => {
      const scrollHeight = window.pageYOffset;
      setIsSticky2(scrollHeight > 25 ? true : false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={clsx("mobile-toolbar", isSticky2 ? "toolbar__sticky" : "")}>
            <div className='mobile-logo-row'>
                <a href='/'>
                    <div className='mobile-logo-container'></div>
                </a>
            </div>
            <button onClick={props.drawerClickHandler}><AiOutlineMenu/></button>
        </div>
    )
}

export default Toolbar;
