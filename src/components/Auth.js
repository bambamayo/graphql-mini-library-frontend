import React, {useState} from 'react';

const Auth = (props) => {
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [password, setPassword] = useState("")
  const [favGenre, setFavGenre] = useState("")
  const [inView, setInView] = useState("login")

  if (!props.show) {
    return null;
  }

  const handleInView = (view) => {
    setInView(view)
  }

  return (
    <div>
      {setInView === "login" && (
        <form onSubmit={handleFormSubmit}>
          {inView === "signup" && (
            <div>
            fullname <input
              value={fullname}
              onChange={({ target }) => setFullname(target.value)}
            />
          </div>
          )} 
           <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        {inView === "signup" && (
           <div>
           username <input
             value={username}
             onChange={({ target }) => setUsername(target.value)}
           />
         </div>
        )}
        
        </form>
      )}
    </div>
  );
};

export default Auth;