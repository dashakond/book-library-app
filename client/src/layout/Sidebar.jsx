"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems
} from "flowbite-react";

import {
  HiUser,
  HiBookOpen,
  HiCollection,
  HiHeart,
  HiChartPie,
  HiClock
} from "react-icons/hi";

import { Link } from "react-router-dom";

function AppSidebar() {
  return (
    <div style={styles.wrapper}>
      <Sidebar aria-label="Library Sidebar" className="h-screen">

        <SidebarItems>

          <SidebarItemGroup>

            <SidebarItem icon={HiChartPie} as={Link} to="/profile">
              Profile
            </SidebarItem>

            <SidebarItem icon={HiBookOpen} as={Link} to="/book">
              Books
            </SidebarItem>

            <SidebarItem icon={HiCollection} as={Link} to="/collections">
              Collections
            </SidebarItem>

            <SidebarItem icon={HiHeart} as={Link} to="/wishlist">
              Wishlist
            </SidebarItem>

            <SidebarItem icon={HiChartPie} as={Link} to="/goals">
              Goals
            </SidebarItem>

            <SidebarItem icon={HiClock} as={Link} to="/sessions">
              Sessions
            </SidebarItem>

          </SidebarItemGroup>

        </SidebarItems>

      </Sidebar>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex"
  }
};

export default AppSidebar;