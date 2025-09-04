import React, { useEffect, useState } from 'react'


const Form = () => {
  const [name, setName] = useState(null)
  const [stage, setStage] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [email, setEmail] = useState(null)
  const [phone, setPhone] = useState(null)
  const [err, setErr] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (success){
      setTimeout(() => setSuccess(false), 5000)
    }
  }, [success])

  const submitForm = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (name && stage && avatar && email && phone){
      console.log(avatar)
      try {
        const response = await fetch("/api/confirmation", {method: 'POST', body: JSON.stringify(
            {
                name,
                stage, 
                avatar,
                email,
                phone
            }
        )})
        setSuccess(true)
        setName(null)
        setStage(null)
        setAvatar(null)
        setEmail(null)
        setPhone(null)
      } catch (error) {
          console.log(error.message)
      } finally {
          setLoading(false)
      }
    } else {
      setErr("Kindly Enter All Data...")
      setLoading(false)
    }
  }

  const avatars = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg", "7.jpeg", "8.jpeg", "9.jpeg", "10.jpeg", "11.jpeg", "12.jpeg", "13.jpeg", "14.jpeg"]
  return (
    
<form action="" class="form font-dongle h-full">
    <p>
        Join Now!
    </p>
    
   
    <div className="flex gap-5 w-full">
    <input type="text" value={name || ''} onInput={(e) => setName(e.target.value)} placeholder="Full Name" name="text" className='w-full input' />
    <select id="" value={stage || ''} onChange={(e) => setStage(e.target.value)} className='form bg-white'>
      <option value="" disabled selected>Select Stage</option>
      <option value="AS">AS</option>
      <option value="A2">A2</option>
    </select>
    </div>
    <div className="flex gap-5 w-full">
    <input type="email" value={email || ''} onInput={(e) => setEmail(e.target.value)} placeholder="Email Address" name="email" className='w-full input' />
    <input type="tel" value={phone || ''} onInput={(e) => setPhone(e.target.value)} placeholder="Phone Number" name="phone" className='w-full input' />
    </div>
    {name && stage && email && phone && <div className="w-full img-box mb-10 h-32">
      <h3 className='font-weight-700'>Select Your Avatar</h3>
     <div className="grid grid-cols-7 gap-y-3 max-sm:grid-cols-4 w-full">
      {avatars.map(e => (
          <img className={`w-16 ${e == avatar ? "border-green-400" : ""} border-2 rounded-full hover:cursor-pointer h-16`} onClick={() => setAvatar(e)} src={`/${e}`} alt="" />
        ))}
     </div>
      </div>}
      <button 
        className={`oauthButton ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
        onClick={submitForm}
        disabled={loading}
        type="button"
      >
        <div className="flex items-center justify-center">
          {loading ? (
            <>
              <svg className="mr-3 w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send</span>
              <svg className="icon ml-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 17 5-5-5-5"></path>
                <path d="m13 17 5-5-5-5"></path>
              </svg>
            </>
          )}
        </div>
      </button>
      {err && <div className='bg-rose-600 w-full p-4 text-white rounded-xl'>
        {err}
        </div>}
   

{success && <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 fixed top-6 right-6 z-50" role="alert">
    <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span className="sr-only">Check icon</span>
    </div>
    <div className="ms-3 text-sm font-normal">Data Registered Successfully.</div>
</div>}




        
</form>
  )
}

export default Form
