import { Avatar, Badge, Dropdown, Input, MenuProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { SearchOutlined, BellOutlined, MessageOutlined, DownOutlined } from '@ant-design/icons';
import './style.header.scss'
import UserIcon from '../../assets/image/user-icon.png'
import { Link, useNavigate } from 'react-router-dom';
import Utils from '../../utils/base-utils';
import { useDispatchRoot, useSelectorRoot } from '../../redux/store';
import { getUserInfoRequest } from '../../redux/controller';

const Header = () => {
    const navigate = useNavigate();
    const { userName } = useSelectorRoot((state) => state.login);
    const dispatch = useDispatchRoot();

    const items: MenuProps["items"] = [

        {
            key: "4",
            label: "Đăng xuất",
            onClick: () => onClickLogout()
        },
    ];



    const onClickLogout = () => {
        Utils.removeItemLocalStorage("token");
        Utils.removeItemLocalStorage("refresh_token");
        window.location.reload();
    }


    return (
        <div className="main-header">
            <div className="icon-group">
                <div className="user-info-content">
                    <Avatar className="avatar" src={UserIcon} />
                    <div className="name-and-balance">
                        <div className="name">{userName}</div> 
                    </div>
                    <Dropdown
                        className="drop-down"
                        menu={{ items }}
                        placement="bottomLeft"
                        arrow
                    >
                        <DownOutlined />
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default Header