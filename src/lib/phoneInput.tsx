import { forwardRef } from "react";
import PhoneInputLib from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { CountryCode } from "libphonenumber-js";

type Props = {
  value: string | undefined;
  onChange: (val: string | undefined) => void;
  defaultCountry?: CountryCode; // ISO country code like "NG" or "US"
};

/**
 * Custom input used by react-phone-number-input so we can apply Tailwind styles.
 * forwardRef required because the phone lib forwards a ref to the input.
 */
const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onChange, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
        className="w-full h-full bg-transparent text-white placeholder-white/60 pl-3 focus:outline-none"
      />
    );
  }
);
CustomInput.displayName = "CustomInput";

export default function PhoneInput({
  value,
  onChange,
  defaultCountry = "NG" as CountryCode,
}: Props) {
  return (
    <div className="flex w-full h-full items-center">
      <div className="w-full h-full">
        <PhoneInputLib
          international
          defaultCountry={defaultCountry}
          value={value}
          onChange={onChange}
          countryCallingCodeEditable={false}
          // put the select and input inside our wrapper
          className="w-full flex items-center"
          inputComponent={CustomInput}
          countrySelectProps={{
            // unify select appearance with the dark theme
            className:
              "bg-white/90 text-black pr-2 pl-2 py-1 rounded-md appearance-none focus:outline-none",
            // avoid adding an extra title attribute tooltip
            native: false,
          }}
        />
      </div>
    </div>
  );
}