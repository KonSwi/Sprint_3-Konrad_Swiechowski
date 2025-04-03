import styles from "./Modal.module.css";

const Modal = ({ data }) => {
  return (
    <>
      <h1 className={styles.heading}>Dane z formularza</h1>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <label>Dane osobowe:</label>
          <p className={styles.modalText}>Imię: {data.firstName}</p>
          <p className={styles.modalText}>Nazwisko: {data.lastName}</p>
          <p className={styles.modalText}>Email: {data.email}</p>
          <p className={styles.modalText}>Telefon: {data.phone}</p>
          {data.hasExperience && data.experience.length > 0 && (
            <>
              <label>Doświadczenie w programowaniu:</label>
              {data.experience.map((exp, index) => (
                <p className={styles.modalText}>
                  <li key={index}>
                    Technologia: {exp.tech} / poziom: {exp.level}
                  </li>
                </p>
              ))}
            </>
          )}
          <label>Preferencje kursu:</label>
          <p className={styles.modalText}>Forma nauki: {data.learningMode}</p>
          <p className={styles.modalText}>Preferowane technologie:</p>
          <p className={styles.modalText}>
            {data.technologies.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </p>
          <label>Curriculum vitae:</label>
          {data.cv && (
            <img
              src={URL.createObjectURL(data.cv)}
              alt="cv"
              style={{ width: "100px", height: "auto" }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
