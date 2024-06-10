import LogoImg from "@/assets/logo.png";
import Link from "next/link";
import Image from "next/image";
import NavLink from "./nav-link";

import styles from "./MainHeader.module.css";

import MainHeaderBackground from "./MainHeaderBackground";

export default function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Image src={LogoImg} alt="Logo" priority />
          <p>NextLevel Food</p>
        </Link>

        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink href="/meals">Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
