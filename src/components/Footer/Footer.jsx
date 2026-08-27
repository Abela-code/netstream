// import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Styles from "./Footer.module.css";

const linkColumns = [
  ["Audio Description", "Investor Relations", "Legal Notices"],
  ["Help Centre", "Jobs", "Cookie Preferences"],
  ["Gift Cards", "Terms of Use", "Corporate Information"],
  ["Media Centre", "Privacy", "Contact Us"],
];

export default function Footer() {
  return (
    <footer className={Styles.footer}>
      <div className={Styles.container}>
        {/* social icons */}
        <div className={Styles.socialRow}>
          <a href="#" className={Styles.iconLink} aria-label="Facebook">
            <FaFacebookF size={20} />
          </a>
          <a href="#" className={Styles.iconLink} aria-label="Instagram">
            <FaInstagram size={20} />
          </a>
          <a href="#" className={Styles.iconLink} aria-label="Twitter">
            <FaTwitter size={20} />
          </a>
          <a href="#" className={Styles.iconLink} aria-label="Youtube">
            <FaYoutube size={20} />
          </a>
        </div>

        {/* link columns */}
        <div className={Styles.linkGrid}>
          {linkColumns.map((column, colIndex) => (
            <ul key={colIndex} className={Styles.linkColumn}>
              {column.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a href="#" className={Styles.footerLink}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>

        {/* service code button (optional, common on real Netflix footer) */}
        {/* <button className={Styles.serviceCode}>Service Code</button> */}

        {/* copyright */}
        <p className={Styles.copyright}>&copy; 1997-2026 Netflix, Inc.</p>
      </div>
    </footer>
  );
}
