import { ChangeEvent, FormEvent, useState } from 'react';
import { Language, Role } from '../types';

type FormProps = {
  onSubmitHandler: (event: FormEvent<HTMLFormElement>, role: Role, language: Language, repo: string) => void;
  errorText: string;
}

function Form(props: FormProps) {
  const [role, setRole] = useState<Role>(Role.Developer);
  const [language, setLanguage] = useState<Language>(Language.JavaScript);
  const [repo, setRepo] = useState<string>('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setRepo(event.target.value);
  }

  const message = role === Role.Developer ? `You are a ${role} and your love language is ${language}.` : `You are a ${role} and would like to add a ${language} codebase.`;
  const submitText = role === Role.Developer ? 'Match me!' : 'Add codebase';

  return (
    <form
      onSubmit={(e) =>
        props.onSubmitHandler(e, role, language, repo)
      }
    >
      <label>
        Role:
        <div className='select'>
          <select value={role} id='role' onChange={(e) => setRole(e.target.value as Role)}>
            {Object.values(Role).map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </label>
      <label>
        Language:
        <div className='select'>
          <select value={language} id='language' onChange={(e) => setLanguage(e.target.value as Language)}>
            {Object.values(Language).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </label>
      {role === Role.Contributor &&
        <label>
          Codebase:
          <div className='input'>
            <input id='repo' placeholder='https://github.com/my-org/my-repo' value={repo} onChange={handleChange} required />
          </div>
        </label>
      }
      <p>{message}</p>
      <button type="submit">{submitText}</button>
      <div>
        <small>{props.errorText}</small>
      </div>
    </form>
  );
}

export default Form;
