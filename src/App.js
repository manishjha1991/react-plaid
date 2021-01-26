import React, { useEffect, useState } from 'react';
import { PlaidLink } from 'react-plaid-link';
import "./App.css"
const App = props => {
const [apiKey,setApiKey] = useState("")
const [ status,setStatus] = useState("form");
const [userDetails,setUserDetails] = useState({fName:"",lName:"",email:"",address:""})
const [otp,setOtp] = useState(0)
  useEffect(()=>{
    setUpApiKey()
  },[])
  const setUpApiKey = async ()=>{
    const res = await fetch("http://localhost:9000/link",{
      method:"POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "email": "mkjha9555@gmail.com",
        })
    })
    const keys = await res.json()
    if(keys && keys.results && keys.results.link_token){
      console.log(res)
      setApiKey(keys.results.link_token)
    }
  }
  const onSuccess = async (token, metadata) => {
    console.log(token,metadata)
    const res = await fetch("http://localhost:9000/account-info",{
      method: 'post',
      headers: {'Content-Type':'application/json'},
       body: JSON.stringify({
     "token": token,
      "metadata":metadata
     })
    })
    // const keys = await res.json()
    console.log(res.json,"TOKEN")
  }

  const onChange = (value) =>{
    const currentDetails = userDetails;
    let newDetails = Object.assign({},currentDetails,value)
    setUserDetails(newDetails)
  }
  const generateOtp =async ()=>{
    const res = await fetch("http://localhost:9000/signup",{
      method:"POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify( {
        "email":userDetails.email,
        "firstName":userDetails.fName,
        "lastName":userDetails.lName,
        "address":userDetails.address
      } )
    })
    const data = await res.json()
    console.log(res,data)
    if(data.results){

      setStatus("otpScreen")
    }
  }
  const authenticate = async () =>{
    const res = await fetch("http://localhost:9000/verifyotp",{
      method:"POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify( {
        "email":userDetails.email,
        verificationCode:otp
      } )
    })
    const data = await res.json()
    if(data.results){
      if(data.results.status !== "VERIFIED"){
        window.alert("OTP was not correct")
        setStatus("otpScreen")
      }else{
        setStatus("account");
      }
    
    }
  }

  if(status == "form"){
    return <div className="form">
      <div className="inputHolder">
        <input type="text" placeholder="First Name"  className="input" 
        value={userDetails.fName}  
        onChange={e=>onChange({fName:e.target.value})}
        />
        </div>
        <div className="inputHolder">
        <input type="text" placeholder="Last Name"  className="input" 
         value={userDetails.lName}  
         onChange={e=>onChange({lName:e.target.value})}
          />
        </div>
        <div className="inputHolder">
        <input type="text" placeholder="Email"  className="input"
         value={userDetails.email}  
         onChange={e=>onChange({email:e.target.value})}
          />
        </div>  
        <div className="inputHolder">
        <input type="text" placeholder="Address"  className="input"
         value={userDetails.address}  
         onChange={e=>onChange({address:e.target.value})}
          />
        </div>
        <button className="button" onClick={()=>generateOtp()}> Submit </button>
      </div>
  }
  if(status == "otpScreen"){
    return <div className="form">
        <div className="inputHolder">
        <input type="number" placeholder="OTP"  className="input"
         value={otp}  
         onChange={e=>setOtp(e.target.value)}
          />
        </div>  
        <button className="button" onClick={()=>authenticate()}> Submit </button>
      </div>
  }
  if(!apiKey){
    return <div className="form"><h1>Loaiding... for api key </h1></div>
  }
  return (
    <div className="form">
    <PlaidLink
      token={apiKey}
      onSuccess={onSuccess}
    >
      Connect a bank account
    </PlaidLink></div>
  );
};
export default App;