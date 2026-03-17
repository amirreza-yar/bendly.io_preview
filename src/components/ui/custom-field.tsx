import { useState } from "react";
import { EyeClosed, EyeOpen, PasswordField } from "../icons";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group";

export const PasswordInput = ({
  className,
  ...props
}: React.ComponentProps<"input">) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        type={showPassword ? "text" : "password"}
        autoComplete="off"
        className={className}
        {...props}
      />
      <InputGroupAddon>
        <PasswordField className="size-5" />
      </InputGroupAddon>
      <InputGroupButton
        onClick={() => setShowPassword((prev) => !prev)}
        type="button"
      >
        {showPassword ? (
          <EyeClosed className="size-4.5" />
        ) : (
          <EyeOpen className="size-4.5" />
        )}
      </InputGroupButton>
    </InputGroup>
  );
};
