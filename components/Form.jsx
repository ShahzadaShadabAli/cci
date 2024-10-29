import React from 'react'

const Form = () => {
  return (
    /* From Uiverse.io by D3OXY */ 
<form action="" class="form font-dongle">
    <p>
        Hit Us Up!
    </p>
    
   
    <div className="flex gap-5 w-full">
    <input type="email" placeholder="Name" name="text" className='w-full' />
    <input type="email" placeholder="Email" name="email" className='w-full' />
    </div>
    <textarea className='w-full h-32' placeholder='Your Message'></textarea>
    <button class="oauthButton">
                    Send
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
                </button>
</form>
  )
}

export default Form
