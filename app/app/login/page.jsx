'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e)=>{
    e.preventDefault()

    const res = await fetch('/api/admin/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({email,password})
    })

    const data = await res.json()

    if(data.success){
      router.push('/app/admin/dashboard')
    }else{
      setError('Invalid credentials')
    }
  }

  return(
    <div style={{maxWidth:400,margin:'100px auto',padding:24,border:'1px solid #eee',borderRadius:8}}>
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <br/><br/>

        {error && <p style={{color:'red'}}>{error}</p>}

        <button type="submit">Login</button>

      </form>
    </div>
  )
}
