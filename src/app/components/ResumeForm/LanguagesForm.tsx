import { BaseForm } from "components/ResumeForm/Form";
import { Input } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeLanguages, selectLanguages } from "lib/redux/resumeSlice";

export const LanguagesForm = () => {
  const languages = useAppSelector(selectLanguages);
  const dispatch = useAppDispatch();

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="Languages"
          labelClassName="col-span-full"
          name="languages"
          placeholder="English, Hindi, Marathi"
          value={languages}
          onChange={(_, value) => dispatch(changeLanguages({ value }))}
        />
      </div>
    </BaseForm>
  );
};
