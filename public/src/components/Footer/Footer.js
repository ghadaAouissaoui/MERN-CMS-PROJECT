import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles["footer"]}>
      <div className={styles["sub-footer"]}>
        <p className={styles["webname"]}>Blog</p>
        <p className={styles["copyright"]}>
        </p>
      </div>
    </div>
  );
};

export default Footer;
