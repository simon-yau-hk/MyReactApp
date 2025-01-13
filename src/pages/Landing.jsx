import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '~/context/AuthContext';
import { loginApi, meetupApi } from '~/API';

function Landing() {
  const [data, setData] = useState(null);
  const fetchRef = useRef(false); 
  useEffect(() => {
    console.log("data :",data);
    if(fetchRef.current==false)
    {
        fetchData();
        fetchRef.current = true;
    }
   
  }, [data]);
  const fetchData = async () => {
    try {
      // Call your API endpoint
      const data = await meetupApi.get();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleLogout = async () => {
    await loginApi.logout();
  };

  return (
    <div className="landing-container">
      <h1>Welcome to Dashboard</h1>
      <div className="user-info">
        
            <p>You are logged in!</p>
            {data && (
              <div>
                <p> {data.title}</p>
                {/* Display other user data as needed */}
              </div>
            )}
            <button onClick={handleLogout}>Logout</button>
       
        )
      </div>
    </div>
  );
}

export default Landing;