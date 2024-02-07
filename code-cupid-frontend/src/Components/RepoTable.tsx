import { useState } from 'react';
import { ApiResponse } from '../types';

type RepoTableProps = {
  repos: ApiResponse[];
  success: string;
  setSubmitted: (value: boolean) => void;
}

function RepoTable(props: RepoTableProps) {
  const [data, setData] = useState(props.repos);
  const [sortField, setSortField] = useState('id');
  const [sortAscending, setSortAscending] = useState(true);

  const sortData = (field: 'id' | 'language', ascending: boolean = true) => {
    return function (a: ApiResponse, b: ApiResponse) {
      if (a[field] < b[field]) return ascending ? -1 : 1;
      if (a[field] > b[field]) return ascending ? 1 : -1;
      return 0;
    };
  };

  const handleSort = (field: 'id' | 'language') => {
    const isAscending = field === sortField ? !sortAscending : true;
    setData([...data].sort(sortData(field, isAscending)));
    setSortField(field);
    setSortAscending(isAscending);
  };

  const renderSortIndicator = (field: 'id' | 'language') => {
    return sortField === field ? (sortAscending ? '↑' : '↓') : null;
  };

  const handleReset = () => {
    props.setSubmitted(false);
  };

  if (!data.length) {
    return (
      <>
        <p>Sorry, no repositories found.</p>
        <button onClick={handleReset}>Search again</button>
      </>);
  }

  return (
    <>
    {props.success && <h3>{props.success}</h3>}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID {renderSortIndicator('id')}</th>
            <th onClick={() => handleSort('language')}>Language {renderSortIndicator('language')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td><a href={item.link} target="_blank" rel="noopener noreferrer">{item.id}</a></td>
              <td>{item.language}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleReset}>Search again</button>
    </>
  );
}

export default RepoTable;