type ResultProps = {
  repos: []
}

function Result(props: ResultProps) {

  return (
    <div>
      <p>{props.repos}</p>
    </div>
  );
}

export default Result
