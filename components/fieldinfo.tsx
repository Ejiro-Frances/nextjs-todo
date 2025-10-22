import { type AnyFieldApi } from "@tanstack/react-form";

type Props = {
  field: AnyFieldApi;
};

export default function FieldInfo({ field }: Props) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500">{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
