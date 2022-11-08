import React from 'react'
import { useNavigate} from "react-router-dom";

function Homepage() {
    const navigate = useNavigate();
    const navigateToAdmin = () => {
        navigate('/admin');
    }
    const navigateToUsers = () => {
        navigate('/users');
    }

  return (
      <div className="jumbotron text-center">
          <h1 className="display-4">Welcome to the exam visualization</h1>
          <p className="lead">
              This is a web app that can help you to do some things depending on your role.
          </p>

          <hr className="my-4" />
          <p>
              Choose your role now and let's rock it together !
          </p>

          <p className="lead">
              <button className="btn btn-success"
                      onClick={navigateToAdmin}>Admin
              </button>
              <br/>
              <br/>
              <button className="btn btn-success"
                        onClick={navigateToUsers}>Users
              </button>
          </p>

      </div>
  );
}

export default Homepage
