import { FormEvent, useState } from 'react';
import Form from './Form';
import RepoTable from './RepoTable';
import { ApiResponse, Language, Role } from '../types';
import { API_URL } from '../constants';

function Contents() {
  const [repos, setRepos] = useState<ApiResponse[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function validateUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      setError('Please enter a valid GitHub URL');
      return false;
    }
  }

  const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    });
    return response.json();
  };
  

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>, role: Role, language: Language, repo: string) => {
    event.preventDefault();

    if (repo && validateUrl(repo)) {
      const url = new URL(repo);
      if (url.host !== 'github.com') {
        setError('URL must be a valid GitHub URL');
      } else {
        try {
          // Post the new repo URL
          const endpoint = `${API_URL}/repo`;
          const result = await postData(endpoint, { repoURL: repo, language });

          setError('');
          setSuccess(`${result.id} sucessfully added!`);

          // Fetch all repos for the language, including the newly added one
          const fetchEndpoint = `${API_URL}/repos/${encodeURIComponent(language)}`;
          const response = await fetch(fetchEndpoint);
    
          if (!response.ok) {
            setError('Network response was not ok');
          }
    
          const jsonData: ApiResponse[] = await response.json();

          setRepos(jsonData);
          setSubmitted(true);
        } catch (error) {
          console.error('There was a problem posting the data:', error);
          setError(`Failed to post data: ${JSON.stringify(error)}`);
        }
      }
    } else if (role === Role.Developer) {
      try {
        // Fetch all repos for the language
        const endpoint = `${API_URL}/repos/${encodeURIComponent(language)}`;
        const response = await fetch(endpoint);
  
        if (!response.ok) {
          setError('Network response was not ok');
        }
  
        const jsonData: ApiResponse[] = await response.json();

        setRepos(jsonData);
        setError('');
        setSuccess('');
        setSubmitted(true);
      } catch (error) {
        console.error('There was a problem fetching the data:', error);
        setError(`Failed to fetch data: ${JSON.stringify(error)}`);
      }
    }
  };

  return (
    <main>
      {!submitted && <Form onSubmitHandler={onSubmitHandler} errorText={error} />}
      {submitted && <RepoTable repos={repos} setSubmitted={setSubmitted} success={success} />}
    </main>
  );
}

export default Contents;
