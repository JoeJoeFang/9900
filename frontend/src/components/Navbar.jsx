import React, { useState, useEffect } from 'react';
import AllEvents from '../components/AllEvents';
import MyBookings from '../components/MyBookings';
import CreateNewEvent from '../components/CreateNewEvent';
import HostProfile from '../components/HostProfile';
import Logout from '../components/Logout';
import MyAccount from '../components/MyAccount'; // Assuming the Navbar is in the same directory level as HostedEvents
import HostedEvents from '../components/HostedEvents';
import Login from '../components/Login';
import BackButton from './BackButton';



const Navbar = () => {
  // 使用 useState 钩子来创建 identity 状态
  const [identity, setIdentity] = useState(localStorage.getItem('identity'));
  // 使用 useEffect 钩子来监听 localStorage 的变化
  useEffect(() => {
    const handleStorageChange = (event) => {
      // 如果发生变化的是 identity 键，更新组件状态
      if (event.key === 'identity') {
        setIdentity(localStorage.getItem('identity'));
      }
    };

    // 添加事件监听器
    window.addEventListener('storage', handleStorageChange);

    // 清理函数，组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 根据用户角色动态决定展示哪些按钮的逻辑
  const renderButtonsBasedOnRole = () => {
    const buttonsForCustomer = [
      <BackButton key="Back"/>,
      <AllEvents key="allEvents" />,
      <MyBookings key="myBookings" />,
      <MyAccount key="myAccount" />,
      <Logout key="logout" />
    ];

    const buttonsForHost = [
      <BackButton key="Back"/>,
      <AllEvents key="allEvents" />,
      // 假设 HostedEvents 是你的一个组件，代表主办的活动 
      <HostedEvents key="HostedEvents" />,
      <CreateNewEvent key="createNewEvent" />,
      <HostProfile key="hostProfile" />,
      <Logout key="logout" />
    ];
    console.log(identity)
    const buttonsForVisitor = [
      <Login key="login" /> // Replace with your actual Login component
    ];

    // Determine what buttons to render based on the identity
    switch (identity) {
      case 'customer':
        return buttonsForCustomer;
      case 'host':
        return buttonsForHost;
      default:
        return buttonsForVisitor; // Assume any other identity is a visitor
    }
  };
  // JSX 返回语句，这里实际调用了渲染按钮的函数
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0' }}>
      {renderButtonsBasedOnRole()}
    </div>
  );
};

export default Navbar;
