import React, { useEffect, useState } from 'react'
import './style.sidebar.scss'
import Logo from '../../assets/image/logo.png'
import { BiGridAlt } from 'react-icons/bi'
import { BsFillPersonFill } from 'react-icons/bs'
import { HiOutlineNewspaper } from 'react-icons/hi'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { ImStatsDots } from 'react-icons/im'
import { AiOutlineKey, AiFillGift, AiOutlineQuestionCircle, AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import { BiSolidLogIn } from 'react-icons/bi'
import { GoDotFill, GoDot } from 'react-icons/go'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
const Sidebar = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState<number>(1)
    const [subActive, setSubActive] = useState<number>(1)

    useEffect(() => {
		// if (window.location.pathname === "/management") setActive(1);
		if (window.location.pathname === "/management/book") setSubActive(2);

	}, []);

    return (
        <div className="main-sidebar">
            <div className="sidebar-logo">
                <img src={Logo} alt="" />
                <span>Book Management</span>
            </div>
            <div className="sidebar-menu">
                {/* <div className={'sidebar-item' + (active === 1 ? ' active' : ' ')} onClick={() => {
                    setActive(1)
                    navigate('/management')
                }}>
                    <BiGridAlt />
                    <span>Tổng quan</span>
                </div> */}
                <div className={'sidebar-item' + (active === 2 ? ' active' : '')} onClick={() => {
                    setActive(2)
                    navigate('/management/book')
                }}>
                    <BiGridAlt />
                    <span>Quản lý Sách</span>
                </div>
            </div>
        </div >
    )
}

export default Sidebar