import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./Form.module.css";

const schema = z
  .object({
    firstName: z
      .string()
      .min(3, "Imię musi składać się z co najmniej 3 znaków."),
    lastName: z
      .string()
      .min(3, "Nazwisko musi składać się z co najmniej 3 znaków."),
    email: z.string().email("Niepoprawny adres e-mail."),
    phone: z
      .string()
      .regex(/^\d{9}$/, "Numer telefonu musi składać się z 9 cyfr."),
    learningMode: z.enum(["Stacjonarna", "Online"]),
    technologies: z
      .array(z.string())
      .min(1, "Proszę wybrać co najmniej jedną technologię."),
    cv: z
      .custom(
        (file) => file instanceof File,
        "Musisz dodać załącznik jako zdjęcie."
      )
      .refine(
        (file) => file && ["image/jpeg", "image/png"].includes(file.type),
        "Niepoprawny format pliku"
      ),
    hasExperience: z.boolean(),
    experience: z
      .array(
        z.object({
          tech: z.enum(["JavaScript", "Python", "C++", "Inne"]),
          level: z.enum(["1", "2", "3", "4", "5", "6"]),
        })
      )
      .optional(),
  })
  .refine(
    (data) =>
      !data.hasExperience || (data.experience && data.experience.length > 0),
    {
      message:
        "Gdy zaznaczono doświadczenie w programowaniu, lista doświadczeń nie może być pusta.",
      path: ["experience"],
    }
  );

const Form = ({ onSubmit }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      learningMode: "Online",
      technologies: [],
      cv: null,
      hasExperience: false,
      experience: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });
  const hasExperience = watch("hasExperience");
  const selectedTechnologies = watch("technologies") || [];

  const handleFileChange = (e) => {
    setValue("cv", e.target.files[0]);
    trigger("cv");
  };

  const handleTechnologyChange = (tech) => {
    let updatedTechnologies;
    if (selectedTechnologies.includes(tech)) {
      updatedTechnologies = selectedTechnologies.filter((t) => t !== tech);
    } else {
      updatedTechnologies = [...selectedTechnologies, tech];
    }

    setValue("technologies", updatedTechnologies, { shouldValidate: true });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Formularz zgłoszeniowy na kurs programowania
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.personalData}>
          <label>Dane osobowe</label>
          <label
            className={
              errors.firstName ? styles.errorLabel : styles.noErrorLabel
            }
          >
            <input placeholder="Imię" {...register("firstName")} />
          </label>
          {errors.firstName && <p>{errors.firstName.message}</p>}

          <label
            className={
              errors.lastName ? styles.errorLabel : styles.noErrorLabel
            }
          >
            <input placeholder="Nazwisko" {...register("lastName")} />
          </label>
          {errors.lastName && <p>{errors.lastName.message}</p>}

          <label
            className={errors.email ? styles.errorLabel : styles.noErrorLabel}
          >
            <input placeholder="E-mail" type="email" {...register("email")} />
          </label>
          {errors.email && <p>{errors.email.message}</p>}

          <label
            className={errors.phone ? styles.errorLabel : styles.noErrorLabel}
          >
            <input
              placeholder="Numer telefonu"
              type="text"
              {...register("phone")}
            />
          </label>
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>

        <div>
          <label>Preferencje kursu</label>
        </div>
        <div className={styles.coursePreferences}>
          Wybierz formę nauki:
          <label>
            <input
              type="radio"
              value="Stacjonarna"
              {...register("learningMode")}
              className={styles.coursePreferencesCheckbox}
            />
            Stacjonarna
          </label>
          <label>
            <input
              type="radio"
              value="Online"
              {...register("learningMode")}
              className={styles.coursePreferencesCheckbox}
            />
            Online
          </label>
        </div>
        <div>
          <div
            className={`${styles.courseScope} ${
              errors.technologies ? styles.errorLabel : styles.noErrorLabel
            }`}
          >
            {["React", "Node.js", "HTML", "CSS", "Next.js"].map((tech) => (
              <label
                key={tech}
                style={{
                  background: selectedTechnologies.includes(tech)
                    ? "#6d9deb"
                    : "#353f5c",
                }}
              >
                <input
                  type="checkbox"
                  value={tech}
                  checked={selectedTechnologies.includes(tech)}
                  onChange={() => handleTechnologyChange(tech)}
                  style={{ display: "none" }}
                />
                {tech}
              </label>
            ))}
          </div>
          {errors.technologies && <p>{errors.technologies.message}</p>}
        </div>

        <div className={styles.addCv}>
          <label>Dodaj swoje CV</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className={errors.cv ? styles.errorLabel : styles.noErrorLabel}
          />
          {errors.cv && <p>{errors.cv.message}</p>}
        </div>

        <div className={styles.experience}>
          Doświadczenie w programowaniu
          <label>
            <div className={styles.experienceContainer}>
              <input
                type="checkbox"
                {...register("hasExperience")}
                onChange={(e) => {
                  setValue("hasExperience", e.target.checked);
                }}
                className={styles.experienceCheckbox}
              />
              Czy masz doświadczenie w programowaniu?
            </div>
          </label>
          {hasExperience && (
            <div className={styles.addExperienceContainer}>
              {fields.map((item, index) => (
                <div className={styles.experienceDetails} key={item.id}>
                  <select {...register(`experience.${index}.tech`)}>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="C++">C++</option>
                    <option value="Inne">Inne</option>
                  </select>
                  <select {...register(`experience.${index}.level`)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                  <button type="button" onClick={() => remove(index)}>
                    Usuń
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ tech: "JavaScript", level: "1" })}
                className={styles.addExperience}
              >
                Dodaj doświadczenie
              </button>
            </div>
          )}
          {errors.experience && <p>{errors.experience.message}</p>}
        </div>
        <button type="submit">Wyślij zgłoszenie</button>
      </form>
    </div>
  );
};

export default Form;
