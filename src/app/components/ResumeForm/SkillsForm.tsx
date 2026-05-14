import { Form, FormSection } from "components/ResumeForm/Form";
import { Input } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectSkills, changeSkills } from "lib/redux/resumeSlice";
import type { SkillCategory } from "lib/redux/types";

export const SkillsForm = () => {
  const skills = useAppSelector(selectSkills);
  const dispatch = useAppDispatch();

  const showDelete = skills.length > 1;

  return (
    <Form form="skills" addButtonText="Add Category">
      {skills.map(({ name, skills: skillList }, idx) => {
        const handleChange = (field: keyof SkillCategory, value: string) => {
          dispatch(changeSkills({ idx, field, value }));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== skills.length - 1;

        return (
          <FormSection
            key={idx}
            form="skills"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete category"
          >
            <Input
              label="Category"
              labelClassName="col-span-2"
              name="name"
              placeholder="Cloud"
              value={name}
              onChange={handleChange}
            />
            <Input
              label="Skills"
              labelClassName="col-span-4"
              name="skills"
              placeholder="AWS, Azure, GCP"
              value={skillList}
              onChange={handleChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
