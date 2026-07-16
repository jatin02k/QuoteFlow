'use server'

import { createClient } from "@/app/lib/supabase/server"
import { redirect } from "next/dist/client/components/navigation"

export async function SendOtp(email:string){
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options:{
            shouldCreateUser: true
        }
    })

    if (error){
        return { success: false, error: error.message }
    }
    return { success: true, data: data }
}

export async function VerifyOtp(email:string, token:string){
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
    })

    if (error) {
        return {success: false, error: error.message}
    }
    redirect('/dashboard')
}

export async function SignOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}