import { FormEvent, useState } from 'react'
import Form from './Form';
import Result from './Result';
import { Language, Role } from '../types';
import { API_URL } from '../constants';

interface ApiResponse {
  id: number;
  name: string;
  // Add other fields based on the actual data structure
}

function Contents() {
  const [repos, setRepos] = useState<ApiResponse[]>([]);
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

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>, role: Role, language: Language, repo: string) => {
    event.preventDefault();
    console.log(role, language, repo);

    if (repo && validateUrl(repo)) {
      const url = new URL(repo);
      if (url.host !== 'github.com') {
        setError('URL must be a valid GitHub URL');
      } else {
        try {
          const endpoint = `${API_URL}repo`;
          const response = await fetch(endpoint);
    
          if (!response.ok) {
            setError('Network response was not ok');
          }
    
          const jsonData: ApiResponse[] = await response.json();
          console.log(jsonData);
          setRepos(jsonData);
          setSubmitted(true);
        } catch (error) {
          console.error('There was a problem posting the data:', error);
          setError(`Failed to post data: ${JSON.stringify(error)}`);
        }
      }
    } else if (role === Role.Developer) {
      try {
        const endpoint = `${API_URL}repos/${encodeURIComponent(language)}`;
        const response = await fetch(endpoint);
  
        if (!response.ok) {
          setError('Network response was not ok');
        }
  
        const jsonData: ApiResponse[] = await response.json();
        console.log(jsonData);
        setRepos(jsonData);
        setSubmitted(true);
      } catch (error) {
        console.error('There was a problem fetching the data:', error);
        setError(`Failed to fetch data: ${JSON.stringify(error)}`);
      }
    }
  }

  return (
    <main>
      {!submitted && <Form onSubmitHandler={onSubmitHandler} errorText={error} />}
      {submitted && <Result repos={repos} />}
    </main>
  );
}

export default Contents
