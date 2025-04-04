"use client"
import Form from '@/components/Form'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import {useRouter} from "next/navigation"

const page = () => {
    const [submitting, setSubmitting] = useState(false)
    const [post, setPost] = useState({
        prompt: "",
        tag: ""
    })

    const {data:session} = useSession()
    const router = useRouter()

    const createPrompt = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const response = await fetch("/api/prompt/new", {method: 'POST', body: JSON.stringify(
                {
                    prompt: post.prompt,
                    userId: session?.user.id,
                    tag: post.tag
                }
            )})

            if (response.ok) {
                router.push('/')
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setSubmitting(false)
        }
    }

  return (
    <Form
        type={"Create"}
        post={post}
        setPost={setPost}
        setSubmitting={setSubmitting}
        submitting={submitting}
        handleSubmit={createPrompt}
    />
  )
}

export default page