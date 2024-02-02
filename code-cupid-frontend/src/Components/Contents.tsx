import { FormEvent, useState } from 'react'
import Form from './Form';
import Result from './Result';
import { Language, Role } from '../types';

function Contents() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function validateUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      setError('Please enter a valid GitHub URL');
      return false;
    }
  }

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>, role: Role, language: Language, repo: string) => {
    event.preventDefault();
    console.log(role, language, repo);

    if (repo && validateUrl(repo)) {
      const url = new URL(repo);
      if (url.host !== 'github.com') {
        setError('URL must be a valid GitHub URL');
      } else {
        setSubmitted(true);
      }
    } else if (role === Role.Developer) {
      setSubmitted(true);
    }
  }

  return (
    <main>
      {!submitted && <Form onSubmitHandler={onSubmitHandler} errorText={error} />}
      {submitted && <Result />}
    </main>
  );
}

export default Contents
